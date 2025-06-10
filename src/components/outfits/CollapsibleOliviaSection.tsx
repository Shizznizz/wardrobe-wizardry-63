
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
          className="w-full justify-between p-3 h-auto hover:bg-slate-700/50 transition-colors group"
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
            className="group-hover:scale-110 transition-transform duration-200"
          >
            <ChevronDown className="h-4 w-4 text-purple-300" />
          </motion.div>
        </Button>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <CardContent className="pt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-slate-900/20 rounded-xl p-6 border border-purple-400/20 shadow-xl backdrop-blur-sm overflow-hidden"
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400/5 via-purple-400/5 to-transparent rounded-xl blur-xl"></div>
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-violet-400/10 rounded-full blur-3xl"></div>
                
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                  {/* Olivia's image */}
                  <div className="flex-shrink-0 order-1 md:order-1">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl blur-lg"></div>
                      <img
                        src="/lovable-uploads/56f273cb-8e41-41b5-a9b5-dc81972354c8.png"
                        alt="Olivia - Your AI Stylist"
                        className="relative w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl shadow-lg border border-purple-300/20"
                      />
                    </div>
                  </div>
                  
                  {/* Text content */}
                  <div className="flex-1 text-center md:text-left order-2 md:order-2">
                    <h4 className="text-xl md:text-2xl font-semibold text-purple-200 mb-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                      Meet Olivia, your personal AI Stylist
                    </h4>
                    <p className="text-purple-200/80 mb-6 leading-relaxed text-sm md:text-base">
                      Olivia helps you choose the perfect outfit for any day, based on your wardrobe, the weather, and your personal style.
                    </p>
                    <Button
                      onClick={onChatClick}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Chat with Olivia
                    </Button>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CollapsibleOliviaSection;
