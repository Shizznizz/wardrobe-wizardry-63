
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload, Filter } from 'lucide-react';

interface WardrobeHeroSectionProps {
  onUploadClick: () => void;
  onToggleFilters: () => void;
  showAvatar?: boolean;
}

const WardrobeHeroSection = ({ onUploadClick, onToggleFilters, showAvatar = true }: WardrobeHeroSectionProps) => {
  return (
    <motion.div
      className="w-full rounded-2xl overflow-hidden relative mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-48 sm:h-56 bg-gradient-to-r from-slate-900 to-purple-900 overflow-hidden">
        {/* Background pattern/effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwdi0yaC05VjBoMnYzMmgxMHYyaC0zeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat opacity-40"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center"
          >
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 mb-2">
                Your Digital Wardrobe
              </h1>
              <p className="text-sm sm:text-base text-white/80 max-w-lg mb-4">
                View, organize and match your favorite looks. Olivia is here to help you dress better every day.
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={onUploadClick}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Upload className="mr-2 h-4 w-4" /> Add Item
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onToggleFilters}
                  className="border-white/20 bg-white/5 hover:bg-white/10"
                >
                  <Filter className="mr-2 h-4 w-4" /> Browse Options
                </Button>
              </div>
            </div>
            {showAvatar && (
              <motion.div 
                className="hidden sm:block mt-4 sm:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-400/30 shadow-lg shadow-purple-500/20">
                  <img 
                    src="/lovable-uploads/9d6d8627-f9d3-4af3-a5ec-7b2498799ab2.png" 
                    alt="Olivia avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WardrobeHeroSection;
