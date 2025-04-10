
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shirt, Sparkles, LockKeyhole, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TrendingNowSectionProps {
  effectivePremiumUser: boolean;
  onShowPremiumPopup: () => void;
}

const TrendingNowSection = ({ 
  effectivePremiumUser, 
  onShowPremiumPopup 
}: TrendingNowSectionProps) => {
  const navigate = useNavigate();
  
  // Sample trending items
  const trendingItems = [
    {
      id: 1,
      name: "Zara Mesh Corset Top",
      image: "/lovable-uploads/510dbdf2-837f-4649-8da3-bd06977fa677.png",
      brand: "Zara",
      source: "Paris Fashion Week"
    },
    {
      id: 2,
      name: "TikTok Wide-Leg Jeans",
      image: "/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png",
      brand: "Levi's",
      source: "TikTok Trend"
    },
    {
      id: 3,
      name: "Revolve Party Bag",
      image: "/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png",
      brand: "Revolve",
      source: "Milan Fashion Week"
    },
    {
      id: 4,
      name: "Urban Outfitters Hoodie",
      image: "/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png",
      brand: "Urban Outfitters",
      source: "Street Style"
    },
    {
      id: 5,
      name: "Shein Sparkle Crop Top",
      image: "/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png",
      brand: "Shein",
      source: "Social Media"
    }
  ];

  const handleTryOn = (item: any) => {
    if (!effectivePremiumUser) {
      onShowPremiumPopup();
      return;
    }
    
    // Navigate to try-on page with item
    navigate('/shop');
  };

  const handleStyleTips = (item: any) => {
    if (!effectivePremiumUser) {
      onShowPremiumPopup();
      return;
    }
    
    // Show style tips
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            Trending Now in Paris, Milan & TikTok
          </h2>
          <p className="text-white/70 mt-1">
            The hottest styles from around the world, ready for you to try on
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex space-x-4 min-w-max">
          {trendingItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="w-64 flex-shrink-0"
            >
              <Card className="bg-slate-900/40 border border-white/10 overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-slate-800">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  {!effectivePremiumUser && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
                      <LockKeyhole className="h-8 w-8 text-white mb-2" />
                      <p className="text-white font-medium">Premium Feature</p>
                      <Button 
                        size="sm"
                        onClick={onShowPremiumPopup}
                        className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        Unlock
                      </Button>
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2 bg-black/60 rounded-full py-0.5 px-2 text-xs text-white">
                    {item.brand}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                    <h3 className="text-white font-medium text-sm">{item.name}</h3>
                    <p className="text-white/70 text-xs">{item.source}</p>
                  </div>
                </div>
                
                <CardContent className="p-3">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleTryOn(item)}
                    >
                      <Shirt className="h-4 w-4 mr-1" />
                      Try On
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                      onClick={() => handleStyleTips(item)}
                    >
                      <Info className="h-4 w-4 mr-1" />
                      Style Tips
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TrendingNowSection;
