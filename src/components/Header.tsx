
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
      { name: 'Calendar', path: '/calendar' },
      { name: 'Showroom', path: '/showroom' },
      { name: 'New Clothes', path: '/new-clothes' },
      { name: 'Settings', path: '/settings' },
    ];
  }

  // Get current page name for mobile display
  const getCurrentPageName = () => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.name : '';
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 transition-all duration-500 py-2 sm:py-4",
        isScrolled 
          ? "bg-purple-900/95 shadow-lg border-b border-white/10" 
          : "bg-[rgba(50,0,80,0.5)] backdrop-blur-md border-transparent text-white",
        "z-[100]"
      )}
    >
      <div className="container mx-auto px-3 md:px-6 flex items-center justify-between">
        {/* Mobile: Current page name */}
        {isMobile && (
          <div className="text-white font-medium tracking-wide">{getCurrentPageName()}</div>
        )}

        {/* Desktop Navigation */}
        {!isMobile && (
          <DesktopNavigation 
            navItems={navItems} 
            currentPath={location.pathname} 
            isScrolled={isScrolled}
          />
        )}

        <div className="flex items-center">
          {!isMobile && <WeatherDisplay weather={weather} isScrolled={isScrolled} />}
          
          <UserMenu isScrolled={isScrolled} />

          {/* Mobile: Menu button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "ml-2 transition-all duration-300",
                isScrolled ? "text-white hover:text-white/80" : "text-white hover:bg-white/10"
              )}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
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
