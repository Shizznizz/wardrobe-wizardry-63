
import { Link } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { WeatherDisplay } from './WeatherDisplay';
import { Sun, CloudSun, Cloud, CloudRain, Umbrella } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ name: string; path: string }>;
  currentPath: string;
  weather?: {
    temperature: number;
    condition: string;
  };
  onSignOut: () => void;
}

export const MobileMenu = ({ 
  isOpen, 
  onClose, 
  navItems, 
  currentPath, 
  weather,
  onSignOut
}: MobileMenuProps) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md mobile-menu-overlay"
    >
      <div className="h-full flex flex-col p-4">
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex flex-col items-center mt-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-xl font-medium transition-all duration-300 px-6 py-3 rounded-full w-full text-center",
                currentPath === item.path
                  ? "text-accent bg-accent/10 shadow-sm shadow-accent/20"
                  : "text-muted-foreground hover:text-accent hover:bg-accent/5"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {!user && (
            <Link
              to="/auth"
              className="text-xl font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 px-6 py-3 rounded-full w-full text-center"
            >
              Sign In
            </Link>
          )}
        </nav>

        <div className="flex-grow"></div>

        {weather && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <WeatherMobileDisplay weather={weather} />
          </div>
        )}
        
        {user && (
          <button
            onClick={onSignOut}
            className="text-xl font-medium text-red-500 hover:text-red-600 flex items-center justify-center gap-2 mb-8 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-6 py-3 rounded-full transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        )}
      </div>
    </div>
  );
};

// Helper component for mobile weather display
const WeatherMobileDisplay = ({ weather }: { weather: { temperature: number; condition: string; } }) => {
  const getWeatherIcon = () => {
    const condition = weather.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) return <Sun className="w-5 h-5 text-yellow-400" />;
    if (condition.includes('cloud') && condition.includes('sun')) return <CloudSun className="w-5 h-5 text-blue-300" />;
    if (condition.includes('cloud')) return <Cloud className="w-5 h-5 text-blue-200" />;
    if (condition.includes('rain')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (condition.includes('thunder')) return <Umbrella className="w-5 h-5 text-purple-400" />;
    
    return <Sun className="w-5 h-5 text-yellow-400" />;
  };

  return (
    <div className="glass dark:glass-dark px-5 py-2 rounded-full flex items-center space-x-2">
      {getWeatherIcon()}
      <span className="text-sm font-medium text-foreground">{weather.temperature}° {weather.condition}</span>
    </div>
  );
};
