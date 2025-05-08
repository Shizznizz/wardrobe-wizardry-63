
import { useState, useMemo, useEffect } from 'react';
import { Check, Loader2, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LocationSelectorProps {
  onLocationSelected?: (location: { city: string; country: string }) => void;
  className?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  compact?: boolean;
}

// Popular cities for quick selection
const popularLocations = [
  { city: 'New York', country: 'United States' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Paris', country: 'France' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Dubai', country: 'United Arab Emirates' },
];

const LocationSelector = ({
  onLocationSelected,
  className = "",
  buttonVariant = "outline",
  compact = false
}: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ city: string; country: string }>>([]);
  const { savedLocation, saveLocation } = useLocationStorage();
  const [selectedLocation, setSelectedLocation] = useState<{ city: string; country: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize selected location from saved location
  useEffect(() => {
    if (savedLocation && !selectedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, [savedLocation]);

  // Filter popular locations based on search term
  const filteredLocations = useMemo(() => {
    if (!searchTerm) return popularLocations;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return popularLocations.filter(
      loc => loc.city.toLowerCase().includes(lowerSearchTerm) || 
             loc.country.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm]);

  // Simulate a search API call
  const handleSearch = async (term: string) => {
    if (!term || term.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      // In a real app, this would be an API call to a geocoding service
      // For demo purposes, we'll simulate a search with setTimeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter popular locations as "search results"
      const lowerTerm = term.toLowerCase();
      const results = popularLocations.filter(
        loc => loc.city.toLowerCase().includes(lowerTerm) || 
               loc.country.toLowerCase().includes(lowerTerm)
      );
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching locations:', error);
      toast.error('Failed to search locations');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = async (location: { city: string; country: string }) => {
    setSelectedLocation(location);
    setOpen(false);
    
    if (onLocationSelected) {
      onLocationSelected(location);
    }
    
    // Save location to storage
    setIsSaving(true);
    try {
      await saveLocation(location.country, location.city);
      toast.success(`Location set to ${location.city}, ${location.country}`);
    } catch (error) {
      toast.error('Failed to save location');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant={buttonVariant}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedLocation && "text-muted-foreground",
              compact && "px-2 py-1 h-auto text-sm"
            )}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="mr-2 h-4 w-4" />
            )}
            {selectedLocation ? `${selectedLocation.city}, ${selectedLocation.country}` : "Select location"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 bg-slate-900 border-white/10" align="start">
          <Command className="bg-transparent">
            <CommandInput 
              placeholder="Search for a city..." 
              value={searchTerm} 
              onValueChange={(value) => {
                setSearchTerm(value);
                handleSearch(value);
              }}
              className="text-white"
            />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-white/60">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mb-2" />
                    <p>Searching...</p>
                  </div>
                ) : (
                  <p>No results found</p>
                )}
              </CommandEmpty>
              
              <CommandGroup heading="Popular Cities" className="text-white/80">
                {(searchTerm ? searchResults : filteredLocations).map((location) => (
                  <CommandItem
                    key={`${location.city}-${location.country}`}
                    value={`${location.city}-${location.country}`}
                    onSelect={() => handleLocationSelect(location)}
                    className="flex items-center text-white hover:bg-white/10"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-purple-400" />
                    <span>{location.city}, {location.country}</span>
                    
                    {selectedLocation?.city === location.city && 
                     selectedLocation?.country === location.country && (
                      <Check className="ml-auto h-4 w-4 text-green-500" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationSelector;
