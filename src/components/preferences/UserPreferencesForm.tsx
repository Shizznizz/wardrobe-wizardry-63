
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';
import { UserPreferences, ClothingColor } from '@/lib/types';
import ColorSelector from './ColorSelector';
import { Badge } from '@/components/ui/badge';

interface UserPreferencesFormProps {
  initialPreferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

const formSchema = z.object({
  favoriteColors: z.array(z.string()).min(1, 'Select at least one color'),
  favoriteStyles: z.array(z.string()).min(1, 'Select at least one style'),
  personalityTags: z.array(z.string()).optional(),
  bodyType: z.string().optional(),
  outfitReminders: z.boolean().default(false),
  reminderTime: z.string().default('08:00'),
  occasionPreferences: z.array(z.string()).optional(),
  climatePreferences: z.array(z.string()).optional(),
});

const UserPreferencesForm = ({ initialPreferences, onSave }: UserPreferencesFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState('style');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      favoriteColors: initialPreferences.favoriteColors?.map(color => color as string) || [],
      favoriteStyles: initialPreferences.favoriteStyles || [],
      personalityTags: initialPreferences.personalityTags || [],
      bodyType: initialPreferences.bodyType || 'not-specified',
      outfitReminders: initialPreferences.outfitReminders || false,
      reminderTime: initialPreferences.reminderTime || '08:00',
      occasionPreferences: initialPreferences.occasionPreferences || [],
      climatePreferences: initialPreferences.climatePreferences || [],
    },
  });
  
  useEffect(() => {
    form.reset({
      favoriteColors: initialPreferences.favoriteColors?.map(color => color as string) || [],
      favoriteStyles: initialPreferences.favoriteStyles || [],
      personalityTags: initialPreferences.personalityTags || [],
      bodyType: initialPreferences.bodyType || 'not-specified',
      outfitReminders: initialPreferences.outfitReminders || false,
      reminderTime: initialPreferences.reminderTime || '08:00',
      occasionPreferences: initialPreferences.occasionPreferences || [],
      climatePreferences: initialPreferences.climatePreferences || [],
    });
  }, [initialPreferences, form]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Merge form values with existing preferences to ensure we don't lose data
      const updatedPreferences: UserPreferences = {
        ...initialPreferences,
        favoriteColors: values.favoriteColors as ClothingColor[],
        favoriteStyles: values.favoriteStyles,
        personalityTags: values.personalityTags,
        bodyType: values.bodyType,
        outfitReminders: values.outfitReminders,
        reminderTime: values.reminderTime,
        occasionPreferences: values.occasionPreferences,
        climatePreferences: values.climatePreferences,
      };
      
      await onSave(updatedPreferences);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const colorOptions: { label: string; value: ClothingColor }[] = [
    { label: 'Black', value: 'black' },
    { label: 'White', value: 'white' },
    { label: 'Gray', value: 'gray' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Red', value: 'red' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Purple', value: 'purple' },
    { label: 'Pink', value: 'pink' },
    { label: 'Orange', value: 'orange' },
    { label: 'Brown', value: 'brown' },
    { label: 'Navy', value: 'navy' },
    { label: 'Beige', value: 'beige' },
    { label: 'Burgundy', value: 'burgundy' },
  ];
  
  const styleOptions = [
    { label: 'Casual', value: 'casual' },
    { label: 'Business Casual', value: 'business casual' },
    { label: 'Formal', value: 'formal' },
    { label: 'Sportswear', value: 'sportswear' },
    { label: 'Minimalist', value: 'minimalist' },
    { label: 'Vintage', value: 'vintage' },
    { label: 'Bohemian', value: 'bohemian' },
    { label: 'Streetwear', value: 'streetwear' },
    { label: 'Preppy', value: 'preppy' },
    { label: 'Romantic', value: 'romantic' },
    { label: 'Elegant', value: 'elegant' },
    { label: 'Smart Casual', value: 'smart casual' },
    { label: 'Trendy', value: 'trendy' },
  ];
  
  const personalityOptions = [
    { label: 'Minimalist', value: 'minimalist' },
    { label: 'Bold', value: 'bold' },
    { label: 'Trendy', value: 'trendy' },
    { label: 'Classic', value: 'classic' },
    { label: 'Casual', value: 'casual' },
    { label: 'Formal', value: 'formal' },
    { label: 'Sporty', value: 'sporty' },
    { label: 'Elegant', value: 'elegant' },
    { label: 'Vintage', value: 'vintage' },
    { label: 'Bohemian', value: 'bohemian' },
    { label: 'Preppy', value: 'preppy' },
    { label: 'Artistic', value: 'artistic' },
  ];
  
  const occasionOptions = [
    { label: 'Everyday', value: 'everyday' },
    { label: 'Work', value: 'work' },
    { label: 'Casual', value: 'casual' },
    { label: 'Formal', value: 'formal' },
    { label: 'Party', value: 'party' },
    { label: 'Date Night', value: 'date' },
    { label: 'Special Occasion', value: 'special' },
    { label: 'Travel', value: 'travel' },
    { label: 'Workout', value: 'workout' },
    { label: 'Beach', value: 'beach' },
    { label: 'Vacation', value: 'vacation' },
  ];
  
  const climateOptions = [
    { label: 'Hot/Summer', value: 'hot' },
    { label: 'Cold/Winter', value: 'cold' },
    { label: 'Mild/Spring', value: 'mild' },
    { label: 'Rainy', value: 'rainy' },
    { label: 'Windy', value: 'windy' },
    { label: 'Humid', value: 'humid' },
    { label: 'Dry', value: 'dry' },
    { label: 'I am flexible', value: 'flexible' },
  ];
  
  const bodyTypeOptions = [
    { label: 'Hourglass', value: 'hourglass' },
    { label: 'Apple', value: 'apple' },
    { label: 'Pear', value: 'pear' },
    { label: 'Rectangle', value: 'rectangle' },
    { label: 'Inverted Triangle', value: 'inverted-triangle' },
    { label: 'I prefer not to specify', value: 'not-specified' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="occasions">Occasions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="style" className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="favoriteColors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-white">Favorite Colors</FormLabel>
                    <FormDescription className="text-blue-100/80">
                      Select colors you prefer for your clothing items
                    </FormDescription>
                    <div className="mt-3">
                      <ColorSelector
                        selected={field.value}
                        options={colorOptions}
                        onChange={(colors) => field.onChange(colors)}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="favoriteStyles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-white">Favorite Styles</FormLabel>
                    <FormDescription className="text-blue-100/80">
                      Select clothing styles you prefer
                    </FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                      {styleOptions.map((style) => (
                        <FormField
                          key={style.value}
                          control={form.control}
                          name="favoriteStyles"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={style.value}
                                className="flex items-center space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(style.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, style.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== style.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {style.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="personalityTags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-white">Style Personality</FormLabel>
                    <FormDescription className="text-blue-100/80">
                      How would you describe your fashion personality?
                    </FormDescription>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {personalityOptions.map((tag) => {
                        const isSelected = field.value?.includes(tag.value);
                        return (
                          <Badge
                            key={tag.value}
                            variant="outline"
                            className={`cursor-pointer px-3 py-1 ${
                              isSelected
                                ? 'bg-purple-500/30 border-purple-400/50 text-white'
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                            onClick={() => {
                              const currentValues = field.value || [];
                              const newValues = isSelected
                                ? currentValues.filter((v) => v !== tag.value)
                                : [...currentValues, tag.value];
                              field.onChange(newValues);
                            }}
                          >
                            {tag.label}
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="body" className="space-y-6">
            <FormField
              control={form.control}
              name="bodyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-white">Body Type</FormLabel>
                  <FormDescription className="text-blue-100/80">
                    Select your body type for more accurate outfit recommendations
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                        <SelectValue placeholder="Select your body type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 border-white/10 text-white">
                      {bodyTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="p-4 bg-slate-800/30 border border-purple-500/20 rounded-md">
              <h3 className="font-medium text-white mb-2">What are body types?</h3>
              <p className="text-sm text-white/80 mb-3">
                Body types help our AI suggest outfits that complement your natural shape:
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li><strong className="text-white">Hourglass:</strong> Similar shoulder and hip width with a defined waist</li>
                <li><strong className="text-white">Apple:</strong> Fuller bust/midsection with slimmer legs</li>
                <li><strong className="text-white">Pear:</strong> Narrower shoulders with wider hips</li>
                <li><strong className="text-white">Rectangle:</strong> Similar measurements throughout with less waist definition</li>
                <li><strong className="text-white">Inverted Triangle:</strong> Broader shoulders with narrower hips</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="occasions" className="space-y-6">
            <FormField
              control={form.control}
              name="occasionPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-white">Occasions</FormLabel>
                  <FormDescription className="text-blue-100/80">
                    What occasions do you need outfits for?
                  </FormDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                    {occasionOptions.map((occasion) => (
                      <FormField
                        key={occasion.value}
                        control={form.control}
                        name="occasionPreferences"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={occasion.value}
                              className="flex items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(occasion.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value || [], occasion.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== occasion.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {occasion.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="climatePreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-white">Climate Preferences</FormLabel>
                  <FormDescription className="text-blue-100/80">
                    What climate conditions do you dress for?
                  </FormDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                    {climateOptions.map((climate) => (
                      <FormField
                        key={climate.value}
                        control={form.control}
                        name="climatePreferences"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={climate.value}
                              className="flex items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(climate.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value || [], climate.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== climate.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {climate.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <FormField
              control={form.control}
              name="outfitReminders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Daily Outfit Reminders</FormLabel>
                    <FormDescription>
                      Receive daily notifications for outfit suggestions
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch("outfitReminders") && (
              <FormField
                control={form.control}
                name="reminderTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        className="bg-slate-800/50 border-white/10 text-white"
                      />
                    </FormControl>
                    <FormDescription>
                      What time would you like to receive notifications?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserPreferencesForm;
