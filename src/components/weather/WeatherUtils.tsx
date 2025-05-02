
import { WeatherInfo } from "@/lib/types";

// Get appropriate gradient based on weather condition and temperature
export const getWeatherGradient = (weather: WeatherInfo): string => {
  const condition = weather.condition?.toLowerCase() || '';
  const temperature = weather.temperature || 20;
  
  if (condition.includes('clear') || condition.includes('sun')) {
    if (temperature > 25) {
      return 'bg-gradient-to-br from-orange-400 to-amber-500'; // Hot sunny day
    } else {
      return 'bg-gradient-to-br from-blue-400 to-cyan-300'; // Pleasant sunny day
    }
  }
  
  if (condition.includes('cloud') && !condition.includes('rain')) {
    return 'bg-gradient-to-br from-slate-500 to-slate-600'; // Cloudy
  }
  
  if (condition.includes('rain')) {
    return 'bg-gradient-to-br from-blue-600 to-slate-700'; // Rainy
  }
  
  if (condition.includes('snow')) {
    return 'bg-gradient-to-br from-slate-200 to-blue-300'; // Snowy
  }
  
  if (condition.includes('mist') || condition.includes('fog')) {
    return 'bg-gradient-to-br from-gray-400 to-gray-600'; // Misty/Foggy
  }
  
  if (temperature > 30) {
    return 'bg-gradient-to-br from-red-500 to-orange-500'; // Very hot
  }
  
  if (temperature < 0) {
    return 'bg-gradient-to-br from-blue-700 to-indigo-600'; // Very cold
  }
  
  // Default gradient
  return 'bg-gradient-to-br from-purple-600 to-indigo-700';
};

// Get weather mood based on condition and temperature
export const getWeatherMood = (weather: WeatherInfo): string => {
  const condition = weather.condition?.toLowerCase() || '';
  const temperature = weather.temperature || 20;
  
  if (condition.includes('clear') || condition.includes('sun')) {
    if (temperature > 25) {
      return 'Warm & Sunny';
    } else {
      return 'Fresh & Bright';
    }
  }
  
  if (condition.includes('cloud') && !condition.includes('rain')) {
    return 'Cool & Overcast';
  }
  
  if (condition.includes('rain')) {
    return 'Wet & Rainy';
  }
  
  if (condition.includes('snow')) {
    return 'Cold & Snowy';
  }
  
  if (condition.includes('mist') || condition.includes('fog')) {
    return 'Misty & Mysterious';
  }
  
  if (temperature > 30) {
    return 'Hot & Summery';
  }
  
  if (temperature < 0) {
    return 'Freezing Cold';
  }
  
  // Default mood
  return 'Pleasant';
};

// Get day of week
export const getDayOfWeek = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};
