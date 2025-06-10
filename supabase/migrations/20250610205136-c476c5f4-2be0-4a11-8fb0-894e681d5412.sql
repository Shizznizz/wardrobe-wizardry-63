
-- Create table for tracking user chat limits
CREATE TABLE public.user_chat_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message_count INTEGER NOT NULL DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_chat_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for user chat limits
CREATE POLICY "Users can view their own chat limits" 
  ON public.user_chat_limits 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat limits" 
  ON public.user_chat_limits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat limits" 
  ON public.user_chat_limits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_chat_limits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_chat_limits_updated_at
  BEFORE UPDATE ON public.user_chat_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_chat_limits_updated_at();

-- Create unique constraint to ensure one record per user
ALTER TABLE public.user_chat_limits ADD CONSTRAINT unique_user_chat_limit UNIQUE (user_id);
