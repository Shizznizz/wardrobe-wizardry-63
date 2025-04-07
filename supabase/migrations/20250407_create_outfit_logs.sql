
-- Create table for outfit logs
CREATE TABLE IF NOT EXISTS public.outfit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outfit_id TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time_of_day TEXT NOT NULL,
  notes TEXT,
  weather_condition TEXT,
  temperature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies for outfit logs
ALTER TABLE public.outfit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own outfit logs
CREATE POLICY "Users can view their own outfit logs"
  ON public.outfit_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own outfit logs
CREATE POLICY "Users can insert their own outfit logs"
  ON public.outfit_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own outfit logs
CREATE POLICY "Users can update their own outfit logs"
  ON public.outfit_logs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own outfit logs
CREATE POLICY "Users can delete their own outfit logs"
  ON public.outfit_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically set updated_at on update
CREATE OR REPLACE FUNCTION update_outfit_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER update_outfit_logs_updated_at
BEFORE UPDATE ON public.outfit_logs
FOR EACH ROW
EXECUTE FUNCTION update_outfit_logs_updated_at();
