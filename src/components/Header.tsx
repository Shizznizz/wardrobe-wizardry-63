
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { WeatherDisplay } from './header/WeatherDisplay';
import { UserMenu } from './header/UserMenu';
import { MobileMenu } from './header/MobileMenu';
import { DesktopNavigation } from './header/DesktopNavigation';

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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  // Navigation items
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
        isScrolled 
          ? "bg-purple-900/60 backdrop-blur-md shadow-md border-b border-white/10" 
          : "bg-transparent border-transparent text-white"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className={cn(
            "font-display font-bold text-lg sm:text-xl",
            isScrolled ? "text-white" : "text-white"
          )}>{getCurrentPageName()}</span>
        </Link>

        <DesktopNavigation 
          navItems={navItems} 
          currentPath={location.pathname} 
          isScrolled={isScrolled}
        />

        <div className="flex items-center">
          <WeatherDisplay weather={weather} isScrolled={isScrolled} />
          <UserMenu isScrolled={isScrolled} />

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden ml-2",
              isScrolled ? "text-white hover:text-white/80" : "text-white hover:bg-white/10"
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <MobileMenu 
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          navItems={navItems}
          currentPath={location.pathname}
          weather={weather}
          onSignOut={handleSignOut}
        />
      </div>
    </header>
  );
};

export default Header;
