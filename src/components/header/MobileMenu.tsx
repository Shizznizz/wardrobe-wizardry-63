
import { Link } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
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
      className="fixed inset-0 z-[9999] bg-purple-900/90 backdrop-blur-md mobile-menu-overlay"
    >
      <div className="h-full flex flex-col p-4">
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="bg-white/10 text-white hover:bg-white/20 rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex flex-col items-center mt-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "text-xl font-medium transition-all duration-300 px-6 py-3 rounded-full w-full text-center",
                currentPath === item.path
                  ? "text-white bg-white/20 shadow-sm"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {!user && (
            <Link
              to="/auth"
              onClick={onClose}
              className="text-xl font-medium text-white hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full w-full text-center"
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
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="text-xl font-medium text-white hover:text-white/80 flex items-center justify-center gap-2 mb-8 bg-red-500/20 hover:bg-red-500/30 px-6 py-3 rounded-full transition-colors w-full"
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
