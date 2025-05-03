
import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { toast } from 'sonner';

interface EnhancedLocationSelectorProps {
  onLocationChange: (city: string, country: string) => void;
  initialCity?: string;
  initialCountry?: string;
  className?: string;
}

const EnhancedLocationSelector = ({
  onLocationChange,
  initialCity = '',
  initialCountry = '',
  className
}: EnhancedLocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Array<{city: string, country: string}>>([]);

  useEffect(() => {
    if (initialCity && initialCountry) {
      setDisplayValue(`${initialCity}, ${initialCountry}`);
    }
  }, [initialCity, initialCountry]);

  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setLocations([]);
      return;
    }

    setLoading(true);
    
    // Simulate API call with basic locations
    setTimeout(() => {
      const mockLocations = [
        { city: 'New York', country: 'USA' },
        { city: 'London', country: 'UK' },
        { city: 'Paris', country: 'France' },
        { city: 'Tokyo', country: 'Japan' },
        { city: 'Sydney', country: 'Australia' },
      ].filter(loc => 
        loc.city.toLowerCase().includes(query.toLowerCase()) || 
        loc.country.toLowerCase().includes(query.toLowerCase())
      );
      
      setLocations(mockLocations);
      setLoading(false);
    }, 500);
  };

  const handleSelectLocation = (city: string, country: string) => {
    setDisplayValue(`${city}, ${country}`);
    onLocationChange(city, country);
    setOpen(false);
    toast.success(`Location set to ${city}, ${country}`);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setInputValue('');
      // Reset locations when dialog closes
      setLocations([]);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between space-x-2">
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm border-white/10"
        >
          <MapPin className="mr-2 h-4 w-4 shrink-0" />
          {displayValue || "Select location..."}
        </Button>
      </div>
      
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput 
          placeholder="Search for a city..." 
          value={inputValue}
          onValueChange={(value) => {
            setInputValue(value);
            handleSearch(value);
          }}
        />
        <CommandList>
          {loading ? (
            <CommandEmpty>Loading locations...</CommandEmpty>
          ) : locations.length === 0 ? (
            <CommandEmpty>No locations found.</CommandEmpty>
          ) : (
            <CommandGroup heading="Locations">
              {locations.map((location) => (
                <CommandItem
                  key={`${location.city}-${location.country}`}
                  onSelect={() => handleSelectLocation(location.city, location.country)}
                  className="cursor-pointer"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {location.city}, {location.country}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default EnhancedLocationSelector;
