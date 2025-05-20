
import { toast } from 'sonner';

// Color validation using a regex pattern that matches common color formats
export const isValidColor = (color: string): boolean => {
  // Basic validation for color names and hex values
  const colorNameRegex = /^[a-zA-Z\s-]+$/; // Allows color names with spaces and hyphens
  const hexColorRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
  
  return colorNameRegex.test(color) || hexColorRegex.test(color);
};

// Common color names for autocomplete
export const commonColors = [
  'black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 
  'pink', 'orange', 'brown', 'grey', 'navy', 'teal', 'olive',
  'maroon', 'aqua', 'turquoise', 'silver', 'gold', 'beige',
  'coral', 'indigo', 'lavender', 'violet', 'magenta', 'cyan',
  'crimson', 'emerald', 'burgundy', 'charcoal', 'ivory',
  'mint', 'olive green', 'forest green', 'sky blue', 'royal blue',
  'pastel pink', 'pastel blue', 'pastel green', 'dark blue',
  'light blue', 'dark green', 'light green'
];

// Common style tags for autocomplete
export const commonStyleTags = [
  'casual', 'formal', 'business', 'elegant', 'sporty', 
  'athleisure', 'vintage', 'retro', 'bohemian', 'minimalist',
  'streetwear', 'classic', 'preppy', 'chic', 'edgy', 'romantic',
  'goth', 'punk', 'feminine', 'masculine', 'androgynous', 'outdoorsy',
  'beach', 'resort', 'vacation', 'winter', 'summer', 'spring',
  'fall', 'cozy', 'comfortable', 'professional', 'academic',
  'artistic', 'sustainable', 'luxury', 'trendy', 'timeless'
];

// Common occasions for autocomplete
export const commonOccasions = [
  'work', 'office', 'casual', 'formal', 'party', 'date night',
  'wedding', 'funeral', 'job interview', 'business meeting',
  'weekend', 'vacation', 'beach', 'gym', 'workout', 'hiking',
  'dinner', 'brunch', 'coffee', 'nightclub', 'concert', 'theatre',
  'graduation', 'ceremony', 'conference', 'presentation', 'networking',
  'family gathering', 'holiday', 'religious service', 'outdoor activity'
];

// Normalize a string to lowercase for case-insensitive comparison
export const normalizeString = (str: string): string => {
  return str.trim().toLowerCase();
};

// Check for duplicate in an array based on case-insensitive comparison
export const isDuplicate = (array: string[], value: string): boolean => {
  const normalizedValue = normalizeString(value);
  return array.some(item => normalizeString(item) === normalizedValue);
};

// Get suggestions based on input and available options
export const getSuggestions = (input: string, options: string[]): string[] => {
  const normalizedInput = normalizeString(input);
  
  if (!normalizedInput) return [];
  
  return options
    .filter(option => normalizeString(option).includes(normalizedInput))
    .slice(0, 5); // Limit to 5 suggestions
};
