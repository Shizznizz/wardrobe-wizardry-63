
import { WeatherInfo } from '@/lib/types';

export const getWeatherMood = (weather: WeatherInfo): string => {
  const { temperature, condition } = weather;
  const conditionLower = condition.toLowerCase();
  
  // Temperature based descriptions
  if (temperature < 0) return "Freezing";
  if (temperature < 10) return "Chilly";
  if (temperature < 18) return "Cool";
  if (temperature < 25) return "Pleasant";
  if (temperature < 30) return "Warm";
  if (temperature >= 30) return "Hot";
  
  // Fallback to condition based description
  if (conditionLower.includes('rain')) return "Rainy";
  if (conditionLower.includes('cloud')) return "Cloudy";
  if (conditionLower.includes('snow')) return "Snowy";
  if (conditionLower.includes('fog')) return "Foggy";
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) return "Sunny";
  
  return "Interesting";
};

export const getWeatherGradient = (weather: WeatherInfo): string => {
  const { temperature, condition } = weather;
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain')) {
    return "bg-gradient-to-br from-blue-500/60 to-slate-700/60";
  }
  
  if (conditionLower.includes('snow')) {
    return "bg-gradient-to-br from-blue-100/60 to-blue-300/60";
  }
  
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return "bg-gradient-to-br from-gray-300/60 to-gray-500/60";
  }
  
  if (conditionLower.includes('cloud')) {
    return "bg-gradient-to-br from-slate-400/60 to-slate-600/60";
  }
  
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
    if (temperature < 15) {
      return "bg-gradient-to-br from-blue-400/60 to-sky-600/60"; // Cold sunny
    } else {
      return "bg-gradient-to-br from-amber-400/60 to-orange-500/60"; // Warm sunny
    }
  }
  
  return "bg-gradient-to-br from-purple-500/60 to-indigo-700/60"; // Default
};
