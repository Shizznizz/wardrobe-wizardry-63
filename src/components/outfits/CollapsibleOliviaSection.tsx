
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import OliviaAssistantSection from './OliviaAssistantSection';

interface CollapsibleOliviaSectionProps {
  onChatClick: () => void;
}

const CollapsibleOliviaSection = ({ onChatClick }: CollapsibleOliviaSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between p-3 h-auto hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-purple-200">Need styling help?</h3>
              <p className="text-sm text-purple-300/70">Get personalized outfit suggestions from Olivia</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-purple-300" />
          </motion.div>
        </Button>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <CardContent className="pt-0">
              <OliviaAssistantSection onChatClick={onChatClick} />
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CollapsibleOliviaSection;
