
import { TimeOfDay, Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Coffee, Sun, Sunset, Moon, AlarmClockCheck, RefreshCw, Party, Sparkles, Calendar } from "lucide-react";
import { PartyPopper } from "lucide-react";

interface OutfitPreferencesProps {
  timeOfDay: TimeOfDay;
  activity: Activity;
  setTimeOfDay: (time: TimeOfDay) => void;
  setActivity: (activity: Activity) => void;
}

const OutfitPreferences = ({
  timeOfDay,
  activity,
  setTimeOfDay,
  setActivity
}: OutfitPreferencesProps) => {
  const timeOfDayIcons = {
    morning: <Coffee className="h-4 w-4 mr-1" />,
    afternoon: <Sun className="h-4 w-4 mr-1" />,
    evening: <Sunset className="h-4 w-4 mr-1" />,
    night: <Moon className="h-4 w-4 mr-1" />
  };
  
  const activityIcons = {
    work: <AlarmClockCheck className="h-4 w-4 mr-1" />,
    casual: <Coffee className="h-4 w-4 mr-1" />,
    sport: <RefreshCw className="h-4 w-4 mr-1" />,
    party: <PartyPopper className="h-4 w-4 mr-1" />,
    date: <Sparkles className="h-4 w-4 mr-1" />,
    formal: <Calendar className="h-4 w-4 mr-1" />
  };

  return (
    <Collapsible className="mt-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center justify-between w-full">
          <span>Outfit Preferences</span>
          <span className="text-muted-foreground text-sm">Time & Activity</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Time of Day</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(Object.keys(timeOfDayIcons) as TimeOfDay[]).map((time) => (
              <Button
                key={time}
                variant={timeOfDay === time ? "default" : "outline"}
                size="sm"
                className="flex items-center justify-center"
                onClick={() => setTimeOfDay(time)}
              >
                {timeOfDayIcons[time]}
                <span className="capitalize">{time}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(Object.keys(activityIcons) as Activity[]).map((act) => (
              <Button
                key={act}
                variant={activity === act ? "default" : "outline"}
                size="sm"
                className="flex items-center justify-center"
                onClick={() => setActivity(act)}
              >
                {activityIcons[act]}
                <span className="capitalize">{act}</span>
              </Button>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default OutfitPreferences;
