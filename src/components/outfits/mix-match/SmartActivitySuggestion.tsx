
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Cloud, Sun, Zap } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SmartActivitySuggestionProps {
  weather?: WeatherInfo;
  onSuggestionSelect: (activity: string) => void;
}

const SmartActivitySuggestion = ({ weather, onSuggestionSelect }: SmartActivitySuggestionProps) => {
  const [suggestion, setSuggestion] = useState('');
  const [activity, setActivity] = useState('casual');
  const { user } = useAuth();
  
  useEffect(() => {
    generateSuggestion();
  }, [weather]);
  
  const generateSuggestion = async () => {
    // Get day of week
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Analyze weather
    const temp = weather?.temperature || 20;
    const condition = weather?.condition?.toLowerCase() || 'clear';
    
    let suggestedActivity = 'casual';
    let message = '';
    
    // Get user's preferences if logged in
    if (user) {
      try {
        // Check most common activities from previous selections
        const { data: logs } = await supabase
          .from('outfit_logs')
          .select('activity')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        // Check calendar events for today
        const { data: events } = await supabase
          .from('calendar_events')
          .select('activity_tag')
          .eq('user_id', user.id)
          .gte('date', new Date().toISOString().split('T')[0])
          .lt('date', new Date(today.getTime() + 24*60*60*1000).toISOString().split('T')[0]);
        
        if (events && events.length > 0) {
          // User has a scheduled event today
          suggestedActivity = events[0].activity_tag || 'casual';
          message = `You have a ${suggestedActivity} event scheduled today!`;
          setActivity(suggestedActivity);
          setSuggestion(message);
          return;
        }
        
        if (logs && logs.length > 0) {
          // Count most common activities
          const activityCount: Record<string, number> = {};
          logs.forEach(log => {
            if (log.activity) {
              activityCount[log.activity] = (activityCount[log.activity] || 0) + 1;
            }
          });
          
          // Find most common activity
          let maxCount = 0;
          let mostCommonActivity = 'casual';
          
          Object.entries(activityCount).forEach(([activity, count]) => {
            if (count > maxCount) {
              maxCount = count;
              mostCommonActivity = activity;
            }
          });
          
          suggestedActivity = mostCommonActivity;
        }
      } catch (error) {
        console.error("Error fetching user data for suggestions:", error);
      }
    }
    
    // Generate message based on day + weather + history
    if (isWeekend) {
      if (condition.includes('rain') || condition.includes('snow')) {
        message = "Weekend indoors? How about a Cozy Casual look?";
        suggestedActivity = 'casual';
      } else if (temp > 25) {
        message = "Perfect weekend for outdoor activities! Sporty Casual could work well.";
        suggestedActivity = 'sport';
      } else {
        message = "Planning a relaxed weekend? Casual Comfort might be perfect.";
        suggestedActivity = 'casual';
      }
    } else {
      // Weekday
      if (condition.includes('rain')) {
        message = "Rainy workday ahead! Smart casual with layers could work well.";
        suggestedActivity = 'smart casual';
      } else {
        message = "Heading to work? A Business Casual look might be perfect today.";
        suggestedActivity = 'business casual';
      }
    }
    
    setActivity(suggestedActivity);
    setSuggestion(message);
  };
  
  const handleSelect = () => {
    onSuggestionSelect(activity);
  };
  
  if (!suggestion) return null;
  
  return (
    <Card className="border border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 mb-6">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 text-purple-400 bg-purple-900/40 p-2 rounded-full">
            {weather?.condition?.toLowerCase().includes('rain') ? (
              <Cloud className="h-5 w-5" />
            ) : weather?.condition?.toLowerCase().includes('sun') ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Zap className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="text-white text-lg font-medium">{suggestion}</h3>
            <div className="flex items-center text-white/70 text-sm">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{new Date().toLocaleDateString(undefined, { weekday: 'long' })}</span>
              <span className="mx-2">•</span>
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <Button 
          variant="outline"
          className="border-purple-500/30 text-white hover:bg-white/10"
          onClick={handleSelect}
        >
          Use Suggestion
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartActivitySuggestion;
