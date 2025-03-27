
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Plus,
  Shirt,
  Crown,
  Watch,
  Lock,
  Footprints,
  Sparkles
} from 'lucide-react';
import { ClothingItem } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { TrousersIcon } from '@/components/ui/icons';

interface ClothingCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: ClothingItem[];
  isPremium?: boolean;
}

// Sample clothing items
const sampleCategories: ClothingCategory[] = [
  {
    id: 'tops',
    name: 'Tops',
    icon: <Shirt className="h-5 w-5" />,
    items: [
      { id: 'top1', name: 'White Blouse', type: 'shirt', imageUrl: '/placeholder.svg', occasions: ['casual', 'business'], seasons: ['spring', 'summer'], color: 'white', material: 'cotton', favorite: false, timesWorn: 0, dateAdded: new Date() },
      { id: 'top2', name: 'Black T-Shirt', type: 'shirt', imageUrl: '/placeholder.svg', occasions: ['casual'], seasons: ['all'], color: 'black', material: 'cotton', favorite: false, timesWorn: 0, dateAdded: new Date() },
    ]
  },
  {
    id: 'bottoms',
    name: 'Bottoms',
    icon: <TrousersIcon className="h-5 w-5" />,
    items: [
      { id: 'bottom1', name: 'Blue Jeans', type: 'jeans', imageUrl: '/placeholder.svg', occasions: ['casual'], seasons: ['all'], color: 'blue', material: 'denim', favorite: false, timesWorn: 0, dateAdded: new Date() },
      { id: 'bottom2', name: 'Black Pants', type: 'pants', imageUrl: '/placeholder.svg', occasions: ['business'], seasons: ['autumn', 'winter'], color: 'black', material: 'cotton', favorite: false, timesWorn: 0, dateAdded: new Date() },
    ]
  },
  {
    id: 'shoes',
    name: 'Shoes',
    icon: <Footprints className="h-5 w-5" />,
    items: [
      { id: 'shoe1', name: 'Sneakers', type: 'sneakers', imageUrl: '/placeholder.svg', occasions: ['casual'], seasons: ['all'], color: 'white', material: 'other', favorite: false, timesWorn: 0, dateAdded: new Date() },
      { id: 'shoe2', name: 'Boots', type: 'boots', imageUrl: '/placeholder.svg', occasions: ['casual', 'party'], seasons: ['autumn', 'winter'], color: 'brown', material: 'leather', favorite: false, timesWorn: 0, dateAdded: new Date() },
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: <Watch className="h-5 w-5" />,
    items: [
      { id: 'acc1', name: 'Silver Necklace', type: 'accessories', imageUrl: '/placeholder.svg', occasions: ['casual', 'party'], seasons: ['all'], color: 'gray', material: 'other', favorite: false, timesWorn: 0, dateAdded: new Date() },
      { id: 'acc2', name: 'Watch', type: 'accessories', imageUrl: '/placeholder.svg', occasions: ['business'], seasons: ['all'], color: 'black', material: 'other', favorite: false, timesWorn: 0, dateAdded: new Date() },
    ],
    isPremium: true
  },
  {
    id: 'premium',
    name: 'Premium Items',
    icon: <Crown className="h-5 w-5 text-yellow-400" />,
    items: [
      { id: 'premium1', name: 'Designer Jacket', type: 'jacket', imageUrl: '/placeholder.svg', occasions: ['party'], seasons: ['autumn', 'winter'], color: 'black', material: 'leather', favorite: false, timesWorn: 0, dateAdded: new Date() },
      { id: 'premium2', name: 'Luxury Bag', type: 'accessories', imageUrl: '/placeholder.svg', occasions: ['party'], seasons: ['all'], color: 'brown', material: 'leather', favorite: false, timesWorn: 0, dateAdded: new Date() },
    ],
    isPremium: true
  }
];

interface AdditionalItemsSelectorProps {
  onAddItem: (item: ClothingItem) => void;
  onPremiumClick: () => void;
  isPremium: boolean;
  className?: string;
}

const AdditionalItemsSelector = ({ onAddItem, onPremiumClick, isPremium, className }: AdditionalItemsSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleOpenDialog = (category: ClothingCategory) => {
    if (category.isPremium && !isPremium) {
      onPremiumClick();
      return;
    }
    
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };
  
  const handleSelectItem = (item: ClothingItem) => {
    onAddItem(item);
    setIsDialogOpen(false);
    toast.success(`Added ${item.name} to your outfit`);
  };
  
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Add More Items</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {sampleCategories.map(category => (
          <Button
            key={category.id}
            variant="outline"
            className={`h-auto py-3 border-white/20 bg-white/5 hover:bg-white/10 text-white relative flex-col ${category.isPremium && !isPremium ? 'opacity-80' : ''}`}
            onClick={() => handleOpenDialog(category)}
          >
            <div className="mb-2">
              {category.icon}
            </div>
            <span className="text-sm">{category.name}</span>
            
            {category.isPremium && !isPremium && (
              <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                <Lock className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </Button>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 text-white border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              {selectedCategory?.icon}
              <span>Select {selectedCategory?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Choose an item to add to your current outfit
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3 py-4">
            {selectedCategory?.items.map(item => (
              <div 
                key={item.id}
                className="border border-white/10 rounded-lg p-2 hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => handleSelectItem(item)}
              >
                <div className="aspect-square mb-2 rounded overflow-hidden bg-slate-800">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-medium text-white">{item.name}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdditionalItemsSelector;
