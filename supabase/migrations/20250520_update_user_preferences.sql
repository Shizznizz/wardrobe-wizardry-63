
-- Add appearance_settings column to user_preferences table if it doesn't exist
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS appearance_settings JSONB DEFAULT NULL;

-- Create index for faster user preference lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id
ON public.user_preferences (user_id);
