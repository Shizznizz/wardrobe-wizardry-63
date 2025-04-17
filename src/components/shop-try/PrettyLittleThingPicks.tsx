
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Shirt, Lock } from 'lucide-react';
import { ClothingItem } from '@/lib/types';

// Define mock data for PLT products
const mockPLTProducts: ClothingItem[] = [
  {
    id: 'plt-1',
    name: 'Y2K Butterfly Crop Top',
    type: 'shirt',
    color: 'pink',
    season: ['summer'],
    image: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?auto=format&fit=crop&q=80&w=300&h=400',
    imageUrl: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['Y2K', 'Summer', 'Casual'],
    timesWorn: 0
  },
  {
    id: 'plt-2',
    name: 'Satin Mini Dress',
    type: 'dress',
    color: 'black',
    season: ['all'],
    image: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&q=80&w=300&h=400',
    imageUrl: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['Evening', 'Party', 'Elegant'],
    timesWorn: 0
  },
  {
    id: 'plt-3',
    name: 'Oversized Boyfriend Shirt',
    type: 'shirt',
    color: 'white',
    season: ['all'],
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=300&h=400',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['Minimal', 'Office', 'Versatile'],
    timesWorn: 0
  },
  {
    id: 'plt-4',
    name: 'Cargo Wide Leg Pants',
    type: 'pants',
    color: 'green',
    season: ['autumn', 'spring'],
    image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&q=80&w=300&h=400',
    imageUrl: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&q=80&w=300&h=400',
    tags: ['Casual', 'Streetwear', 'Trending'],
    timesWorn: 0
  }
];

interface PrettyLittleThingPicksProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const PrettyLittleThingPicks = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium
}: PrettyLittleThingPicksProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative mb-16"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          🛍️ Trending from PrettyLittleThing
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-pink-500/30 via-transparent to-transparent"></div>
      </div>
      
      <p className="text-center text-white/70 mb-8">
        Outfits curated via PrettyLittleThing – more coming soon!
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {mockPLTProducts.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
            isPremiumUser={isPremiumUser}
            onTryItem={onTryItem}
            onUpgradeToPremium={onUpgradeToPremium}
          />
        ))}
      </div>
      
      <div className="mt-8 text-center text-xs text-white/60">
        <p>Affiliate Disclosure: We may earn a commission for purchases made through these links.</p>
      </div>
    </motion.div>
  );
};

interface ProductCardProps {
  product: ClothingItem;
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
}

const ProductCard = ({ product, isPremiumUser, onTryItem, onUpgradeToPremium }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden h-full">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={product.imageUrl || product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
            New In
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div>
            <p className="text-xs text-purple-300 font-medium">PrettyLittleThing</p>
            <h3 className="font-medium text-white truncate">{product.name}</h3>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {product.tags?.map((tag, index) => (
              <span key={index} className="text-xs bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 w-full"
              onClick={() => {
                if (!isPremiumUser) {
                  onUpgradeToPremium();
                  return;
                }
                onTryItem(product);
              }}
            >
              {!isPremiumUser && <Lock className="h-3.5 w-3.5 mr-1.5" />}
              <Shirt className="h-3.5 w-3.5 mr-1.5" />
              Try on Olivia
            </Button>
            
            <Button 
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 w-full"
              onClick={() => window.open('#plt-affiliate-link', '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Shop at PLT
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PrettyLittleThingPicks;
