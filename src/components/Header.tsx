
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, CloudSun, Cloud, CloudRain, Umbrella, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser, useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";

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
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  
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

  const navItems = [
    { name: 'Home', path: '/' },
    ...(isSignedIn ? [
      { name: 'Wardrobe', path: '/wardrobe' },
      { name: 'Outfits', path: '/outfits' },
      { name: 'Settings', path: '/settings' },
    ] : []),
  ];

  const getCurrentPageName = () => {
    if (location.pathname === '/') return 'Home';
    const currentNav = navItems.find(item => item.path === location.pathname);
    return currentNav ? currentNav.name : '';
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled ? "bg-white/80 backdrop-blur-lg border-b border-gray-100" : "bg-transparent"
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

        <div className="flex items-center space-x-2">
          {weather && (
            <div className="hidden md:flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 border border-gray-100 transition-all hover:bg-white">
              {getWeatherIcon()}
              <span className="text-sm font-medium">{weather.temperature}°</span>
            </div>
          )}

          {isSignedIn ? (
            <div className="flex items-center space-x-2">
              <UserButton afterSignOutUrl="/" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
                className="hidden md:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </div>
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
          <div className="fixed inset-0 bg-white z-50 animate-fade-in">
            <div className="container h-full flex flex-col p-4">
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
                        ? "text-accent"
                        : "text-muted-foreground hover:text-accent"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                {isSignedIn ? (
                  <Button 
                    variant="outline" 
                    onClick={() => signOut()}
                    className="mt-4"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <div className="flex flex-col items-center space-y-4 mt-4">
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="w-full">Sign In</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full">Sign Up</Button>
                    </SignUpButton>
                  </div>
                )}
              </nav>

              {weather && (
                <div className="flex items-center justify-center space-x-2 py-6 mt-auto">
                  {getWeatherIcon()}
                  <span className="text-sm font-medium">{weather.temperature}° {weather.condition}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
