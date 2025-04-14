
import React from 'react';
import { SunIcon, CloudIcon, DropletIcon, ClockIcon } from 'lucide-react';
import { WeatherInfo, Outfit } from '@/lib/types';

interface OliviaRecommendationBoxProps {
  weather: WeatherInfo;
  selectedOutfit: Outfit | null;
}

const OliviaRecommendationBox = ({ weather, selectedOutfit }: OliviaRecommendationBoxProps) => {
  // Ensure weather has default values if undefined
  const safeWeather: WeatherInfo = weather || {
    temperature: 20,
    condition: 'Unknown',
    icon: 'sun'
  };
  
  // Ensure we have a safe condition string
  const condition = safeWeather.condition ? safeWeather.condition.toLowerCase() : '';
  
  return (
    <div className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-lg border border-white/10 p-4 shadow-xl">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
          <span className="text-white text-xs">OB</span>
        </div>
        <h3 className="font-medium text-white">Olivia's Style Suggestions</h3>
      </div>
      
      <div className="mt-3 flex items-center gap-6">
        <div className="flex items-center space-x-2">
          {condition.includes('sun') && <SunIcon className="h-5 w-5 text-yellow-400" />}
          {condition.includes('cloud') && <CloudIcon className="h-5 w-5 text-gray-300" />}
          {condition.includes('rain') && <DropletIcon className="h-5 w-5 text-blue-400" />}
          {!condition.includes('sun') && !condition.includes('cloud') && !condition.includes('rain') && 
            <SunIcon className="h-5 w-5 text-yellow-400" />}
          <span className="text-sm text-white/70">{safeWeather.temperature}°C - {safeWeather.condition}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-4 w-4 text-white/50" />
          <span className="text-sm text-white/70">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      
      <p className="mt-3 text-sm text-white/70">
        {getWeatherBasedSuggestion(condition, safeWeather.temperature)}
      </p>
    </div>
  );
};

function getWeatherBasedSuggestion(condition: string, temperature: number): string {
  // No need to check for undefined condition since we're passing a safe string now
  
  if (condition.includes('rain')) {
    return "It's raining today! Consider something with a water-resistant outer layer and don't forget an umbrella!";
  } else if (condition.includes('cloud') && temperature < 15) {
    return "It's cloudy and cool. A light jacket or cardigan would be perfect for this weather.";
  } else if (condition.includes('sun') && temperature > 25) {
    return "It's sunny and warm! Light, breathable fabrics in bright colors would be ideal today.";
  } else if (condition.includes('sun') && temperature < 15) {
    return "Sunny but cool today. Layering would be ideal - try a light sweater with a jacket you can remove if needed.";
  } else if (temperature < 5) {
    return "It's quite cold! Time for that cozy winter coat, scarf, and boots.";
  } else if (temperature > 30) {
    return "It's very hot today! Opt for loose, light fabrics and consider a hat for sun protection.";
  }
  
  return "Here are some outfit ideas based on today's weather. Browse below and find your perfect look!";
}

export default OliviaRecommendationBox;
