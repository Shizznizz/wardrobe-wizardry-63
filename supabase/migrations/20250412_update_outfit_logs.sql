
-- Create table for outfit logs if it doesn't exist already
CREATE TABLE IF NOT EXISTS public.outfit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outfit_id TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time_of_day TEXT NOT NULL,
  notes TEXT,
  weather_condition TEXT,
  temperature TEXT,
  activity TEXT,
  custom_activity TEXT,
  ai_suggested BOOLEAN DEFAULT false,
  ai_suggestion_feedback TEXT,
  occasion_emoji TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies for outfit logs if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'outfit_logs' AND policyname = 'Users can view their own outfit logs'
  ) THEN
    -- Create policy to allow users to view their own outfit logs
    CREATE POLICY "Users can view their own outfit logs"
      ON public.outfit_logs
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'outfit_logs' AND policyname = 'Users can insert their own outfit logs'
  ) THEN
    -- Create policy to allow users to insert their own outfit logs
    CREATE POLICY "Users can insert their own outfit logs"
      ON public.outfit_logs
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'outfit_logs' AND policyname = 'Users can update their own outfit logs'
  ) THEN
    -- Create policy to allow users to update their own outfit logs
    CREATE POLICY "Users can update their own outfit logs"
      ON public.outfit_logs
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'outfit_logs' AND policyname = 'Users can delete their own outfit logs'
  ) THEN
    -- Create policy to allow users to delete their own outfit logs
    CREATE POLICY "Users can delete their own outfit logs"
      ON public.outfit_logs
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Enable RLS on the outfit_logs table
ALTER TABLE public.outfit_logs ENABLE ROW LEVEL SECURITY;

-- Function to update updated_at automatically
CREATE OR REPLACE FUNCTION update_outfit_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_outfit_logs_updated_at'
  ) THEN
    CREATE TRIGGER update_outfit_logs_updated_at
    BEFORE UPDATE ON public.outfit_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_outfit_logs_updated_at();
  END IF;
END $$;

-- Add subscription to realtime updates for the outfit_logs table
ALTER TABLE public.outfit_logs REPLICA IDENTITY FULL;

-- Make outfit_logs visible to realtime subscriptions
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.outfit_logs;
COMMIT;
