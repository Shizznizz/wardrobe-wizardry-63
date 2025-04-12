
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherInfo } from '@/lib/types';

// Lazy load this component
const OliviaRecommendation = lazy(() => import('@/components/outfits/OliviaRecommendation'));

interface OutfitRecommendationSectionProps {
  weather?: WeatherInfo;
  situation?: string;
}

const OutfitRecommendationSection = ({ weather, situation }: OutfitRecommendationSectionProps) => {
  return (
    <section className="mb-8">
      <Suspense fallback={
        <div className="p-8 bg-slate-900/70 border border-white/10 rounded-xl">
          <div className="flex flex-col gap-4 items-center">
            <Skeleton className="h-8 w-64 rounded-md" />
            <Skeleton className="h-64 w-full max-w-md rounded-md" />
            <Skeleton className="h-8 w-full max-w-lg rounded-md" />
          </div>
        </div>
      }>
        <OliviaRecommendation weather={weather} situation={situation} />
      </Suspense>
    </section>
  );
};

export default OutfitRecommendationSection;
