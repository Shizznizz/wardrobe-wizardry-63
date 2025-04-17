
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Shirt } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface PltProduct {
  id: string;
  image: string;
  name: string;
  tags: string[];
  affiliateUrl: string;
  tryOnEnabled: boolean;
}

interface PrettyLittleThingPicksProps {
  isPremiumUser: boolean;
  onTryItem: (image: string) => void;
  onUpgradeToPremium: () => void;
}

const PrettyLittleThingPicks = ({ 
  isPremiumUser, 
  onTryItem, 
  onUpgradeToPremium 
}: PrettyLittleThingPicksProps) => {
  // Mock data for now - will be replaced with Supabase data later
  const pltProducts: PltProduct[] = [
    {
      id: 'plt-1',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=300&h=400',
      name: "Coming Soon...",
      tags: ['Y2K', 'Evening Look'],
      affiliateUrl: '#plt-affiliate-link',
      tryOnEnabled: true
    },
    {
      id: 'plt-2',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300&h=400',
      name: "Coming Soon...",
      tags: ['Minimal', 'Date Night'],
      affiliateUrl: '#plt-affiliate-link',
      tryOnEnabled: true
    },
    {
      id: 'plt-3',
      image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&q=80&w=300&h=400',
      name: "Coming Soon...",
      tags: ['Casual', 'Y2K'],
      affiliateUrl: '#plt-affiliate-link',
      tryOnEnabled: true
    }
  ];

  const handleTryOn = (product: PltProduct) => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    if (product.tryOnEnabled) {
      onTryItem(product.image);
      toast.success(`Preparing to try on ${product.name}...`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative mb-16"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          🛍️ Trending from PrettyLittleThing
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <p className="text-center text-white/70 text-sm mb-8">
        Outfits curated via PrettyLittleThing – more coming soon!
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-4">
        {pltProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden h-full">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                
                {!isPremiumUser && product.tryOnEnabled && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm"
                      onClick={() => onUpgradeToPremium()}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                    >
                      Unlock Try-On
                    </Button>
                  </div>
                )}
                
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                  PrettyLittleThing
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium text-white truncate">{product.name}</h3>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  {product.tryOnEnabled && (
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 flex-1"
                      onClick={() => handleTryOn(product)}
                    >
                      <Shirt className="h-3.5 w-3.5 mr-1.5" />
                      Try on Olivia
                    </Button>
                  )}
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-white/20 hover:bg-white/10"
                          onClick={() => window.open(product.affiliateUrl, '_blank')}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          Shop at PLT
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="text-xs">Opens in a new tab</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="text-xs text-slate-400 text-center mt-4">
        <p>Affiliate Disclosure: We may earn a commission for purchases made through these links.</p>
      </div>
    </motion.div>
  );
};

export default PrettyLittleThingPicks;
