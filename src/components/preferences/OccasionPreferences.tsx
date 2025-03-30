
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  BriefcaseIcon, 
  HeartIcon, 
  PartyPopper, 
  Salad, 
  ShoppingBag, 
  Utensils,
  GraduationCap, 
  Dumbbell, 
  Plane, 
  Coffee 
} from 'lucide-react';

interface OccasionPreferencesProps {
  value: string[];
  onChange: (occasions: string[]) => void;
}

const OccasionPreferences = ({ value, onChange }: OccasionPreferencesProps) => {
  const occasions = [
    { id: 'work', label: 'Work', icon: BriefcaseIcon },
    { id: 'date', label: 'Date Night', icon: HeartIcon },
    { id: 'party', label: 'Party', icon: PartyPopper },
    { id: 'casual', label: 'Everyday Casual', icon: Coffee },
    { id: 'formal', label: 'Formal Events', icon: GraduationCap },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
    { id: 'dining', label: 'Dining Out', icon: Utensils },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'outdoor', label: 'Outdoor Activities', icon: Salad },
    { id: 'travel', label: 'Travel', icon: Plane },
  ];

  const handleToggle = (occasion: string) => {
    const isSelected = value.includes(occasion);
    let updatedOccasions: string[];
    
    if (isSelected) {
      updatedOccasions = value.filter(o => o !== occasion);
    } else {
      updatedOccasions = [...value, occasion];
    }
    
    onChange(updatedOccasions);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select occasions you'd like personalized outfit recommendations for.
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {occasions.map((occasion) => {
          const Icon = occasion.icon;
          return (
            <div 
              key={occasion.id} 
              className={cn(
                "flex flex-col items-center justify-center space-y-2 rounded-md border p-3 cursor-pointer transition-all text-center h-[100px]",
                value.includes(occasion.id) ? "border-primary bg-primary/10" : "border-muted hover:bg-muted/50"
              )}
              onClick={() => handleToggle(occasion.id)}
            >
              <Checkbox
                id={`occasion-${occasion.id}`}
                checked={value.includes(occasion.id)}
                onCheckedChange={() => handleToggle(occasion.id)}
                className="mb-1"
              />
              {Icon && <Icon className="h-5 w-5" />}
              <Label
                htmlFor={`occasion-${occasion.id}`}
                className="cursor-pointer font-medium text-sm"
              >
                {occasion.label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OccasionPreferences;
