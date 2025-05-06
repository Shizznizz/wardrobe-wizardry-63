
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Star, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useOutfitContext } from '@/hooks/useOutfitContext';

const WeeklyStyleChallenge = () => {
  const [challenge, setChallenge] = useState<{
    id: string;
    title: string;
    description: string;
    endDate: Date;
    participants: number;
  } | null>(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { 
    setIsBuilderOpen, 
    setIsCreatingNewOutfit 
  } = useOutfitContext();
  
  useEffect(() => {
    fetchCurrentChallenge();
  }, []);
  
  const fetchCurrentChallenge = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would fetch from Supabase
      // For now, we'll use a mock challenge
      const currentDate = new Date();
      const endOfWeek = new Date();
      endOfWeek.setDate(currentDate.getDate() + (7 - currentDate.getDay()));
      
      // Determine challenge theme based on day of week
      const dayOfWeek = currentDate.getDay();
      let title = "Weekly Style Challenge";
      let description = "Create a unique outfit matching this week's theme!";
      
      switch (dayOfWeek) {
        case 1: // Monday
          title = "Monochrome Monday";
          description = "Create an outfit using a single color palette";
          break;
        case 2: // Tuesday
          title = "Texture Tuesday";
          description = "Mix different textures in your outfit";
          break;
        case 3: // Wednesday
          title = "Workwear Wednesday";
          description = "Create your perfect office outfit";
          break;
        case 4: // Thursday
          title = "Throwback Thursday";
          description = "Create an outfit inspired by a past decade";
          break;
        case 5: // Friday
          title = "Fashionable Friday";
          description = "Show off your most stylish outfit";
          break;
        case 6: // Saturday
          title = "Statement Saturday";
          description = "Include one bold statement piece in your outfit";
          break;
        default: // Sunday
          title = "Sustainable Sunday";
          description = "Create an outfit using sustainable or vintage pieces";
      }
      
      setChallenge({
        id: `challenge-${dayOfWeek}`,
        title,
        description,
        endDate: endOfWeek,
        participants: Math.floor(Math.random() * 100) + 50 // Random number between 50-150
      });
      
      // Check if user is already participating
      if (user) {
        try {
          const { data } = await supabase
            .from('challenge_entries')
            .select('id')
            .eq('user_id', user.id)
            .eq('challenge_id', `challenge-${dayOfWeek}`);
          
          setIsParticipating(data && data.length > 0);
        } catch (error) {
          console.error("Error checking participation:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching challenge:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleJoinChallenge = async () => {
    if (!user) {
      toast.error("Please sign in to join the challenge");
      return;
    }
    
    if (!challenge) return;
    
    try {
      // Open the outfit creator/builder
      setIsCreatingNewOutfit(true);
      setIsBuilderOpen(true);
      
      // Mark as participating
      setIsParticipating(true);
      
      // Save to Supabase
      await supabase.from('challenge_entries').insert({
        user_id: user.id,
        challenge_id: challenge.id,
        created_at: new Date().toISOString(),
        status: 'started'
      });
      
      toast.success(`You've joined the ${challenge.title} challenge!`);
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast.error("Couldn't join the challenge");
    }
  };
  
  if (isLoading) {
    return (
      <Card className="border border-white/10 bg-slate-900/40 mb-8 animate-pulse">
        <CardContent className="p-6 h-32"></CardContent>
      </Card>
    );
  }
  
  if (!challenge) return null;
  
  return (
    <Card className="border border-amber-500/20 bg-gradient-to-r from-amber-900/20 to-orange-900/20 mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-amber-400" />
              <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
            </div>
            <p className="text-white/80 mb-2">{challenge.description}</p>
            <div className="flex items-center text-white/60 text-sm mb-4">
              <Users className="h-3.5 w-3.5 mr-1" />
              <span>{challenge.participants} participants</span>
              <span className="mx-2">•</span>
              <span>Ends {challenge.endDate.toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 sm:items-end">
            <Button
              variant="outline"
              className={isParticipating 
                ? "border-amber-500/50 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30" 
                : "border-amber-500/30 text-white hover:bg-white/10"
              }
              onClick={handleJoinChallenge}
              disabled={isParticipating}
            >
              {isParticipating ? (
                <>
                  <Star className="h-4 w-4 mr-2 fill-amber-400 text-amber-400" />
                  Participating
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-2" />
                  Join Challenge
                </>
              )}
            </Button>
            
            {isParticipating && (
              <p className="text-amber-300/80 text-xs">
                Create an outfit to submit to the challenge
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyStyleChallenge;
