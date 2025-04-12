
import { FC } from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, SunDim } from 'lucide-react';

type WeatherCondition = 'clear' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'drizzle' | 'snowy' | 'foggy' | 'thunderstorm';

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
}

export const WeatherIcon: FC<WeatherIconProps> = ({ condition, className = 'h-5 w-5' }) => {
  switch (condition) {
    case 'clear':
      return <Sun className={className} />;
    case 'partly-cloudy':
      return <SunDim className={className} />;
    case 'cloudy':
      return <Cloud className={className} />;
    case 'rainy':
      return <CloudRain className={className} />;
    case 'drizzle':
      return <CloudDrizzle className={className} />;
    case 'snowy':
      return <CloudSnow className={className} />;
    case 'foggy':
      return <CloudFog className={className} />;
    case 'thunderstorm':
      return <CloudLightning className={className} />;
    default:
      return <Sun className={className} />;
  }
};
