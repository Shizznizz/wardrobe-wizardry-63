
import { Link } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Sun, CloudSun, Cloud, CloudRain, Umbrella } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const menuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      x: '100%',
      transition: { 
        ease: 'easeInOut',
        duration: 0.2
      }  
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.2
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-purple-900/90 backdrop-blur-md mobile-menu-overlay"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999 // Increased z-index to ensure it's above everything
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="h-full flex flex-col p-4"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
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

            {/* Navigation items - moved higher up in the layout */}
            <nav className="flex flex-col items-center mt-2 space-y-3">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full"
                >
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "text-lg font-medium transition-all duration-300 px-6 py-3 rounded-full w-full flex justify-center items-center",
                      currentPath === item.path
                        ? "text-white bg-white/20 shadow-sm"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              {!user && (
                <motion.div 
                  custom={navItems.length}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full"
                >
                  <Link
                    to="/auth"
                    onClick={onClose}
                    className="text-lg font-medium text-white hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full w-full flex justify-center items-center"
                  >
                    Sign In
                  </Link>
                </motion.div>
              )}
            </nav>

            {/* Spacer to push content to bottom */}
            <div className="flex-grow"></div>

            {weather && (
              <motion.div 
                variants={itemVariants}
                custom={navItems.length + 1}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-center space-x-2 py-4"
              >
                <WeatherMobileDisplay weather={weather} />
              </motion.div>
            )}
            
            {/* Sign out button - stays at the bottom */}
            {user && (
              <motion.button
                variants={itemVariants}
                custom={navItems.length + 2}
                initial="hidden"
                animate="visible"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="text-lg font-medium text-white hover:text-white/80 flex items-center justify-center gap-2 mb-8 bg-red-500/20 hover:bg-red-500/30 px-6 py-3 rounded-full transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
