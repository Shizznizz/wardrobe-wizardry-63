
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
  
  const apiKey = '72b9c69df76684e113804b44895d2599';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;
  
  console.log("Fetching weather data from:", url);
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("API Response status:", response.status);
    console.log("API Response data:", data);
    
    if (response.status === 401) {
      throw new Error('Invalid API key. Please update the API key and try again.');
    }
    
    if (!response.ok) {
      const errorMsg = data.message || `Weather data not available for ${city}, ${country}`;
      console.error("Weather API error:", errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log("Weather data received:", data);
    
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      icon: getIconName(data.weather[0].main),
      city: data.name,
      country: data.sys.country,
      windSpeed: data.wind.speed,
      humidity: data.main.humidity,
      feelsLike: Math.round(data.main.feels_like)
    };
  } catch (error) {
    console.error("Error in fetchWeatherData:", error);
    throw error;
  }
};

export const generateRandomWeather = (city?: string, country?: string): WeatherInfo => {
  const conditions = [
    'Clear sky', 'Partly cloudy', 'Cloudy', 'Light rain', 
    'Moderate rain', 'Heavy rain', 'Thunderstorm', 'Snow', 'Fog'
  ];
  
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const randomTemp = Math.floor(Math.random() * 25) + 5; // Random temp between 5-30°C
  
  return {
    temperature: randomTemp,
    condition: randomCondition,
    icon: getIconName(randomCondition),
    city: city || "Unknown",
    country: country || "Unknown",
    windSpeed: Math.floor(Math.random() * 10) + 1,
    humidity: Math.floor(Math.random() * 60) + 30,
    feelsLike: randomTemp - Math.floor(Math.random() * 3)
  };
};
