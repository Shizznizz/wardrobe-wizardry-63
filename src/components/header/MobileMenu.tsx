
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const [animationComplete, setAnimationComplete] = useState(false);
  const location = useLocation();

  // Close menu when location changes
  useEffect(() => {
    onClose();
  }, [location, onClose]);

  // Handle animation completion
  const handleAnimationComplete = () => {
    if (!isOpen) {
      setAnimationComplete(true);
    } else {
      setAnimationComplete(false);
    }
  };

  // Variants for menu animation
  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: '0%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };

  // Variants for menu items animation
  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <AnimatePresence>
      {(isOpen || !animationComplete) && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[300px] bg-gradient-to-b from-purple-900 to-slate-900 z-[60] flex flex-col shadow-xl pointer-events-auto"
            variants={menuVariants}
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
            exit="closed"
            onAnimationComplete={handleAnimationComplete}
          >
            {/* Close button */}
            <div className="flex justify-end p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10 pointer-events-auto"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* User info if logged in */}
            {user && (
              <motion.div
                variants={itemVariants}
                className="px-6 py-4 border-b border-white/10 mb-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-purple-500/30">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-tr from-purple-500 to-pink-500">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-white/60">{user.email}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation items */}
            <nav className="flex-1 overflow-y-auto">
              <ul className="px-2 py-2 space-y-1">
                {navItems.map((item) => (
                  <motion.li key={item.path} variants={itemVariants}>
                    <Link
                      to={item.path}
                      className={`block px-4 py-2 rounded-md text-white ${
                        currentPath === item.path
                          ? 'bg-white/20 font-medium'
                          : 'hover:bg-white/10'
                      } pointer-events-auto`}
                      onClick={onClose}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
                
                {/* For mobile, we'll place the Profile link here */}
                {user && (
                  <motion.li variants={itemVariants}>
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 rounded-md text-white ${
                        currentPath === '/profile'
                          ? 'bg-white/20 font-medium'
                          : 'hover:bg-white/10'
                      } pointer-events-auto`}
                      onClick={onClose}
                    >
                      My Profile
                    </Link>
                  </motion.li>
                )}
              </ul>
            </nav>

            {/* Sign out button if logged in */}
            {user && (
              <motion.div
                variants={itemVariants}
                className="p-4 border-t border-white/10 mt-auto"
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 pointer-events-auto"
                  onClick={onSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
