
import { useState, useEffect } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocationSelectorProps {
  onLocationChange: (city: string, country: string) => void;
  initialCity?: string;
  initialCountry?: string;
}

// Common countries for initial selection
const popularCountries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'JP', name: 'Japan' },
];

// Some cities for each country
const citiesByCountry: Record<string, string[]> = {
  'US': ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco'],
  'GB': ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Liverpool'],
  'CA': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
  'AU': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  'FR': ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice'],
  'DE': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
  'IT': ['Rome', 'Milan', 'Florence', 'Venice', 'Naples'],
  'ES': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Malaga'],
  'NL': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
  'JP': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'],
};

const LocationSelector = ({ onLocationChange, initialCity, initialCountry }: LocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry || '');
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || '');
  const [customCity, setCustomCity] = useState<string>('');
  const [useCustomCity, setUseCustomCity] = useState<boolean>(false);

  useEffect(() => {
    if (selectedCountry && (selectedCity || (useCustomCity && customCity))) {
      const city = useCustomCity ? customCity : selectedCity;
      onLocationChange(city, selectedCountry);
    }
  }, [selectedCountry, selectedCity, customCity, useCustomCity, onLocationChange]);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedCity(''); // Reset city when country changes
    setUseCustomCity(false);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setUseCustomCity(false);
  };

  const handleCustomCitySubmit = () => {
    if (customCity && selectedCountry) {
      setUseCustomCity(true);
    }
  };

  return (
    <div className="space-y-3 bg-white/5 border border-white/10 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <Globe className="mr-2 h-5 w-5 text-sky-400" />
        Your Location
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="country-select" className="text-sm text-white/70">Country</label>
          <Select value={selectedCountry} onValueChange={handleCountryChange}>
            <SelectTrigger id="country-select" className="bg-slate-800/60 border-white/10 text-white">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              {popularCountries.map((country) => (
                <SelectItem key={country.code} value={country.code} className="hover:bg-purple-600/20">
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="city-select" className="text-sm text-white/70">City</label>
          {selectedCountry && citiesByCountry[selectedCountry]?.length > 0 ? (
            <Select value={selectedCity} onValueChange={handleCityChange} disabled={!selectedCountry}>
              <SelectTrigger id="city-select" className="bg-slate-800/60 border-white/10 text-white">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                {citiesByCountry[selectedCountry]?.map((city) => (
                  <SelectItem key={city} value={city} className="hover:bg-purple-600/20">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                id="custom-city"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="Enter city name"
                className="bg-slate-800/60 border-white/10 text-white placeholder:text-white/50"
                disabled={!selectedCountry}
              />
              <Button 
                type="button"
                size="sm"
                onClick={handleCustomCitySubmit}
                disabled={!selectedCountry || !customCity}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
