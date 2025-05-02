
import React, { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface StyleQuizProps {
  onComplete: (answers: Record<string, string>) => void;
}

const StyleQuiz = ({ onComplete }: StyleQuizProps) => {
  const [activity, setActivity] = useState<string>('casual');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleSubmit = useCallback(() => {
    if (activity) {
      onComplete({ activity });
      toast.success("Style preferences updated!");
      setIsCollapsed(true);
    } else {
      toast.error("Please select an activity");
    }
  }, [activity, onComplete]);
  
  return (
    <Collapsible
      open={!isCollapsed}
      onOpenChange={setIsCollapsed}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h3 className="font-medium text-white">Today's Mood</h3>
        </div>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 w-7 p-0"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4 text-white/70" /> : <ChevronUp className="h-4 w-4 text-white/70" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="mb-3">
          <p className="text-sm text-white/70">
            Tell Olivia what you're planning today, and she'll pick the perfect outfit.
          </p>
        </div>
        
        <RadioGroup
          value={activity}
          onValueChange={setActivity}
          className="grid grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="casual" id="casual" />
            <Label htmlFor="casual">Casual Day</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="work" id="work" />
            <Label htmlFor="work">Working</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sport" id="sport" />
            <Label htmlFor="sport">Sports</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="formal" id="formal" />
            <Label htmlFor="formal">Formal</Label>
          </div>
        </RadioGroup>
        
        <Button
          variant="default"
          size="sm"
          className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
          onClick={handleSubmit}
        >
          Update My Mood
        </Button>
      </CollapsibleContent>
      
      {isCollapsed && (
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            {activity.charAt(0).toUpperCase() + activity.slice(1)} Mood
          </Badge>
          <span className="text-xs text-white/60">(Click to change)</span>
        </div>
      )}
    </Collapsible>
  );
};

export default StyleQuiz;
