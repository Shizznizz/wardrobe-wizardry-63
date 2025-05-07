
import { WeatherInfo } from '@/lib/types';
import { toast } from 'sonner';

export const getIconName = (condition: string): string => {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return 'sun';
  if (lowerCondition.includes('cloud') && !lowerCondition.includes('rain')) return 'cloud';
  if (lowerCondition.includes('rain') || lowerCondition.includes('thunder')) return 'rain';
  if (lowerCondition.includes('snow')) return 'snow';
  if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return 'fog';
  
  return 'sun'; // Default
};

export const fetchWeatherData = async (city: string, country: string): Promise<WeatherInfo> => {
  if (!city || !country) {
    throw new Error('City and country are required');
  }

  console.log(`Fetching weather for ${city}, ${country}...`);
  
  // You would typically call a real weather API here
  // Since we don't have an API key in this demo, we'll generate realistic data
  return generateRandomWeather(city, country);
};

export const generateRandomWeather = (city?: string, country?: string): WeatherInfo => {
  const today = new Date();
  const month = today.getMonth();
  const isNorthernHemisphere = !['AU', 'NZ', 'AR', 'CL', 'ZA'].includes(country || '');
  
  // Default conditions
  let conditions = ['Clear sky', 'Partly cloudy', 'Cloudy'];
  let tempMin = 15;
  let tempMax = 25;
  
  if (isNorthernHemisphere) {
    // Northern hemisphere seasons
    if (month >= 2 && month <= 4) { // Spring
      tempMin = 10;
      tempMax = 20;
      conditions = ['Partly cloudy', 'Light rain', 'Clear sky', 'Cloudy'];
    } else if (month >= 5 && month <= 7) { // Summer
      tempMin = 20;
      tempMax = 30;
      conditions = ['Clear sky', 'Partly cloudy', 'Hot'];
    } else if (month >= 8 && month <= 10) { // Fall/Autumn
      tempMin = 10;
      tempMax = 20;
      conditions = ['Cloudy', 'Light rain', 'Partly cloudy', 'Windy'];
    } else { // Winter
      tempMin = 0;
      tempMax = 10;
      conditions = ['Cloudy', 'Light rain', 'Snow', 'Windy'];
    }
  } else {
    // Southern hemisphere (opposite seasons)
    if (month >= 2 && month <= 4) { // Fall/Autumn
      tempMin = 10; 
      tempMax = 20;
      conditions = ['Cloudy', 'Light rain', 'Partly cloudy'];
    } else if (month >= 5 && month <= 7) { // Winter
      tempMin = 5;
      tempMax = 15;
      conditions = ['Cloudy', 'Light rain', 'Partly cloudy'];
    } else if (month >= 8 && month <= 10) { // Spring
      tempMin = 15;
      tempMax = 25;
      conditions = ['Clear sky', 'Partly cloudy', 'Light rain'];
    } else { // Summer
      tempMin = 25;
      tempMax = 35;
      conditions = ['Clear sky', 'Hot', 'Partly cloudy'];
    }
  }
  
  // Adjust for specific countries/regions
  if (country === 'NL') { // Netherlands
    if (month >= 5 && month <= 7) { // Summer in Netherlands
      tempMin = 15;
      tempMax = 25; 
      conditions = ['Partly cloudy', 'Clear sky', 'Light rain'];
    } else if (month >= 11 || month <= 1) { // Winter in Netherlands
      tempMin = 0;
      tempMax = 8;
      conditions = ['Light rain', 'Cloudy', 'Partly cloudy'];
    }
  }
  
  // Generate random temperature and condition within the realistic ranges
  const randomTemp = Math.floor(Math.random() * (tempMax - tempMin + 1)) + tempMin;
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    temperature: randomTemp,
    condition: randomCondition,
    icon: getIconName(randomCondition),
    city: city || "Unknown",
    country: country || "Unknown",
    windSpeed: Math.floor(Math.random() * 10) + 1,
    humidity: Math.floor(Math.random() * 30) + 50, // More realistic humidity range
    feelsLike: randomTemp - Math.floor(Math.random() * 3)
  };
};
