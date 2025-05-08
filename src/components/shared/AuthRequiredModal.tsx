
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, User } from 'lucide-react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  redirectPath?: string;
}

const AuthRequiredModal = ({
  isOpen,
  onClose,
  title = "Login Required",
  description = "Please log in or create an account to access this feature.",
  redirectPath = "/auth"
}: AuthRequiredModalProps) => {
  const navigate = useNavigate();
  
  const handleSignIn = () => {
    onClose();
    // Use replace to avoid creating entry in history
    navigate(redirectPath, { 
      state: { 
        from: window.location.pathname,
        authRequired: true
      } 
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-slate-900 to-purple-950/80 text-white border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center p-4"
        >
          <div className="h-16 w-16 rounded-full flex items-center justify-center bg-purple-500/20 mb-4">
            <Lock className="h-8 w-8 text-purple-300" />
          </div>
          
          <DialogTitle className="text-xl font-semibold mb-2 text-white">
            {title}
          </DialogTitle>
          
          <DialogDescription className="text-white/80 mb-6">
            {description}
          </DialogDescription>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSignIn}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 w-full sm:w-auto"
            >
              <User className="mr-2 h-4 w-4" />
              Sign In / Register
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthRequiredModal;
