
-- Add new columns to user_preferences table for profile page
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS use_trends_global BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS use_trends_local BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS use_only_wardrobe BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS temperature_unit TEXT DEFAULT 'C',
ADD COLUMN IF NOT EXISTS weekly_email_updates BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notify_new_outfits BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_weather_changes BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS pronouns TEXT DEFAULT 'not-specified',
ADD COLUMN IF NOT EXISTS custom_pronouns TEXT DEFAULT NULL;

-- Add pronouns column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pronouns TEXT DEFAULT 'not-specified';
