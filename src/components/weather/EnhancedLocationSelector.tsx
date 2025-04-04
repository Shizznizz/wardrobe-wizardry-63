
import { useState, useEffect, useRef } from 'react';
import { countries } from '@/data/countries';
import { Globe, MapPin, CheckCircle, X, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { 
  getCitiesByCountry, 
  getCurrentLocation, 
  getCountryName,
  validateLocation
} from '@/services/LocationService';

interface EnhancedLocationSelectorProps {
  onLocationChange: (city: string, country: string) => void;
  initialCity?: string;
  initialCountry?: string;
}

const EnhancedLocationSelector = ({ 
  onLocationChange, 
  initialCity, 
  initialCountry 
}: EnhancedLocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry || '');
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || '');
  const [citySearchQuery, setCitySearchQuery] = useState<string>('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [isCityPopoverOpen, setCityPopoverOpen] = useState<boolean>(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { savedLocation, saveLocation } = useLocationStorage();

  // When savedLocation changes, update the form
  useEffect(() => {
    if (savedLocation && !selectedCountry && !selectedCity) {
      setSelectedCountry(savedLocation.country);
      setSelectedCity(savedLocation.city);
    }
  }, [savedLocation]);

  // When initialCity or initialCountry change, update the form
  useEffect(() => {
    if (initialCountry) setSelectedCountry(initialCountry);
    if (initialCity) setSelectedCity(initialCity);
  }, [initialCity, initialCountry]);

  // When selectedCountry changes, update the city list
  useEffect(() => {
    if (selectedCountry) {
      const cities = getCitiesByCountry(selectedCountry, citySearchQuery);
      setFilteredCities(cities);
    } else {
      setFilteredCities([]);
    }
  }, [selectedCountry, citySearchQuery]);

  // When selectedCountry or selectedCity change, notify parent
  useEffect(() => {
    if (selectedCountry) {
      // Validate the location
      const validation = validateLocation(selectedCountry, selectedCity);
      setValidationMessage(validation.message || null);

      if (validation.isValid) {
        onLocationChange(selectedCity, selectedCountry);
      }
    }
  }, [selectedCountry, selectedCity, onLocationChange]);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedCity(''); // Reset city when country changes
    setCitySearchQuery(''); // Reset search query
    
    // Focus the city input after selecting a country
    setTimeout(() => {
      if (cityInputRef.current) {
        cityInputRef.current.focus();
        setCityPopoverOpen(true);
      }
    }, 100);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCityPopoverOpen(false);
  };

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCitySearchQuery(query);
    setSelectedCity(query);
  };

  const clearSelection = () => {
    setSelectedCountry('');
    setSelectedCity('');
    setCitySearchQuery('');
    setLocationError(null);
    setValidationMessage(null);
  };

  const handleDetectLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    try {
      const location = await getCurrentLocation();
      
      if (location && location.country) {
        setSelectedCountry(location.country);
        setSelectedCity(location.city || '');
        toast.success(`Location detected: ${location.city}, ${getCountryName(location.country)}`);
      } else {
        setLocationError('Could not determine your location. Please select manually.');
        toast.error('Location detection failed');
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      setLocationError('Could not access your location. Please enable location services and try again.');
      toast.error('Location detection failed');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSaveLocationPreference = async () => {
    if (!selectedCountry) {
      toast.error('Please select a country first');
      return;
    }

    const validation = validateLocation(selectedCountry, selectedCity);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const success = await saveLocation(selectedCountry, selectedCity);
    if (success) {
      toast.success('Location saved as your preference');
    }
  };

  const showSavedLocationMessage = savedLocation && 
    selectedCountry === savedLocation.country && 
    selectedCity === savedLocation.city;

  return (
    <div className="space-y-4 bg-slate-800/30 border border-purple-500/20 rounded-lg p-4 backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-sky-400" />
          <h3 className="text-lg font-medium">Your Location</h3>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDetectLocation}
          className="border-purple-500/30 bg-slate-800/60 text-white hover:bg-purple-600/30"
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4 mr-1" />
          )}
          {isMobile ? 'Detect' : 'Detect My Location'}
        </Button>
      </div>

      {locationError && (
        <div className="text-orange-400 text-sm bg-orange-500/10 p-2 rounded border border-orange-500/20 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {showSavedLocationMessage && (
        <div className="text-green-300 text-sm bg-green-500/10 p-2 rounded border border-green-500/20 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Using your saved location preference</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5 relative">
          <label htmlFor="country-select" className="text-sm text-white/70">Country</label>
          <Select value={selectedCountry} onValueChange={handleCountryChange}>
            <SelectTrigger 
              id="country-select" 
              className="bg-slate-800/60 border-white/10 text-white"
            >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent 
              className="bg-slate-900 border-white/10 text-white max-h-[300px]"
              position="popper"
              sideOffset={5}
            >
              {countries.map((country) => (
                <SelectItem 
                  key={country.code} 
                  value={country.code} 
                  className="hover:bg-purple-600/20"
                >
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 relative">
          <label htmlFor="city-select" className="text-sm text-white/70">City (Optional)</label>
          <Popover open={isCityPopoverOpen} onOpenChange={setCityPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="relative flex">
                <Input
                  id="city-select"
                  ref={cityInputRef}
                  value={selectedCity}
                  onChange={handleCityInputChange}
                  onFocus={() => selectedCountry && setCityPopoverOpen(true)}
                  placeholder={selectedCountry ? "Search or enter city name" : "Select a country first"}
                  className="bg-slate-800/60 border-white/10 text-white pr-8"
                  disabled={!selectedCountry}
                />
                {selectedCity && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-white hover:bg-transparent"
                    onClick={() => {
                      setSelectedCity('');
                      setCitySearchQuery('');
                      cityInputRef.current?.focus();
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </PopoverTrigger>
            {selectedCountry && (
              <PopoverContent 
                className="p-0 bg-slate-900 border border-purple-500/30 text-white w-[300px]"
                align="start"
              >
                <Command className="bg-transparent">
                  <CommandInput 
                    placeholder="Search cities..." 
                    className="border-b border-purple-500/20 text-white placeholder:text-slate-400 bg-transparent"
                    value={citySearchQuery}
                    onValueChange={setCitySearchQuery}
                  />
                  <CommandList className="max-h-[200px] overflow-y-auto">
                    <CommandEmpty className="py-2 px-4 text-slate-400 text-sm">
                      {citySearchQuery.length > 0 
                        ? `No cities found matching "${citySearchQuery}"`
                        : `No cities found for ${getCountryName(selectedCountry)}`
                      }
                    </CommandEmpty>
                    <CommandGroup heading={`Cities in ${getCountryName(selectedCountry)}`}>
                      {filteredCities.map((city) => (
                        <CommandItem
                          key={city}
                          value={city}
                          onSelect={handleCitySelect}
                          className="py-2 hover:bg-purple-600/20 text-white cursor-pointer"
                        >
                          {city}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            )}
          </Popover>

          {validationMessage && (
            <p className="text-yellow-400 text-xs mt-1">
              <AlertCircle className="inline h-3 w-3 mr-1" />
              {validationMessage}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearSelection}
          className="text-slate-400 hover:text-white hover:bg-slate-700/50"
        >
          <X className="h-4 w-4 mr-1" />
          {isMobile ? 'Clear' : 'Clear Selection'}
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={handleSaveLocationPreference}
          className="bg-purple-600 hover:bg-purple-700"
          disabled={!selectedCountry || 
            (showSavedLocationMessage && selectedCountry === savedLocation?.country && selectedCity === savedLocation?.city)}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          {isMobile ? 'Save' : 'Save as Preference'}
        </Button>
      </div>
    </div>
  );
};

export default EnhancedLocationSelector;
