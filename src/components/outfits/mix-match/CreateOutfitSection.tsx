import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowRightCircle, Calendar, Save, RotateCcw, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { ClothingItem } from '@/lib/types';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface CreateOutfitSectionProps {
  clothingItems: ClothingItem[];
  isPremium?: boolean;
}

const CreateOutfitSection = ({ clothingItems, isPremium = false }: CreateOutfitSectionProps) => {
  const [selectedTop, setSelectedTop] = useState<ClothingItem | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<ClothingItem | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<ClothingItem | null>(null);
  const [outfitName, setOutfitName] = useState("My Custom Outfit");
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const navigate = useNavigate();
  
  const tops = clothingItems.filter(item => 
    item.type === 'top' || item.type === 'sweater' || item.type === 'jacket'
  );
  
  const bottoms = clothingItems.filter(item => 
    item.type === 'pants' || item.type === 'skirt' || item.type === 'shorts'
  );
  
  const shoes = clothingItems.filter(item => 
    item.type === 'shoes'
  );
  
  const handleSelectItem = (item: ClothingItem) => {
    switch(item.type) {
      case 'top':
      case 'sweater':
      case 'jacket':
        setSelectedTop(item);
        break;
      case 'pants':
      case 'skirt':
      case 'shorts':
        setSelectedBottom(item);
        break;
      case 'shoes':
        setSelectedShoes(item);
        break;
      default:
        break;
    }
  };
  
  const handleSaveOutfit = () => {
    if (!selectedTop || !selectedBottom || !selectedShoes) {
      toast.error("Please select an item for each category");
      return;
    }
    
    toast.success("Outfit saved to your collection!");
  };
  
  const handleTryOn = () => {
    if (!selectedTop || !selectedBottom || !selectedShoes) {
      toast.error("Please select an item for each category");
      return;
    }
    
    if (!isPremium) {
      setShowPremiumDialog(true);
      return;
    }
    
    navigate('/fitting-room', { 
      state: { 
        outfitItems: [selectedTop.id, selectedBottom.id, selectedShoes.id],
        outfitName
      } 
    });
  };
  
  const handleClearSelection = () => {
    setSelectedTop(null);
    setSelectedBottom(null);
    setSelectedShoes(null);
    setOutfitName("My Custom Outfit");
  };
  
  const isOutfitComplete = selectedTop && selectedBottom && selectedShoes;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Create Your Own Outfit
        </h2>
        {isOutfitComplete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="text-white/70 hover:text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Selection
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/60 border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium text-white">Tops</h3>
              <p className="text-sm text-white/60">Select a top item</p>
            </div>
            <CardContent className="p-3">
              <ScrollArea className="h-64 pr-3">
                <div className="grid grid-cols-2 gap-2">
                  {tops.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${
                        selectedTop?.id === item.id 
                          ? 'border-blue-500' 
                          : 'border-transparent hover:border-white/20'
                      }`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-[10px] text-white text-center truncate">
                        {item.name}
                      </div>
                      {selectedTop?.id === item.id && (
                        <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                          <Plus className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/60 border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium text-white">Bottoms</h3>
              <p className="text-sm text-white/60">Select a bottom item</p>
            </div>
            <CardContent className="p-3">
              <ScrollArea className="h-64 pr-3">
                <div className="grid grid-cols-2 gap-2">
                  {bottoms.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${
                        selectedBottom?.id === item.id 
                          ? 'border-blue-500' 
                          : 'border-transparent hover:border-white/20'
                      }`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-[10px] text-white text-center truncate">
                        {item.name}
                      </div>
                      {selectedBottom?.id === item.id && (
                        <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                          <Plus className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/60 border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium text-white">Shoes</h3>
              <p className="text-sm text-white/60">Select shoes</p>
            </div>
            <CardContent className="p-3">
              <ScrollArea className="h-64 pr-3">
                <div className="grid grid-cols-2 gap-2">
                  {shoes.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${
                        selectedShoes?.id === item.id 
                          ? 'border-blue-500' 
                          : 'border-transparent hover:border-white/20'
                      }`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-[10px] text-white text-center truncate">
                        {item.name}
                      </div>
                      {selectedShoes?.id === item.id && (
                        <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                          <Plus className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full bg-slate-900/60 border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium text-white">Outfit Preview</h3>
              <p className="text-sm text-white/60">Your custom outfit</p>
            </div>
            <CardContent className="p-4 flex flex-col h-[calc(100%-60px)]">
              <div className="flex-grow flex flex-col items-center justify-center">
                {!isOutfitComplete ? (
                  <div className="text-center text-white/60">
                    <p className="mb-2">Select at least one item from each category</p>
                    <p className="text-sm">Your outfit will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-6 w-full">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="aspect-square bg-white/5 rounded-md overflow-hidden">
                        {selectedTop && (
                          <img 
                            src={selectedTop.imageUrl} 
                            alt={selectedTop.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="aspect-square bg-white/5 rounded-md overflow-hidden">
                        {selectedBottom && (
                          <img 
                            src={selectedBottom.imageUrl} 
                            alt={selectedBottom.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="aspect-square bg-white/5 rounded-md overflow-hidden">
                        {selectedShoes && (
                          <img 
                            src={selectedShoes.imageUrl} 
                            alt={selectedShoes.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={outfitName}
                        onChange={(e) => setOutfitName(e.target.value)}
                        className="w-full bg-white/10 text-white border border-white/20 p-2 rounded-md text-sm"
                        placeholder="Name your outfit"
                      />
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-blue-600">Custom</Badge>
                        <Badge variant="outline" className="border-white/20 text-white">Mixed</Badge>
                        {selectedTop?.season && (
                          <Badge variant="outline" className="border-white/20 text-white capitalize">
                            {selectedTop.season}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 space-y-3">
                <Button 
                  disabled={!isOutfitComplete}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={handleSaveOutfit}
                >
                  <Save className="mr-2 h-4 w-4" /> Save This Outfit
                </Button>
                
                <Button 
                  variant="outline"
                  disabled={!isOutfitComplete}
                  className="w-full border-purple-400/30 text-white hover:bg-white/10"
                  onClick={handleTryOn}
                >
                  {!isPremium && <Lock className="mr-2 h-4 w-4" />}
                  <ArrowRightCircle className="mr-2 h-4 w-4" /> 
                  Try in Fitting Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="bg-slate-900 text-white border-white/10">
          <DialogTitle>Premium Feature</DialogTitle>
          <DialogDescription className="text-white/70">
            Viewing this outfit on Olivia or your own photo is a Premium feature. Upgrade now to unlock.
          </DialogDescription>
          <div className="mt-4 flex justify-end">
            <Button
              variant="default"
              className="bg-gradient-to-r from-purple-600 to-pink-600"
              onClick={() => {
                setShowPremiumDialog(false);
                navigate('/settings?upgrade=true');
              }}
            >
              Upgrade to Premium
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateOutfitSection;
