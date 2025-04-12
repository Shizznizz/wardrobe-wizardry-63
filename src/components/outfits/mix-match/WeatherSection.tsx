
import React from 'react';
import OptimizedWeatherSummary from '@/components/weather/OptimizedWeatherSummary';
import StyleContextDrawer from '@/components/outfits/StyleContextDrawer';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { WeatherInfo } from '@/lib/types';

interface WeatherSectionProps {
  onWeatherUpdate: (weatherData: { temperature: number; condition: string }) => void;
  onSituationChange: (situation: string) => void;
}

const WeatherSection = ({ onWeatherUpdate, onSituationChange }: WeatherSectionProps) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <OptimizedWeatherSummary 
        onWeatherUpdate={onWeatherUpdate}
        className="flex-1 max-w-md"
        compact
      />
      
      {/* Context Customization */}
      <Suspense fallback={<Skeleton className="h-10 w-36 rounded-md ml-2" />}>
        <StyleContextDrawer 
          onWeatherChange={onWeatherUpdate}
          onSituationChange={onSituationChange}
          compact={true}
        />
      </Suspense>
    </div>
  );
};

export default WeatherSection;
