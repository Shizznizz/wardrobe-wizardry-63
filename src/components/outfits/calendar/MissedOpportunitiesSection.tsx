
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format, subDays, isSameDay } from 'date-fns';
import { Cloud, CloudRain, Sun, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Outfit, ClothingItem } from '@/lib/types';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { CTAButton } from '@/components/ui/cta-button';
import WardrobeDrawer from '@/components/outfits/mix-match/outfit-builder/WardrobeDrawer';
import AdditionalItemsSelector from '@/components/outfits/AdditionalItemsSelector';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface MissedOpportunitiesProps {
  outfitLogs: OutfitLog[];
  outfits: Outfit[];
  clothingItems?: ClothingItem[];
}

interface MissedOpportunity {
  date: Date;
  weather?: string;
  temperature?: string;
  activity?: string;
}

const MissedOpportunitiesSection = ({ outfitLogs, outfits, clothingItems = [] }: MissedOpportunitiesProps) => {
  const [missedOpportunities, setMissedOpportunities] = useState<MissedOpportunity[]>([]);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [isNoWardrobeAlertOpen, setIsNoWardrobeAlertOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<MissedOpportunity | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Weather conditions for demo
  const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Overcast'];
  const temperatures = ['14°C', '22°C', '18°C', '10°C', '27°C', '5°C'];
  const activities = ['Work', 'Casual Day', 'Dinner', 'Date Night', 'Shopping', 'Workout'];

  // Generate demo missed opportunities - in a real app, this would be based on actual data
  useEffect(() => {
    const today = new Date();
    const missedDates: MissedOpportunity[] = [];
    
    // Look back 30 days
    for (let i = 1; i <= 30; i++) {
      const date = subDays(today, i);
      
      // Check if this date has outfit logs
      const hasLogs = outfitLogs.some(log => 
        log.date && isSameDay(new Date(log.date), date)
      );
      
      // Randomly add some missed opportunities (for demo purposes)
      // In a real app, check against activity data
      if (!hasLogs && Math.random() > 0.8) {
        missedDates.push({
          date,
          weather: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
          temperature: temperatures[Math.floor(Math.random() * temperatures.length)],
          activity: Math.random() > 0.4 ? activities[Math.floor(Math.random() * activities.length)] : undefined
        });
      }
    }
    
    setMissedOpportunities(missedDates.slice(0, 5)); // Limit to 5 items
  }, [outfitLogs]);

  const handleAssignOutfit = (opportunity: MissedOpportunity) => {
    if (!clothingItems || clothingItems.length === 0) {
      setIsNoWardrobeAlertOpen(true);
      return;
    }
    
    setSelectedDate(opportunity.date);
    setSelectedOpportunity(opportunity);
    setIsSelectionOpen(true);
  };

  const handleOutfitSelection = (item: ClothingItem) => {
    // Check if item already in selection
    if (selectedItems.some(selectedItem => selectedItem.id === item.id)) {
      // Remove item if already selected
      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      // Add item if not already selected
      setSelectedItems(prev => [...prev, item]);
    }
  };

  const handleSaveOutfit = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item for your outfit");
      return;
    }
    
    // In a real app, this would call a function to create a log entry
    // addOutfitLog({ items: selectedItems.map(item => item.id), date: selectedDate, ... })
    
    toast.success(`Outfit assigned to ${format(selectedDate!, 'MMMM d, yyyy')}`);
    setIsSelectionOpen(false);
    setSelectedItems([]);
  };

  const handleGoToWardrobe = () => {
    setIsNoWardrobeAlertOpen(false);
    navigate('/wardrobe');
  };

  const getWeatherIcon = (weather?: string) => {
    if (!weather) return null;
    
    if (weather.toLowerCase().includes('rain')) {
      return <CloudRain className="h-5 w-5 text-blue-400" />;
    } else if (weather.toLowerCase().includes('cloud')) {
      return <Cloud className="h-5 w-5 text-gray-400" />;
    } else {
      return <Sun className="h-5 w-5 text-yellow-400" />;
    }
  };

  const categoryOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'accessories', label: 'Accessories' }
  ];

  // If no missed opportunities, show a message
  if (missedOpportunities.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Calendar className="h-10 w-10 mx-auto mb-4 text-purple-400 opacity-60" />
          <p className="text-purple-200">Great job! You haven't missed any opportunities to log your outfits recently.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {missedOpportunities.map((opportunity, index) => (
          <Card 
            key={index}
            className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm transition-all hover:bg-slate-800/70"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-medium text-white">
                  {format(opportunity.date, 'EEE, MMM d')}
                </p>
                <div className="flex items-center gap-2">
                  {getWeatherIcon(opportunity.weather)}
                  <span className="text-sm text-white/80">
                    {opportunity.weather}
                    {opportunity.temperature && ` – ${opportunity.temperature}`}
                  </span>
                </div>
              </div>
              
              {opportunity.activity && (
                <div className="mb-4">
                  <span className="text-xs text-purple-300 font-medium uppercase tracking-wide">Activity</span>
                  <p className="text-white/90">{opportunity.activity}</p>
                </div>
              )}
              
              <Button 
                variant="secondary" 
                size="sm"
                className="w-full mt-2 bg-purple-800/30 hover:bg-purple-700/40"
                onClick={() => handleAssignOutfit(opportunity)}
              >
                Assign Outfit Retroactively
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Outfit Assignment Modal */}
      <Dialog open={isSelectionOpen} onOpenChange={setIsSelectionOpen}>
        <DialogContent className="bg-slate-900 border-purple-500/20 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Assign Outfit for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''} 
              {selectedOpportunity?.activity && ` – ${selectedOpportunity.activity}`}
            </DialogTitle>
            <DialogDescription className="text-white/70 flex items-center gap-2 mt-1">
              {selectedOpportunity?.weather && getWeatherIcon(selectedOpportunity.weather)}
              <span>
                {selectedOpportunity?.weather} 
                {selectedOpportunity?.temperature && ` – ${selectedOpportunity.temperature}`}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Wardrobe Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Create Outfit</h3>
                <div className="flex gap-2">
                  {categoryOptions.map(option => (
                    <Button 
                      key={option.value}
                      variant={selectedCategory === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(option.value)}
                      className={selectedCategory === option.value 
                        ? "bg-purple-600 hover:bg-purple-700" 
                        : "border-white/20 bg-white/5 hover:bg-white/10 text-white"
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Selected Items Preview */}
              {selectedItems.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl border border-white/10 p-4">
                  <h4 className="text-sm font-medium text-white/80 mb-2">Selected Items</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {selectedItems.map(item => (
                      <div 
                        key={item.id} 
                        className="aspect-square rounded overflow-hidden border border-purple-500/50 relative group"
                      >
                        <img 
                          src={item.imageUrl || item.image || '/placeholder.svg'} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div 
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => handleOutfitSelection(item)}
                        >
                          <span className="text-white text-xs">Remove</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Wardrobe Items */}
              <WardrobeDrawer
                items={clothingItems}
                selectedCategory={selectedCategory}
                onSelectItem={handleOutfitSelection}
                selectedItems={selectedItems}
              />
              
              {/* Additional Items Selector */}
              <AdditionalItemsSelector
                onAddItem={handleOutfitSelection}
                onPremiumClick={() => {}}
                isPremium={false}
                className="mt-6"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsSelectionOpen(false)}
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
            >
              Cancel
            </Button>
            <CTAButton 
              onClick={handleSaveOutfit}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-95 shadow-lg shadow-pink-500/20"
              icon={<Calendar className="h-4 w-4" />}
            >
              Save Outfit to {selectedDate ? format(selectedDate, 'MMMM d') : ''}
            </CTAButton>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* No Wardrobe Items Alert */}
      <AlertDialog open={isNoWardrobeAlertOpen} onOpenChange={setIsNoWardrobeAlertOpen}>
        <AlertDialogContent className="bg-slate-900 text-white border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Wardrobe Empty</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              You need to add items to your wardrobe before assigning an outfit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel className="bg-white/5 border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleGoToWardrobe}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Go to My Wardrobe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MissedOpportunitiesSection;
