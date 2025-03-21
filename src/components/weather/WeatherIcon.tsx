
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudFog, AlertTriangle } from 'lucide-react';

interface WeatherIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

const WeatherIcon = ({ iconName, size = 12, className = "" }: WeatherIconProps) => {
  switch (iconName) {
    case 'sun':
      return <Sun className={`h-${size} w-${size} ${className}`} />;
    case 'cloud':
      return <Cloud className={`h-${size} w-${size} ${className}`} />;
    case 'rain':
      return <CloudRain className={`h-${size} w-${size} ${className}`} />;
    case 'snow':
      return <CloudSnow className={`h-${size} w-${size} ${className}`} />;
    case 'fog':
      return <CloudFog className={`h-${size} w-${size} ${className}`} />;
    case 'error':
      return <AlertTriangle className={`h-${size} w-${size} ${className}`} />;
    default:
      return <Sun className={`h-${size} w-${size} ${className}`} />;
  }
};

export default WeatherIcon;
