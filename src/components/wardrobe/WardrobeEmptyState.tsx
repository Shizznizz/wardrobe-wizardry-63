
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClothingItem } from '@/lib/types';
import UploadModal from '@/components/UploadModal';
import { motion } from 'framer-motion';

interface WardrobeEmptyStateProps {
  onUpload: (item: ClothingItem) => void;
  isAuthenticated: boolean;
  isLoadingItems: boolean;
  itemCount: number; // Added itemCount prop
}

const WardrobeEmptyState = ({ 
  onUpload,
  isAuthenticated, 
  isLoadingItems,
  itemCount // Use this to determine if we should show the empty state
}: WardrobeEmptyStateProps) => {
  // Only show the empty state if authenticated, not loading, and have zero items
  if (!isAuthenticated || isLoadingItems || itemCount > 0) {
    return null;
  }

  return (
    <motion.div 
      className="text-center p-10 border border-dashed border-white/20 rounded-xl bg-slate-900/30 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-purple-900/30 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300/70">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <h3 className="text-xl font-medium text-white mb-2">Your Wardrobe is Empty</h3>
      <p className="text-white/70 mb-6">Add your first clothing item to get started.</p>
      <UploadModal onUpload={onUpload} buttonText="Add Your First Item">
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Your First Item
        </Button>
      </UploadModal>
    </motion.div>
  );
};

export default WardrobeEmptyState;
