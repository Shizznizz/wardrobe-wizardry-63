
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from './header/UserMenu';
import { MobileMenu } from './header/MobileMenu';
import { DesktopNavigation } from './header/DesktopNavigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', isMenuOpen);
    setIsMenuOpen(prevState => !prevState);
  };

  let navItems = [
    { name: 'Home', path: '/' },
  ];
  
  if (isAuthenticated) {
    navItems = [
      ...navItems,
      { name: 'My Wardrobe', path: '/my-wardrobe' },
      { name: 'Mix & Match', path: '/mix-and-match' },
      { name: 'Style Planner', path: '/style-planner' },
      { name: 'Fitting Room', path: '/fitting-room' },
      { name: 'Shop & Try', path: '/shop-and-try' },
      { name: 'Settings', path: '/settings' },
    ];
  } else {
    navItems = [
      ...navItems,
      { name: 'Login', path: '/auth' }
    ];
  }

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
      style={{
        WebkitBackdropFilter: 'blur(10px)',
        backfaceVisibility: 'hidden'
      }}
    >
      <div className="container mx-auto px-3 md:px-6 flex items-center justify-between">
        {isMobile && (
          <div className="text-white font-medium tracking-wide">{getCurrentPageName()}</div>
        )}

        {!isMobile && (
          <DesktopNavigation 
            navItems={navItems} 
            currentPath={location.pathname} 
            isScrolled={isScrolled}
          />
        )}

        <div className="flex items-center">
          <UserMenu isScrolled={isScrolled} />

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "ml-2 transition-all duration-300",
                isScrolled ? "text-white hover:text-white/80" : "text-white hover:bg-white/10"
              )}
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
              style={{
                minHeight: "44px",
                minWidth: "44px",
                touchAction: "manipulation"
              }}
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
          onSignOut={handleSignOut}
        />
      </div>
    </header>
  );
};

export default Header;
