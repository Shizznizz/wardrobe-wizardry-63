import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import WeatherWidget from '@/components/WeatherWidget';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WeatherInfo, Outfit } from '@/lib/types';
import { sampleClothingItems, sampleOutfits } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { RefreshCw, Camera, MapPin, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Comprehensive list of countries with their codes
const countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CV", name: "Cabo Verde" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo (Democratic Republic)" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "GD", name: "Grenada" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "Korea (North)" },
  { code: "KR", name: "Korea (South)" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "MK", name: "North Macedonia" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VA", name: "Vatican City" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" }
];

// City data structure - will be filtered based on country selection
const citiesByCountry = {
  US: [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
    "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"
  ],
  GB: [
    "London", "Birmingham", "Manchester", "Glasgow", "Liverpool",
    "Bristol", "Sheffield", "Leeds", "Edinburgh", "Leicester"
  ],
  DE: [
    "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt",
    "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen"
  ],
  FR: [
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice",
    "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"
  ],
  IT: [
    "Rome", "Milan", "Naples", "Turin", "Palermo",
    "Genoa", "Bologna", "Florence", "Bari", "Catania"
  ],
  ES: [
    "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza",
    "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao"
  ],
  CA: [
    "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton",
    "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener"
  ],
  AU: [
    "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide",
    "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Hobart"
  ],
  JP: [
    "Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo",
    "Fukuoka", "Kawasaki", "Kobe", "Kyoto", "Saitama"
  ],
  CN: [
    "Shanghai", "Beijing", "Guangzhou", "Shenzhen", "Chongqing",
    "Tianjin", "Wuhan", "Chengdu", "Nanjing", "Xi'an"
  ],
  IN: [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Ahmedabad", "Pune", "Surat", "Jaipur"
  ],
  BR: [
    "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza",
    "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre"
  ],
  NL: [
    "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven",
    "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen"
  ],
  // Add more cities for each country
};

type FormValues = {
  country: string;
  city: string;
};

