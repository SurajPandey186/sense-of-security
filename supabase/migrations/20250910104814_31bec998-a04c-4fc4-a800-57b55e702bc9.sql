-- Create leaderboard table for form submissions
CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can view leaderboard)
CREATE POLICY "Anyone can view leaderboard" 
ON public.leaderboard 
FOR SELECT 
USING (true);

-- Create policy for public insert (anyone can submit)
CREATE POLICY "Anyone can submit to leaderboard" 
ON public.leaderboard 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard;