
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, CloudSun, Cloud, CloudRain, Umbrella, LogOut, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'sonner';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  weather?: {
    temperature: number;
    condition: string;
  };
}

const Header = ({ weather }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const getWeatherIcon = () => {
    if (!weather) return <Sun className="w-5 h-5" />;
    
    const condition = weather.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) return <Sun className="w-5 h-5" />;
    if (condition.includes('cloud') && condition.includes('sun')) return <CloudSun className="w-5 h-5" />;
    if (condition.includes('cloud')) return <Cloud className="w-5 h-5" />;
    if (condition.includes('rain')) return <CloudRain className="w-5 h-5" />;
    if (condition.includes('thunder')) return <Umbrella className="w-5 h-5" />;
    
    return <Sun className="w-5 h-5" />;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  let navItems = [
    { name: 'Home', path: '/' },
  ];
  
  if (user) {
    navItems = [
      ...navItems,
      { name: 'Wardrobe', path: '/wardrobe' },
      { name: 'Outfits', path: '/outfits' },
      { name: 'Showcase', path: '/try-on' },
      { name: 'New Clothes', path: '/new-clothes' },
      { name: 'Settings', path: '/settings' },
    ];
  }

  const getCurrentPageName = () => {
    if (location.pathname === '/') return 'Home';
    if (location.pathname === '/auth') return user ? 'Profile' : 'Sign In';
    const currentNav = navItems.find(item => item.path === location.pathname);
    return currentNav ? currentNav.name : '';
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-display font-bold text-lg sm:text-xl">{getCurrentPageName()}</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-2">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground hover:text-accent hover:bg-accent/10"
                  )}
                >
                  <Link to={item.path}>{item.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center">
          {weather && (
            <div className="hidden md:flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-1.5 border border-gray-100 dark:border-gray-700 transition-all hover:bg-white dark:hover:bg-gray-700">
              {getWeatherIcon()}
              <span className="text-sm font-medium">{weather.temperature}°</span>
            </div>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild className="ml-2">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 z-highest mobile-menu-overlay">
            <div className="fixed inset-0 bg-white dark:bg-gray-900 mobile-menu">
              <div className="h-full flex flex-col p-4">
                <div className="flex justify-between items-center py-4">
                  <Link to="/" className="flex items-center space-x-2">
                    <span className="font-display font-bold text-xl">{getCurrentPageName()}</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="flex flex-col items-center mt-4 pt-2 space-y-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "text-xl font-medium transition-colors",
                        location.pathname === item.path
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
                    {getWeatherIcon()}
                    <span className="text-sm font-medium">{weather.temperature}° {weather.condition}</span>
                  </div>
                )}
                
                {user && (
                  <button
                    onClick={handleSignOut}
                    className="text-xl font-medium text-red-500 hover:text-red-600 flex items-center justify-center gap-2 mt-auto mb-8"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
