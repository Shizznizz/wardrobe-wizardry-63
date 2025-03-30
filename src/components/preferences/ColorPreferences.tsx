
import { ClothingColor } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ColorPreferencesProps {
  value: ClothingColor[];
  onChange: (colors: ClothingColor[]) => void;
}

const ColorPreferences = ({ value, onChange }: ColorPreferencesProps) => {
  const colors: { label: string; value: ClothingColor; bgClass: string }[] = [
    { label: 'Black', value: 'black', bgClass: 'bg-black' },
    { label: 'White', value: 'white', bgClass: 'bg-white' },
    { label: 'Gray', value: 'gray', bgClass: 'bg-gray-400' },
    { label: 'Red', value: 'red', bgClass: 'bg-red-500' },
    { label: 'Blue', value: 'blue', bgClass: 'bg-blue-500' },
    { label: 'Green', value: 'green', bgClass: 'bg-green-500' },
    { label: 'Yellow', value: 'yellow', bgClass: 'bg-yellow-400' },
    { label: 'Purple', value: 'purple', bgClass: 'bg-purple-500' },
    { label: 'Pink', value: 'pink', bgClass: 'bg-pink-400' },
    { label: 'Orange', value: 'orange', bgClass: 'bg-orange-500' },
    { label: 'Brown', value: 'brown', bgClass: 'bg-amber-700' },
    { label: 'Multicolor', value: 'multicolor', bgClass: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' },
  ];

  const handleToggle = (color: ClothingColor) => {
    const isSelected = value.includes(color);
    let updatedColors: ClothingColor[];
    
    if (isSelected) {
      updatedColors = value.filter(c => c !== color);
    } else {
      updatedColors = [...value, color];
    }
    
    onChange(updatedColors);
  };

  return (
    <div className="space-y-4 bg-transparent">
      <p className="text-sm text-muted-foreground">
        Select colors you prefer to wear most often.
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {colors.map((color) => {
          // Check if the color is included
          const isSelected = value.includes(color.value);
          
          return (
            <div 
              key={color.value} 
              className={cn(
                "relative flex items-center space-x-3 rounded-md border p-3 cursor-pointer transition-all z-0",
                isSelected ? "border-primary bg-primary/10" : "border-muted hover:bg-muted/50"
              )}
              onClick={() => handleToggle(color.value)}
            >
              <Checkbox
                id={`color-${color.value}`}
                checked={isSelected}
                // Remove the onCheckedChange to prevent double triggering
                className="z-10"
              />
              <div className="flex items-center gap-3 flex-1 z-10">
                <div 
                  className={cn(
                    "w-6 h-6 rounded-full border shadow-sm", 
                    color.bgClass,
                    color.value === 'white' ? "border-gray-300" : "border-transparent"
                  )} 
                />
                <Label
                  htmlFor={`color-${color.value}`}
                  className="cursor-pointer font-medium"
                >
                  {color.label}
                </Label>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default ColorPreferences;
