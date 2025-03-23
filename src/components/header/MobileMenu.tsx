
import { Link } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { WeatherDisplay } from './WeatherDisplay';

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
      className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 mobile-menu-overlay" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        bottom: 0, 
        left: 0, 
        right: 0, 
        width: '100%', 
        height: '100%' 
      }}
    >
      <div className="h-full flex flex-col p-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-xl">{getCurrentPageName(navItems, currentPath, user)}</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-accent hover:bg-accent/10 hover:text-accent-foreground"
          >
            <X className="h-6 w-6 text-red-500" />
          </Button>
        </div>

        <nav className="flex flex-col items-center mt-4 pt-2 space-y-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-xl font-medium transition-colors",
                currentPath === item.path
                  ? "text-accent bg-accent/10"
                  : "text-muted-foreground hover:text-accent hover:bg-accent/10"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {!user && (
            <Link
              to="/auth"
              className="text-xl font-medium text-primary hover:text-primary/80"
            >
              Sign In
            </Link>
          )}
        </nav>

        {weather && (
          <div className="flex items-center justify-center space-x-2 py-6 mt-auto mb-6">
            <WeatherMobileDisplay weather={weather} />
          </div>
        )}
        
        {user && (
          <button
            onClick={onSignOut}
            className="text-xl font-medium text-red-500 hover:text-red-600 flex items-center justify-center gap-2 mt-auto mb-8"
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
    if (condition.includes('sun') || condition.includes('clear')) return <Sun className="w-5 h-5" />;
    if (condition.includes('cloud') && condition.includes('sun')) return <CloudSun className="w-5 h-5" />;
    if (condition.includes('cloud')) return <Cloud className="w-5 h-5" />;
    if (condition.includes('rain')) return <CloudRain className="w-5 h-5" />;
    if (condition.includes('thunder')) return <Umbrella className="w-5 h-5" />;
    
    return <Sun className="w-5 h-5" />;
  };

  return (
    <>
      {getWeatherIcon()}
      <span className="text-sm font-medium">{weather.temperature}° {weather.condition}</span>
    </>
  );
};

// Missing import for Sun component
import { Sun, CloudSun, Cloud, CloudRain, Umbrella } from 'lucide-react';

// Helper function to get current page name
const getCurrentPageName = (
  navItems: Array<{ name: string; path: string }>,
  currentPath: string,
  user: any
) => {
  if (currentPath === '/') return 'Home';
  if (currentPath === '/auth') return user ? 'Profile' : 'Sign In';
  const currentNav = navItems.find(item => item.path === currentPath);
  return currentNav ? currentNav.name : '';
};
