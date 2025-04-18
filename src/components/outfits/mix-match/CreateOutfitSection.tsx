
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ClothingItem, ClothingType } from '@/lib/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CreateOutfitSectionProps {
  clothingItems: ClothingItem[];
}

const CreateOutfitSection = ({ clothingItems }: CreateOutfitSectionProps) => {
  const navigate = useNavigate();
  const [selectedTop, setSelectedTop] = useState<string | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<string | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<string | null>(null);
  const [outfitName, setOutfitName] = useState('My Custom Outfit');
  
  // Filter items by type instead of category
  const tops = clothingItems.filter(item => 
    item.type === 'shirt' || 
    item.type === 'sweater' || 
    item.type === 'hoodie' || 
    item.type === 'top' || 
    item.type === 'jacket'
  );
  
  const bottoms = clothingItems.filter(item => 
    item.type === 'pants' || 
    item.type === 'jeans' || 
    item.type === 'shorts' || 
    item.type === 'skirt'
  );
  
  const shoes = clothingItems.filter(item => 
    item.type === 'shoes' || 
    item.type === 'sneakers' || 
    item.type === 'boots'
  );
  
  const isOutfitComplete = selectedTop && selectedBottom && selectedShoes;
  
  // Auto-select first items if none selected
  useEffect(() => {
    if (tops.length > 0 && !selectedTop) {
      setSelectedTop(tops[0].id);
    }
    
    if (bottoms.length > 0 && !selectedBottom) {
      setSelectedBottom(bottoms[0].id);
    }
    
    if (shoes.length > 0 && !selectedShoes) {
      setSelectedShoes(shoes[0].id);
    }
  }, [tops, bottoms, shoes]);
  
  const handleSaveOutfit = () => {
    if (isOutfitComplete) {
      toast.success('Outfit saved to your collection!');
    }
  };
  
  const handleTryOnOlivia = () => {
    if (isOutfitComplete) {
      toast.success('Opening in Fitting Room...');
      navigate('/fitting-room');
    }
  };
  
  const handleAddToCalendar = () => {
    if (isOutfitComplete) {
      toast.success('Outfit added to your calendar!');
    }
  };
  
  // Find selected items
  const selectedTopItem = clothingItems.find(item => item.id === selectedTop);
  const selectedBottomItem = clothingItems.find(item => item.id === selectedBottom);
  const selectedShoesItem = clothingItems.find(item => item.id === selectedShoes);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        Create Your Own Outfit
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-white/10 shadow-lg">
          <CardContent className="p-0">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium text-white">Tops</h3>
              <p className="text-xs text-white/60">Select a top for your outfit</p>
            </div>
            
            <ScrollArea className="h-[300px] p-4">
              <div className="grid grid-cols-2 gap-3">
                {tops.map(item => (
                  <div 
                    key={item.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedTop === item.id ? 'border-purple-500 shadow-md shadow-purple-500/20' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedTop(item.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <img 
                      src={item.imageUrl || '/placeholder.svg'} 
                      alt={item.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 z-20">
                      <p className="text-xs text-white font-medium truncate">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-white/10 shadow-lg">
          <CardContent className="p-0">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium text-white">Bottoms</h3>
              <p className="text-xs text-white/60">Select bottoms for your outfit</p>
            </div>
            
            <ScrollArea className="h-[300px] p-4">
              <div className="grid grid-cols-2 gap-3">
                {bottoms.map(item => (
                  <div 
                    key={item.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedBottom === item.id ? 'border-purple-500 shadow-md shadow-purple-500/20' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedBottom(item.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <img 
                      src={item.imageUrl || '/placeholder.svg'} 
                      alt={item.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 z-20">
                      <p className="text-xs text-white font-medium truncate">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-white/10 shadow-lg">
          <CardContent className="p-0">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium text-white">Shoes</h3>
              <p className="text-xs text-white/60">Select shoes for your outfit</p>
            </div>
            
            <ScrollArea className="h-[300px] p-4">
              <div className="grid grid-cols-2 gap-3">
                {shoes.map(item => (
                  <div 
                    key={item.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedShoes === item.id ? 'border-purple-500 shadow-md shadow-purple-500/20' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedShoes(item.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <img 
                      src={item.imageUrl || '/placeholder.svg'} 
                      alt={item.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 z-20">
                      <p className="text-xs text-white font-medium truncate">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      {isOutfitComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl border border-white/10 p-5 mt-6"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="text-white font-medium mb-3">Your Custom Outfit</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-700/50">
                  {selectedTopItem && (
                    <img 
                      src={selectedTopItem.imageUrl || '/placeholder.svg'} 
                      alt={selectedTopItem.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-700/50">
                  {selectedBottomItem && (
                    <img 
                      src={selectedBottomItem.imageUrl || '/placeholder.svg'} 
                      alt={selectedBottomItem.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-700/50">
                  {selectedShoesItem && (
                    <img 
                      src={selectedShoesItem.imageUrl || '/placeholder.svg'} 
                      alt={selectedShoesItem.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white">{outfitName}</h3>
                <p className="text-sm text-white/70">Your custom-created outfit is ready!</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white/80">Items:</h4>
                <ul className="text-sm text-white/70 space-y-1">
                  {selectedTopItem && <li>• {selectedTopItem.name}</li>}
                  {selectedBottomItem && <li>• {selectedBottomItem.name}</li>}
                  {selectedShoesItem && <li>• {selectedShoesItem.name}</li>}
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveOutfit} className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  <Save className="mr-2 h-4 w-4" />
                  Save This Outfit
                </Button>
                
                <Button 
                  onClick={handleTryOnOlivia}
                  variant="outline"
                  className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                >
                  <User className="mr-2 h-4 w-4" />
                  Try on Olivia
                </Button>
                
                <Button 
                  onClick={handleAddToCalendar}
                  variant="outline"
                  className="border-pink-500/30 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CreateOutfitSection;
