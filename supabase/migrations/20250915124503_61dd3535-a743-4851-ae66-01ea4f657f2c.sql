-- Update leaderboard table to match new cognitive challenge questions
-- Remove old cognitive question columns
ALTER TABLE public.leaderboard 
DROP COLUMN IF EXISTS dream_job,
DROP COLUMN IF EXISTS favorite_dishes,
DROP COLUMN IF EXISTS favorite_places,
DROP COLUMN IF EXISTS childhood_friend,
DROP COLUMN IF EXISTS pet_name;

-- Add new cognitive question columns
ALTER TABLE public.leaderboard 
ADD COLUMN battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
ADD COLUMN favorite_emoji TEXT,
ADD COLUMN special_talent TEXT,
ADD COLUMN world_change TEXT,
ADD COLUMN session_rating TEXT CHECK (session_rating IN ('Yes', 'No')),
ADD COLUMN session_feedback TEXT;