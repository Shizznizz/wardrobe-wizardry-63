
import React from 'react';
import { Sparkles, Wand2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClothingItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOutfitContext } from '@/hooks/useOutfitContext';
import { toast } from 'sonner';

interface CreateOutfitSectionProps {
  clothingItems: ClothingItem[];
  isPremium: boolean;
}

const CreateOutfitSection = ({ clothingItems, isPremium }: CreateOutfitSectionProps) => {
  const { 
    setIsBuilderOpen, 
    setSelectedOutfitId,
    setIsCreatingNewOutfit,
    setSelectedOutfit
  } = useOutfitContext();
  
  const handleOliviaCreate = () => {
    toast.success("Olivia is creating a custom outfit for you!");
    // In a real app, this would trigger the AI to generate an outfit
  };

  const handleCreateOutfit = () => {
    console.log("Opening outfit builder to create a new outfit");
    // Reset all outfit selection and editing state
    setSelectedOutfitId(null); // Clear any selected outfit ID
    setSelectedOutfit(null);   // Clear selected outfit object
    setIsCreatingNewOutfit(true); // Set to create mode 
    setIsBuilderOpen(true);    // Ensure the builder modal opens
    toast.info("Creating a new outfit");
  };
  
  return (
    <Card className="overflow-hidden border border-white/10 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-md">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Create Your Own Look</h3>
            </div>
            <p className="text-white/70 text-sm max-w-xl">
              Mix and match items from your wardrobe to create a custom outfit, or let Olivia design one for you based on your preferences
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">  
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleCreateOutfit}
              className="border-purple-500/30 text-white hover:bg-white/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Outfit
            </Button>          
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleOliviaCreate}
              className="border-purple-500/30 text-white hover:bg-white/10"
              disabled={!isPremium}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Let Olivia Create
              {!isPremium && (
                <Badge variant="outline" className="ml-2 bg-purple-500/20 text-purple-300 border-none text-xs">
                  Premium
                </Badge>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {clothingItems.slice(0, 5).map((item) => (
            <div 
              key={item.id} 
              className="relative group overflow-hidden rounded-lg border border-white/10 bg-slate-800/50 aspect-square"
            >
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-2 w-full">
                  <p className="text-white text-xs font-medium truncate">{item.name}</p>
                  <p className="text-white/70 text-xs truncate">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateOutfitSection;
