
import { useState } from 'react';
import { Outfit, WeatherInfo, TimeOfDay, Activity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, AlertTriangle } from 'lucide-react';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import OutfitPreferences from './OutfitPreferences';
import { toast } from 'sonner';

interface OutfitContentProps {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  selectedOutfit: Outfit | null;
  timeOfDay: TimeOfDay;
  activity: Activity;
  setTimeOfDay: (time: TimeOfDay) => void;
  setActivity: (activity: Activity) => void;
  handleRefresh: () => void;
}

const OutfitContent = ({
  isLoading,
  isRefreshing,
  error,
  selectedOutfit,
  timeOfDay,
  activity,
  setTimeOfDay,
  setActivity,
  handleRefresh
}: OutfitContentProps) => {
  return (
    <div className="p-4 bg-card rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Today's Outfit Suggestion</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
        >
          {isRefreshing ? 
            <Skeleton className="h-4 w-4 rounded-full mr-2" /> : 
            <RefreshCw className="h-4 w-4 mr-2" />
          }
          New Suggestion
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full rounded-md" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      ) : (
        <div>
          {selectedOutfit && (
            <OutfitSuggestion outfit={selectedOutfit} />
          )}
          
          <OutfitPreferences 
            timeOfDay={timeOfDay}
            activity={activity}
            setTimeOfDay={setTimeOfDay}
            setActivity={setActivity}
          />
        </div>
      )}
    </div>
  );
};

export default OutfitContent;
