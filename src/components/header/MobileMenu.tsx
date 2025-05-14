
import { X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { name: string; path: string }[];
  currentPath: string;
  onSignOut: () => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  currentPath,
  onSignOut
}: MobileMenuProps) => {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('overflow-hidden-strict');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('overflow-hidden-strict');
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('overflow-hidden-strict');
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu panel */}
      <div 
        className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-gradient-to-b from-purple-950 to-slate-950 border-l border-white/10 flex flex-col shadow-lg z-[10000] h-full"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{ height: '100%', maxHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="sticky top-0 px-4 py-4 bg-gradient-to-b from-purple-950 to-purple-950/95 border-b border-white/10 flex justify-end z-10">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden h-full">
          <ScrollArea className="h-full px-4 py-4">
            <nav className="space-y-1 md:space-y-2 mb-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "block py-3 md:py-4 px-4 md:px-5 rounded-lg text-base md:text-lg font-medium transition-colors",
                    currentPath === item.path
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Only show sign out if user is authenticated */}
            {navItems.some(item => item.name !== 'Login') && (
              <div className="pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 py-3 px-5 text-base"
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                >
                  <LogOut className="mr-3 h-4 w-4 md:h-5 md:w-5" />
                  Sign Out
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
