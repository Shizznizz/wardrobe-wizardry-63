
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Calendar, 
  Shirt,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';

interface OliviaDailyDropProps {
  isPremiumUser: boolean;
  onSeeHowToWear: (itemId: string) => void;
}

const OliviaDailyDrop = ({
  isPremiumUser,
  onSeeHowToWear
}: OliviaDailyDropProps) => {
  // Today's featured items
  const dailyFeatures = [
    {
      id: 'daily-1',
      name: 'Satin Slip Dress',
      brand: 'ElegantEve',
      price: 79.99,
      imageUrl: '/lovable-uploads/34e8d801-61ee-4254-a7ce-39b52a3a7e65.png',
      description: 'This versatile satin slip dress transitions effortlessly from day to night with simple styling changes.',
      stylingTip: 'Layer with a fitted turtleneck for day, remove for evening elegance.',
      stylingImage: '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png'
    },
    {
      id: 'daily-2',
      name: 'Structured Crossbody Bag',
      brand: 'AccessoryLab',
      price: 49.95,
      imageUrl: '/lovable-uploads/5e9a3938-d858-47e4-942e-e6f047b9e309.png',
      description: 'The perfect everyday bag with enough room for essentials while maintaining a sleek silhouette.',
      stylingTip: 'This neutral shade works with virtually any outfit in your wardrobe.',
      stylingImage: '/lovable-uploads/7fc023d8-bd78-47c7-8725-d8cb48855e20.png'
    }
  ];
  
  // Format today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-purple-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center mb-4 bg-purple-900/30 px-4 py-1.5 rounded-full">
            <Calendar className="h-4 w-4 mr-2 text-pink-300" />
            <span className="text-sm font-medium text-white">{formattedDate}</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Olivia's Daily Drop</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Fresh picks every day, curated just for you by Olivia
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {dailyFeatures.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-gradient-to-br from-purple-900/30 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-square">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.name}</h3>
                      <p className="text-white/60 text-sm">{item.brand}</p>
                    </div>
                    <p className="text-xl font-bold text-white">${item.price}</p>
                  </div>
                  
                  <p className="text-white/80 text-sm mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-start mt-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mr-3 shrink-0">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white mb-1">Olivia's Styling Tip:</p>
                      <p className="text-sm text-white/70">{item.stylingTip}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="border-white/20 hover:bg-white/10 text-white"
                      onClick={() => onSeeHowToWear(item.id)}
                    >
                      <Shirt className="h-4 w-4 mr-1.5" />
                      How to Wear
                    </Button>
                    
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                      onClick={() => {
                        window.open('https://example.com/affiliate', '_blank');
                        toast.success('Opening shop page in new tab');
                      }}
                    >
                      <ShoppingBag className="h-4 w-4 mr-1.5" />
                      Shop
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default OliviaDailyDrop;
