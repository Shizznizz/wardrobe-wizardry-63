
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogOut, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

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

export const MobileMenu = ({ isOpen, onClose, navItems, currentPath, weather, onSignOut }: MobileMenuProps) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]" // Higher z-index and better overlay
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[75vw] max-w-[320px] bg-gradient-to-b from-purple-900 to-slate-900 border-l border-purple-800/30 shadow-xl overflow-y-auto z-[1000] pt-20"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '100vh' }}
          >
            <div className="flex flex-col justify-between h-full pb-8">
              <motion.div 
                className="px-4 space-y-1"
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                  },
                  closed: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 }
                  }
                }}
              >
                {navItems.map((item) => (
                  <motion.div 
                    key={item.path}
                    variants={{
                      open: {
                        y: 0,
                        opacity: 1,
                        transition: { type: 'spring', stiffness: 300, damping: 24 }
                      },
                      closed: {
                        y: 20,
                        opacity: 0,
                        transition: { duration: 0.2 }
                      }
                    }}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        "block py-3 px-4 text-lg font-medium rounded-lg transition-colors",
                        currentPath === item.path
                          ? "bg-purple-800/40 text-white"
                          : "text-purple-100/80 hover:bg-purple-800/20 hover:text-white"
                      )}
                      onClick={onClose}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="px-4 mt-auto">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-white/10 text-white/80"
                  onClick={onSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
