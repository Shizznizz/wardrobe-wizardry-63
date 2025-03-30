
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { PersonalityTag } from '@/lib/types';

interface StylePreferencesProps {
  value: string[];
  onChange: (styles: string[]) => void;
  isPersonalityTags?: boolean;
}

const StylePreferences = ({ value, onChange, isPersonalityTags = false }: StylePreferencesProps) => {
  const styles = isPersonalityTags ? [
    'minimalist',
    'bold',
    'trendy',
    'classic',
    'casual',
    'formal',
    'sporty',
    'elegant',
    'vintage',
    'bohemian',
    'preppy',
    'artistic'
  ] : [
    'casual',
    'formal',
    'business casual',
    'sporty',
    'bohemian',
    'vintage',
    'minimalist',
    'streetwear',
    'preppy',
    'athleisure',
    'romantic',
    'edgy'
  ];

  const handleToggle = (style: string) => {
    const isSelected = value.includes(style);
    let updatedStyles: string[];
    
    if (isSelected) {
      updatedStyles = value.filter(s => s !== style);
    } else {
      updatedStyles = [...value, style];
    }
    
    onChange(updatedStyles);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {isPersonalityTags 
          ? "Select tags that describe your personal style."
          : "Select clothing styles you prefer to wear most often."
        }
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {styles.map((style) => (
          <div 
            key={style} 
            className={cn(
              "flex items-center space-x-3 rounded-md border p-3 cursor-pointer transition-all",
              value.includes(style) ? "border-primary bg-primary/10" : "border-muted hover:bg-muted/50"
            )}
            onClick={() => handleToggle(style)}
          >
            <Checkbox
              id={`style-${style}`}
              checked={value.includes(style)}
              onCheckedChange={() => handleToggle(style)}
            />
            <div className="flex items-center gap-3">
              <Label
                htmlFor={`style-${style}`}
                className="cursor-pointer font-medium capitalize"
              >
                {style}
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StylePreferences;
