
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';

interface WeatherErrorProps {
  error: string;
  weather: WeatherInfo | null;
}

const WeatherError = ({ error, weather }: WeatherErrorProps) => {
  return (
    <div className="text-center p-2">
      <div className="bg-red-900/50 rounded-lg p-3 mb-2 border border-red-500/40">
        <div className="flex items-center justify-center mb-1">
          <AlertCircle className="text-red-400 w-5 h-5 mr-2" />
          <h3 className="font-medium text-white">Weather Data Error</h3>
        </div>
        <p className="text-sm text-white/80 mb-2">
          {error.includes('city not found') ? 
            `Weather data not available for ${weather?.city || 'this location'}` : 
            error}
        </p>
      </div>
      
      {weather && (
        <div className="text-sm text-white/70 p-2 bg-slate-800/50 rounded-lg border border-white/10">
          <p>Showing estimated weather instead</p>
          <div className="font-medium mt-1">
            {weather.temperature}°C, {weather.condition}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherError;
