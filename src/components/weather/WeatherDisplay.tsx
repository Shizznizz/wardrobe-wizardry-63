
import React from 'react';
import { WeatherInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import WeatherIcon from './WeatherIcon';

interface WeatherDisplayProps {
  weather: WeatherInfo;
  compact?: boolean;
}

const WeatherDisplay = ({ weather, compact = false }: WeatherDisplayProps) => {
  return (
    <div className={cn("flex flex-col", compact ? "gap-2" : "gap-3")}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className={cn("font-medium text-white", compact ? "text-sm" : "text-base")}>
            {weather.city || 'Unknown Location'}
          </h3>
          <p className={cn("text-white/60", compact ? "text-xs" : "text-sm")}>
            {weather.condition}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <WeatherIcon iconName={weather.icon} size={compact ? 24 : 32} />
          <span className={cn("font-medium text-white", compact ? "text-xl" : "text-2xl")}>
            {typeof weather.temperature === 'number' ? `${weather.temperature}°` : '--°'}
          </span>
        </div>
      </div>
      
      {!compact && (
        <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-white/50">Feels like</span>
            <span className="text-white">{weather.feelsLike ? `${weather.feelsLike}°` : '--°'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-white/50">Humidity</span>
            <span className="text-white">{weather.humidity ? `${weather.humidity}%` : '--'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;
