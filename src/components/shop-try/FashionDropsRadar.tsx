
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface FashionDropsRadarProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
}

interface FashionDrop {
  id: string;
  brand: string;
  name: string;
  image: string;
  date: string;
  description: string;
}

const FashionDropsRadar = ({
  isPremiumUser,
  onUpgradeToPremium
}: FashionDropsRadarProps) => {
  // Add this to override premium status for Daniel
  const { user } = useAuth();
  const isDanielDeurlooEmail = user?.email === 'danieldeurloo@hotmail.com';
  const effectivePremiumUser = isDanielDeurlooEmail ? false : isPremiumUser;
  
  const [fashionDrops] = useState<FashionDrop[]>([
    {
      id: 'drop-1',
      brand: 'Zara',
      name: 'Summer Studio Collection',
      image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&q=80&w=300&h=300',
      date: '2025-04-18',
      description: 'Exclusive prints designed by emerging artists.'
    },
    {
      id: 'drop-2',
      brand: 'H&M',
      name: 'Designer Collaboration',
      image: 'https://images.unsplash.com/photo-1592495989226-03f88104f8cc?auto=format&fit=crop&q=80&w=300&h=300',
      date: '2025-04-22',
      description: 'Limited edition pieces with top fashion houses.'
    },
    {
      id: 'drop-3',
      brand: 'Urban Outfitters',
      name: 'Vintage Revival',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=300&h=300',
      date: '2025-05-05',
      description: '90s inspired capsule with authentic materials.'
    },
    {
      id: 'drop-4',
      brand: 'ASOS',
      name: 'Sustainable Essentials',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=300&h=300',
      date: '2025-05-12',
      description: 'Eco-conscious basics made from recycled materials.'
    }
  ]);
  
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  
  const handleRemindMe = (dropId: string) => {
    if (!effectivePremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    setReminders(prev => ({ 
      ...prev, 
      [dropId]: !prev[dropId] 
    }));
    
    const drop = fashionDrops.find(d => d.id === dropId);
    
    if (drop) {
      if (reminders[dropId]) {
        toast.success(`Removed reminder for ${drop.brand} ${drop.name}`);
      } else {
        toast.success(`We'll remind you about ${drop.brand} ${drop.name} drop!`);
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    const dropDate = new Date(dateString);
    const diffTime = dropDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Dropping Soon: Hype Radar
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {fashionDrops.map((drop) => (
          <Card 
            key={drop.id}
            className="border-0 shadow-soft bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur-lg overflow-hidden"
          >
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={drop.image} 
                alt={drop.name} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                {drop.brand}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="flex items-center text-white/90 text-sm mb-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(drop.date)}</span>
                </div>
                
                <div className="bg-purple-600/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white inline-block">
                  {getDaysRemaining(drop.date) <= 0 
                    ? 'Available now!' 
                    : `${getDaysRemaining(drop.date)} days left`}
                </div>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <h3 className="font-medium text-white">{drop.name}</h3>
              <p className="text-sm text-white/70 min-h-[40px]">{drop.description}</p>
              
              <Button 
                variant={reminders[drop.id] ? "default" : "outline"}
                className={`w-full ${
                  reminders[drop.id] 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-500' 
                    : 'border-white/20 hover:bg-white/10'
                }`}
                onClick={() => handleRemindMe(drop.id)}
              >
                {reminders[drop.id] ? (
                  <>
                    <BellOff className="h-4 w-4 mr-2" />
                    Remove Reminder
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Remind Me
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default FashionDropsRadar;
