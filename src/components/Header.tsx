
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

  // Enhanced scroll detection with throttling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Initial check
    handleScroll();

    // Add throttling to improve performance
    let timeout: ReturnType<typeof setTimeout>;
    const throttledScroll = () => {
      if (!timeout) {
        timeout = setTimeout(() => {
          handleScroll();
          timeout = undefined as unknown as ReturnType<typeof setTimeout>;
        }, 100);
      }
    };

    window.addEventListener('scroll', throttledScroll);
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(timeout);
    };
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
    setIsMenuOpen(prevState => !prevState);
    console.log("Toggle menu clicked. New state:", !isMenuOpen);
  };

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Define navigation items
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
      { name: 'Quizzes', path: '/quizzes' },
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
        "fixed top-0 left-0 right-0 transition-all duration-500 py-2 sm:py-4 z-50",
        isScrolled 
          ? "bg-purple-900/95 shadow-lg border-b border-white/10" 
          : "bg-[rgba(50,0,80,0.5)] backdrop-blur-md border-transparent text-white"
      )}
      style={{
        WebkitBackdropFilter: 'blur(10px)',
        backfaceVisibility: 'hidden'
      }}
    >
      <div className="container mx-auto px-3 md:px-6 flex items-center justify-between relative">
        {isMobile && (
          <div className="text-white font-medium tracking-wide pointer-events-auto">{getCurrentPageName()}</div>
        )}

        {!isMobile && (
          <DesktopNavigation 
            navItems={navItems} 
            currentPath={location.pathname} 
            isScrolled={isScrolled}
          />
        )}

        <div className="flex items-center pointer-events-auto">
          <UserMenu isScrolled={isScrolled} />

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "ml-2 transition-colors relative z-50 pointer-events-auto",
                isScrolled ? "text-white hover:text-white/80" : "text-white hover:bg-white/10"
              )}
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" />
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
