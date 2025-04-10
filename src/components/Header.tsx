
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileMenu } from '@/components/header/MobileMenu';
import { DesktopNavigation } from '@/components/header/DesktopNavigation';
import { UserMenu } from '@/components/header/UserMenu';
import { WeatherDisplay } from '@/components/header/WeatherDisplay';

const Header = () => {
  const [showBackground, setShowBackground] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowBackground(true);
      } else {
        setShowBackground(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';
  const isOutfitsPage = location.pathname === '/outfits';
  const isWardrobePage = location.pathname === '/wardrobe';
  const isActiveLink = (path: string) => location.pathname === path;

  // Add new route for Shop & Try
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Outfits', path: '/outfits' },
    { name: 'Wardrobe', path: '/wardrobe' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Shop & Try', path: '/shop' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        (showBackground || isMenuOpen) ? 'bg-slate-900/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl text-white flex items-center">
            <img src="/favicon.ico" alt="Logo" className="w-8 h-8 mr-2" />
            <span className="hidden sm:inline">Olivia Bloom</span>
          </Link>
        </div>

        {!isMobile && <DesktopNavigation navItems={navLinks} currentPath={location.pathname} isScrolled={showBackground} />}

        <div className="flex items-center gap-2">
          {!isMobile && !isHomePage && <WeatherDisplay isScrolled={showBackground} />}
          <UserMenu isScrolled={showBackground} />
          
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col items-end">
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    isMenuOpen ? 'w-6 -rotate-45 translate-y-1' : 'w-6'
                  }`}
                ></span>
                <span
                  className={`block h-0.5 bg-white mt-1.5 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'w-4'
                  }`}
                ></span>
                <span
                  className={`block h-0.5 bg-white mt-1.5 transition-all duration-300 ${
                    isMenuOpen ? 'w-6 rotate-45 -translate-y-1' : 'w-5'
                  }`}
                ></span>
              </div>
            </Button>
          )}
        </div>
      </div>

      {isMobile && (
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          navItems={navLinks}
          currentPath={location.pathname}
          onSignOut={() => {
            // Handle sign out
            setIsMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
