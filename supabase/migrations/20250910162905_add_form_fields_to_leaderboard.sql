-- Add form data fields to leaderboard table
ALTER TABLE public.leaderboard 
ADD COLUMN favorite_dishes TEXT,
ADD COLUMN favorite_places TEXT,
ADD COLUMN pet_name TEXT,
ADD COLUMN childhood_friend TEXT,
ADD COLUMN dream_job TEXT,
ADD COLUMN cognitive_score INTEGER DEFAULT 0;
