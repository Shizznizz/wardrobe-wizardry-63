
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
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[1000] flex">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu panel */}
      <div 
        className="fixed inset-y-0 right-0 w-[75%] max-w-sm bg-gradient-to-b from-purple-950 to-slate-950 border-l border-white/10 flex flex-col shadow-lg z-[1001]"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="sticky top-0 px-4 py-3 bg-gradient-to-b from-purple-950 to-purple-950/95 border-b border-white/10">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 ml-auto block"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-4 py-2">
          <nav className="space-y-1 mb-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "block py-3.5 px-4 rounded-lg text-lg transition-colors",
                  currentPath === item.path
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
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
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 py-3"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
