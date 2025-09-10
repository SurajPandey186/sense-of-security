import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Medal, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  score: number;
  created_at: string;
  favorite_dishes: string | null;
  favorite_places: string | null;
  pet_name: string | null;
  childhood_friend: string | null;
  dream_job: string | null;
  cognitive_score: number | null;
}

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('created_at', { ascending: true }); // First submission at top

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'leaderboard'
        },
        () => {
          // Refetch data when changes occur
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="h-6 w-6 flex items-center justify-center text-muted-foreground font-bold">#{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              ← Back to Workshop
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8" />
            Workshop Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Real-time updates • Form submissions from cognitive challenge
          </p>
        </div>


        {/* Leaderboard */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Leaderboard ({entries.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No entries yet. Be the first to submit!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${index === 0 ? 'bg-yellow-50 border-yellow-200' :
                        index === 1 ? 'bg-gray-50 border-gray-200' :
                          index === 2 ? 'bg-amber-50 border-amber-200' :
                            'bg-muted/50 border-border'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      {getRankIcon(index)}
                      <div>
                        <p className="font-semibold text-lg">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {new Date(entry.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">#{index + 1}</p>
                      <p className="text-xs text-muted-foreground">rank</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Update Indicator */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-full">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            Live updates enabled
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;