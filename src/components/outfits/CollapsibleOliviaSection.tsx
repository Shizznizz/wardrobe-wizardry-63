
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
              <div className="relative bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-lg p-6 border border-purple-400/20 shadow-lg backdrop-blur-sm">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-lg blur-xl"></div>
                
                <div className="relative flex items-center gap-6">
                  {/* Text content */}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-purple-200 mb-3">Meet Olivia, Your AI Style Assistant</h4>
                    <p className="text-purple-200/80 mb-4 leading-relaxed">
                      Olivia can suggest outfits based on your plans, weather and personal style. She learns from your preferences to create perfect combinations you'll love.
                    </p>
                    <Button
                      onClick={onChatClick}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Chat with Olivia
                    </Button>
                  </div>
                  
                  {/* Olivia's image */}
                  <div className="hidden md:block flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                      <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-purple-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CollapsibleOliviaSection;