const Outfits = () => {
  const [outfits, setOutfits] = useState<Outfit[]>(sampleOutfits);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [suggestedOutfit, setSuggestedOutfit] = useState<Outfit>(sampleOutfits[0]);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ city?: string; country?: string }>({});
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      country: "",
      city: ""
    }
  });

  const selectedCountry = form.watch("country");
  
  // Update available cities when country changes
  useEffect(() => {
    if (selectedCountry) {
      setAvailableCities(citiesByCountry[selectedCountry as keyof typeof citiesByCountry] || []);
      form.setValue("city", ""); // Reset city when country changes
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, form]);

  useEffect(() => {
    // Set initial loading state
    setIsWeatherLoading(true);
  }, []);
  
  const handleWeatherChange = (weatherData: WeatherInfo) => {
    setWeather(weatherData);
    setIsWeatherLoading(false);
    console.log("Weather data processed:", weatherData);
  };
  
  const handleWearOutfit = (outfitId: string) => {
    setOutfits(prev => 
      prev.map(outfit => 
        outfit.id === outfitId 
          ? { 
              ...outfit, 
              timesWorn: outfit.timesWorn + 1,
              lastWorn: new Date()
            } 
          : outfit
      )
    );
  };
  
  const handleRegenerateOutfit = () => {
    const currentIndex = outfits.findIndex(o => o.id === suggestedOutfit.id);
    const nextIndex = (currentIndex + 1) % outfits.length;
    setSuggestedOutfit(outfits[nextIndex]);
    
    toast.success('Generated a new outfit suggestion', {
      description: 'Based on the current weather and your preferences.'
    });
  };
  
  const handleLikeOutfit = () => {
    toast.success('We\'ll suggest more outfits like this!');
  };
  
  const handleDislikeOutfit = () => {
    toast.success('We\'ll suggest fewer outfits like this.');
    handleRegenerateOutfit();
  };
  
  const handleToggleFavorite = (outfitId: string) => {
    setOutfits(prev => 
      prev.map(outfit => 
        outfit.id === outfitId 
          ? { ...outfit, favorite: !outfit.favorite } 
          : outfit
      )
    );
    
    const outfit = outfits.find(outfit => outfit.id === outfitId);
    if (outfit) {
      const action = !outfit.favorite ? 'added to' : 'removed from';
      toast.success(`"${outfit.name}" outfit ${action} favorites`);
    }
  };

  const onSubmit = (data: FormValues) => {
    if (data.country && data.city) {
      const countryName = countries.find(c => c.code === data.country)?.name || data.country;
      const location = `${data.city}, ${countryName}`;
      
      setSelectedLocation({
        city: data.city,
        country: data.country
      });
      
      setIsWeatherLoading(true);
      setShowLocationAlert(false);
      
      toast.success(`Weather location updated to ${location}`, {
        description: 'Fetching current weather data for this location'
      });
    } else {
      setShowLocationAlert(true);
      toast.error("Please select both a country and a city");
    }
  };
  
  const getWeatherRecommendation = () => {
    if (!weather) return "";
    
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();
    
    if (temp < 10) return "It's quite cold today, so layer up with warm clothing.";
    if (temp < 15 && temp >= 10) return "It's cool today, consider a light jacket or sweater.";
    if (temp < 25 && temp >= 15) {
      if (condition.includes('rain')) return "Mild temperatures with rain expected, don't forget a waterproof layer.";
      return "Pleasant temperatures today, perfect for a light outfit.";
    }
    if (temp >= 25) {
      if (condition.includes('rain')) return "Warm but rainy - light clothes but keep an umbrella handy.";
      return "It's warm today, opt for light, breathable fabrics.";
    }
    
    return "Choose an outfit appropriate for the current weather conditions.";
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header weather={weather || undefined} />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Let us help you start the day as good as possible</h1>
              <p className="text-lg text-muted-foreground mb-6">
                And that is by choosing the right outfit for today's weather!
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 items-start mb-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Today's Weather</h2>
                
                {showLocationAlert && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Missing Location Information</AlertTitle>
                    <AlertDescription>
                      Please select both a country and a city to get weather data.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                              disabled={!selectedCountry}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={selectedCountry ? "Select city" : "Select country first"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableCities.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                      disabled={!selectedCountry || !form.watch("city")}
                    >
                      <MapPin className="h-4 w-4" />
                      Update Location
                    </Button>
                  </form>
                </Form>
                
                <WeatherWidget
                  className="w-full" 
                  onWeatherChange={handleWeatherChange}
                  city={selectedLocation.city}
                  country={selectedLocation.country}
                />
                
                {!isWeatherLoading && weather && (
                  <div className="bg-accent/20 p-4 rounded-lg border">
                    <p className="font-medium">{getWeatherRecommendation()}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Today's Suggestion</h2>
                {isWeatherLoading ? (
                  <div className="border rounded-lg p-6 bg-white shadow-soft">
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                      <Skeleton className="aspect-square rounded-md" />
                      <Skeleton className="aspect-square rounded-md" />
                      <Skeleton className="aspect-square rounded-md hidden sm:block" />
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </div>
                ) : (
                  <OutfitSuggestion
                    outfit={suggestedOutfit}
                    items={sampleClothingItems}
                    weather={weather || undefined}
                    onWear={handleWearOutfit}
                    onRefresh={handleRegenerateOutfit}
                    onLike={handleLikeOutfit}
                    onDislike={handleDislikeOutfit}
                  />
                )}
                
                <div className="flex gap-4 justify-between mt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleRegenerateOutfit}
                    className="flex items-center space-x-2"
                    disabled={isWeatherLoading}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Generate Another</span>
                  </Button>
                  
                  <Button
                    variant="default"
                    className="flex items-center space-x-2"
                    disabled={isWeatherLoading}
                    asChild
                  >
                    <Link to="/try-on">
                      <Camera className="h-4 w-4" />
                      <span>Try It On</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
          
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-3xl font-bold">My Outfits</h2>
            
            {outfits.length === 0 ? (
              <div className="flex flex-col items-center justify-center border rounded-lg p-10 space-y-4 bg-gray-50">
                <p className="text-muted-foreground text-center">
                  You haven't created any outfits yet.
                </p>
                <Button>Create Your First Outfit</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {outfits.map(outfit => (
                  <div key={outfit.id} className="border rounded-lg overflow-hidden bg-white shadow-soft hover:shadow-hover transition-all">
                    <div className="p-4">
                      <h3 className="text-xl font-medium">{outfit.name}</h3>
                      <div className="flex mt-1 space-x-2">
                        {outfit.seasons.map(season => (
                          <span key={season} className="text-xs py-0.5 px-2 bg-secondary rounded-full capitalize">
                            {season}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {outfit.items.slice(0, 3).map(itemId => {
                          const item = sampleClothingItems.find(i => i.id === itemId);
                          return item ? (
                            <div key={item.id} className="aspect-square rounded-md overflow-hidden border">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : null;
                        })}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-muted-foreground">
                          Worn {outfit.timesWorn} times
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleFavorite(outfit.id)}
                          className={outfit.favorite ? "text-red-500" : ""}
                        >
                          {outfit.favorite ? "Favorited" : "Add to Favorites"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default Outfits;
