
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import WeatherWidget from '@/components/WeatherWidget';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import OliviaBloomAdvisor from '@/components/OliviaBloomAdvisor';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { WeatherInfo, Outfit, TimeOfDay, Activity } from '@/lib/types';
import { sampleClothingItems, sampleOutfits, sampleUserPreferences } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { RefreshCw, Camera, MapPin, AlertTriangle, Calendar, AlarmClockCheck, MessageCircle, Sun, CloudRain, CloudSun, Cloud } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';
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
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "PT", name: "Portugal" },
  { code: "IE", name: "Ireland" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "ZA", name: "South Africa" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" }
];

const citiesByCountry = {
  US: [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
    "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", 
    "Fort Worth", "Columbus", "Charlotte", "Indianapolis", "San Francisco", 
    "Seattle", "Denver", "Washington DC", "Boston", "El Paso", "Nashville", 
    "Detroit", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", 
    "Milwaukee"
  ],
  GB: [
    "London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Bristol", 
    "Sheffield", "Leeds", "Edinburgh", "Leicester", "Cardiff", "Belfast", 
    "Nottingham", "Newcastle", "Southampton", "Aberdeen", "Oxford", "Cambridge", 
    "York", "Portsmouth", "Coventry", "Bradford", "Swansea", "Plymouth", 
    "Reading", "Derby", "Wolverhampton", "Exeter", "Middlesbrough", "Milton Keynes"
  ],
  DE: [
    "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", 
    "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden", 
    "Hannover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", 
    "Bonn", "Münster", "Karlsruhe", "Mannheim", "Augsburg", "Wiesbaden", 
    "Gelsenkirchen", "Aachen", "Kiel", "Freiburg", "Heidelberg", "Magdeburg"
  ],
  FR: [
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", 
    "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", 
    "Saint-Étienne", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", 
    "Villeurbanne", "Le Mans", "Aix-en-Provence", "Clermont-Ferrand", "Brest", 
    "Tours", "Limoges", "Amiens", "Annecy", "Perpignan", "Besançon"
  ],
  IT: [
    "Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", 
    "Florence", "Bari", "Catania", "Venice", "Verona", "Messina", "Padua", 
    "Trieste", "Brescia", "Parma", "Taranto", "Prato", "Modena", "Reggio Calabria", 
    "Reggio Emilia", "Perugia", "Livorno", "Ravenna", "Cagliari", "Foggia", 
    "Rimini", "Salerno", "Ferrara"
  ],
  ES: [
    "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", 
    "Murcia", "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", 
    "Valladolid", "Vigo", "Gijón", "L'Hospitalet", "La Coruña", "Granada", 
    "Vitoria", "Elche", "Oviedo", "Badalona", "Cartagena", "Terrassa", 
    "Jerez de la Frontera", "Sabadell", "Móstoles", "Santa Cruz de Tenerife", 
    "Pamplona", "Almería"
  ],
  CA: [
    "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", 
    "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria", 
    "Halifax", "Oshawa", "Windsor", "Saskatoon", "Regina", "St. Catharines", 
    "St. John's", "Barrie", "Kelowna", "Abbotsford", "Sudbury", "Kingston", 
    "Saguenay", "Trois-Rivières", "Guelph", "Moncton", "Brantford", "Thunder Bay"
  ],
  AU: [
    "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", 
    "Canberra", "Newcastle", "Wollongong", "Hobart", "Geelong", "Townsville", 
    "Cairns", "Darwin", "Toowoomba", "Ballarat", "Bendigo", "Launceston", 
    "Mackay", "Rockhampton", "Bunbury", "Bundaberg", "Hervey Bay", "Wagga Wagga", 
    "Coffs Harbour", "Gladstone", "Mildura", "Shepparton", "Albury", "Port Macquarie"
  ],
  JP: [
    "Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kawasaki", 
    "Kobe", "Kyoto", "Saitama", "Hiroshima", "Sendai", "Kitakyushu", "Chiba", 
    "Sakai", "Kumamoto", "Okayama", "Shizuoka", "Hamamatsu", "Sagamihara", 
    "Niigata", "Himeji", "Matsudo", "Nishinomiya", "Kurashiki", "Ichikawa", 
    "Fukuyama", "Fujisawa", "Amagasaki", "Utsunomiya"
  ],
  CN: [
    "Shanghai", "Beijing", "Guangzhou", "Shenzhen", "Chongqing", "Tianjin", 
    "Wuhan", "Chengdu", "Nanjing", "Xi'an", "Hangzhou", "Shenyang", "Harbin", 
    "Jinan", "Qingdao", "Dalian", "Changchun", "Fuzhou", "Zhengzhou", "Kunming", 
    "Changsha", "Xiamen", "Nanchang", "Hefei", "Urumqi", "Guiyang", "Nanning", 
    "Taiyuan", "Lanzhou", "Xining"
  ],
  IN: [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", 
    "Ahmedabad", "Pune", "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", 
    "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", 
    "Patna", "Vadodara", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", 
    "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar"
  ],
  BR: [
    "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", 
    "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre", "Belém", 
    "Goiânia", "Guarulhos", "Campinas", "São Luís", "São Gonçalo", "Maceió", 
    "Duque de Caxias", "Natal", "Teresina", "São Bernardo do Campo", "Campo Grande", 
    "Osasco", "João Pessoa", "Jaboatão dos Guararapes", "Santo André", "São José dos Campos", 
    "Ribeirão Preto", "Uberlândia", "Sorocaba"
  ],
  NL: [
    "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", 
    "Groningen", "Almere", "Breda", "Nijmegen", "Enschede", "Haarlem", 
    "Arnhem", "Zaanstad", "Amersfoort", "Apeldoorn", "Hertogenbosch", 
    "Hoofddorp", "Maastricht", "Leiden", "Dordrecht", "Zoetermeer", "Zwolle", 
    "Delft", "Alkmaar", "Heerlen", "Venlo", "Leeuwarden", "Deventer", "Sittard"
  ],
  BE: [
    "Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", "Namur", 
    "Leuven", "Mons", "Aalst", "Mechelen", "Kortrijk", "Hasselt", "Ostend", 
    "Genk", "Sint-Niklaas", "Turnhout", "Roeselare", "Seraing", "La Louvière", 
    "Verviers", "Mouscron", "Herstal", "Dendermonde", "Beringen", "Wevelgem", 
    "Geel", "Tournai", "Tongeren", "Lokeren"
  ],
  SE: [
    "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", 
    "Linköping", "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå", 
    "Gävle", "Borås", "Södertälje", "Eskilstuna", "Karlstad", "Täby", 
    "Växjö", "Halmstad", "Sundsvall", "Luleå", "Trollhättan", "Östersund", 
    "Solna", "Borlänge", "Kristianstad", "Kalmar", "Skövde", "Karlskrona"
  ],
  NO: [
    "Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Fredrikstad", 
    "Kristiansand", "Sandnes", "Tromsø", "Sarpsborg", "Bodø", "Sandefjord", 
    "Ålesund", "Tønsberg", "Moss", "Haugesund", "Skien", "Arendal", "Hamar", 
    "Larvik", "Halden", "Lillehammer", "Molde", "Harstad", "Kongsberg", 
    "Gjøvik", "Steinkjer", "Narvik", "Kristiansund", "Rana"
  ],
  DK: [
    "Copenhagen", "Aarhus", "Odense", "Aalborg", "Frederiksberg", "Esbjerg", 
    "Randers", "Kolding", "Horsens", "Vejle", "Roskilde", "Herning", 
    "Silkeborg", "Næstved", "Fredericia", "Viborg", "Køge", "Holstebro", 
    "Slagelse", "Helsingør", "Hillerød", "Sønderborg", "Svendborg", "Holbæk", 
    "Hjørring", "Haderslev", "Frederikshavn", "Skive", "Ringsted", "Nyborg"
  ],
  FI: [
    "Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä", 
    "Lahti", "Kuopio", "Pori", "Kouvola", "Joensuu", "Lappeenranta", "Hämeenlinna", 
    "Vaasa", "Rovaniemi", "Seinäjoki", "Mikkeli", "Kotka", "Salo", 
    "Porvoo", "Kokkola", "Hyvinkää", "Lohja", "Järvenpää", "Rauma", 
    "Kajaani", "Tuusula", "Kirkkonummi", "Kerava"
  ],
  CH: [
    "Zurich", "Geneva", "Basel", "Lausanne", "Bern", "Winterthur", "Lucerne", 
    "St. Gallen", "Lugano", "Biel", "Thun", "Köniz", "La Chaux-de-Fonds", "Fribourg", 
    "Schaffhausen", "Chur", "Vernier", "Neuchâtel", "Uster", "Sion", 
    "Lancy", "Emmen", "Yverdon-les-Bains", "Zug", "Kriens", "Rapperswil-Jona", 
    "Dübendorf", "Montreux", "Dietikon", "Frauenfeld"
  ],
  AT: [
    "Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", "Villach", 
    "Wels", "Sankt Pölten", "Dornbirn", "Wiener Neustadt", "Steyr", "Feldkirch", 
    "Bregenz", "Leonding", "Klosterneuburg", "Baden", "Wolfsberg", "Leoben", 
    "Krems", "Traun", "Amstetten", "Lustenau", "Kapfenberg", "Mödling", 
    "Hallein", "Kufstein", "Traiskirchen", "Schwechat", "Braunau am Inn"
  ],
  PT: [
    "Lisbon", "Porto", "Amadora", "Braga", "Coimbra", "Funchal", "Setúbal", 
    "Vila Nova de Gaia", "Almada", "Agualva-Cacém", "Queluz", "Aveiro", "Évora", 
    "Faro", "Guimarães", "Leiria", "Odivelas", "Rio Tinto", "Viseu", "Barreiro", 
    "Tomar", "Matosinhos", "Santarém", "Póvoa de Varzim", "Vila Real", 
    "Viana do Castelo", "Portimão", "Bragança", "Caldas da Rainha", "Penafiel"
  ],
  IE: [
    "Dublin", "Cork", "Limerick", "Galway", "Waterford", "Drogheda", "Dundalk", 
    "Swords", "Bray", "Navan", "Ennis", "Kilkenny", "Carlow", "Tralee", 
    "Newbridge", "Portlaoise", "Mullingar", "Wexford", "Letterkenny", "Sligo", 
    "Athlone", "Celbridge", "Clonmel", "Tullamore", "Athenry", "Naas", 
    "Maynooth", "Killarney", "Arklow", "Cobh"
  ],
  NZ: [
    "Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Napier-Hastings", 
    "Dunedin", "Palmerston North", "Nelson", "Rotorua", "New Plymouth", "Whangarei", 
    "Invercargill", "Whanganui", "Gisborne", "Blenheim", "Pukekohe", "Timaru", 
    "Taupo", "Masterton", "Levin", "Ashburton", "Cambridge", "Queenstown", 
    "Kapiti", "Porirua", "Upper Hutt", "Oamaru", "Tokoroa", "Fielding"
  ],
  SG: [
    "Singapore City", "Woodlands", "Jurong West", "Tampines", "Hougang", "Sengkang", 
    "Yishun", "Ang Mo Kio", "Bedok", "Bukit Merah", "Choa Chu Kang", "Punggol", 
    "Toa Payoh", "Bukit Batok", "Geylang", "Serangoon", "Pasir Ris", "Kallang", 
    "Clementi", "Bukit Panjang", "Queenstown", "Bishan", "Marine Parade", "Jurong East", 
    "Bukit Timah", "Novena", "Whampoa", "Telok Blangah", "Sembawang", "Outram"
  ],
  AE: [
    "Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", 
    "Fujairah", "Umm Al Quwain", "Khor Fakkan", "Dibba Al-Hisn", "Dibba Al-Fujairah", 
    "Hatta", "Madinat Zayed", "Ruwais", "Liwa Oasis", "Jebel Ali", "Ghayathi", 
    "Dhaid", "Ar-Rams", "Masafi", "Khorfakkan", "Sweihan", "Delma", "Sha'am", 
    "Kalba", "Masfoot", "Al Mirfa", "Al Hayer", "Al Shuwaib", "Al Yahar"
  ],
  ZA: [
    "Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", 
    "Nelspruit", "Kimberley", "Polokwane", "Rustenburg", "East London", "Pietermaritzburg", 
    "Vereeniging", "Vanderbijlpark", "Centurion", "Potchefstroom", "Newcastle", 
    "Kroonstad", "Witbank", "Midrand", "Middelburg", "Welkom", "Klerksdorp", 
    "George", "Paarl", "Springs", "King Williams Town", "Grahamstown", "Worcester", "Upington"
  ],
  MX: [
    "Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", 
    "Juárez", "Torreón", "Querétaro", "Mérida", "Cancún", "Chihuahua", "Acapulco", 
    "San Luis Potosí", "Aguascalientes", "Morelia", "Veracruz", "Culiacán", 
    "Hermosillo", "Saltillo", "Mexicali", "Cuernavaca", "Tampico", "Toluca", 
    "Ciudad Guzmán", "Tuxtla Gutiérrez", "Mazatlán", "Reynosa", "Oaxaca", "Villahermosa"
  ],
  AR: [
    "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "San Miguel de Tucumán", 
    "La Plata", "Mar del Plata", "Salta", "Santa Fe", "San Juan", "Resistencia", 
    "Santiago del Estero", "Corrientes", "Neuquén", "Posadas", "San Salvador de Jujuy", 
    "Bahía Blanca", "Paraná", "Formosa", "Río Cuarto", "Comodoro Rivadavia", 
    "San Luis", "La Rioja", "Concordia", "San Nicolás de los Arroyos", 
    "San Rafael", "Santa Rosa", "Tandil", "Villa María", "Río Gallegos"
  ],
  CL: [
    "Santiago", "Valparaíso", "Concepción", "Antofagasta", "Viña del Mar", 
    "Temuco", "Rancagua", "Talca", "Arica", "Chillán", "Los Ángeles", "Puerto Montt", 
    "Iquique", "Coquimbo", "Osorno", "La Serena", "Calama", "Valdivia", 
    "Punta Arenas", "Copiapó", "Curicó", "Ovalle", "Quilpué", "San Antonio", 
    "Linares", "Los Andes", "Melipilla", "San Felipe", "Angol", "Constitución"
  ],
  CO: [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", 
    "Bucaramanga", "Pereira", "Santa Marta", "Ibagué", "Pasto", "Manizales", 
    "Neiva", "Soledad", "Villavicencio", "Armenia", "Soacha", "Valledupar", 
    "Montería", "Sincelejo", "Popayán", "Floridablanca", "Palmira", "Buenaventura", 
    "Barrancabermeja", "Tuluá", "Dosquebradas", "Envigado", "Tunja", "Cartago"
  ]
};

type FormValues = {
  country: string;
  city: string;
};

const Outfits = () => {
  const [outfits, setOutfits] = useState<Outfit[]>(sampleOutfits);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [suggestedOutfit, setSuggestedOutfit] = useState<Outfit>(sampleOutfits[0]);
  const [isWeatherLoading, setIsLoading] = useState(true);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ city?: string; country?: string }>({});
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | undefined>(undefined);
  const [activity, setActivity] = useState<Activity | undefined>(undefined);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const form = useForm<FormValues>({
    defaultValues: {
      country: "",
      city: ""
    }
  });

  const selectedCountry = form.watch("country");
  
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user && !preferencesLoaded) {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('preferred_country, preferred_city')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error loading preferences:', error);
            return;
          }
          
          if (data && data.preferred_country && data.preferred_city) {
            form.setValue('country', data.preferred_country);
            
            const countryCities = citiesByCountry[data.preferred_country as keyof typeof citiesByCountry] || [];
            setAvailableCities(countryCities);
            
            setTimeout(() => {
              form.setValue('city', data.preferred_city);
            }, 0);
            
            setSelectedLocation({
              city: data.preferred_city,
              country: data.preferred_country
            });
            
            console.log('Loaded user preferences:', data);
            toast.success('Loaded your saved location preferences');
          }
          
          setPreferencesLoaded(true);
        } catch (err) {
          console.error('Failed to load user preferences:', err);
        }
      }
    };
    
    loadUserPreferences();
  }, [user, form, preferencesLoaded]);
  
  useEffect(() => {
    if (selectedCountry) {
      const cities = citiesByCountry[selectedCountry as keyof typeof citiesByCountry] || [];
      setAvailableCities(cities);
      
      const currentCity = form.getValues("city");
      if (currentCity && !cities.includes(currentCity)) {
        form.setValue("city", "");
      }
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, form]);

  const handleWeatherChange = (weatherData: WeatherInfo) => {
    setWeather(weatherData);
    setIsLoading(false);
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
    const filteredOutfits = filterOutfitsByPreferences(outfits);
    
    if (filteredOutfits.length === 0) {
      // If no outfits match the filters, use all outfits
      const currentIndex = outfits.findIndex(o => o.id === suggestedOutfit.id);
      const nextIndex = (currentIndex + 1) % outfits.length;
      setSuggestedOutfit(outfits[nextIndex]);
      
      toast.info('No outfits match your current filters', {
        description: 'Showing a general suggestion instead.'
      });
    } else {
      const randomIndex = Math.floor(Math.random() * filteredOutfits.length);
      setSuggestedOutfit(filteredOutfits[randomIndex]);
      
      toast.success('Generated a new outfit suggestion', {
        description: 'Based on your preferences and current filters.'
      });
    }
  };
  
  const handleTimeOfDayChange = (value: TimeOfDay) => {
    setTimeOfDay(value === timeOfDay ? undefined : value);
    
    // After changing the filter, update the outfit suggestion
    setTimeout(() => {
      handleRegenerateOutfit();
    }, 100);
  };
  
  const handleActivityChange = (value: Activity) => {
    setActivity(value === activity ? undefined : value);
    
    // After changing the filter, update the outfit suggestion
    setTimeout(() => {
      handleRegenerateOutfit();
    }, 100);
  };
  
  const filterOutfitsByPreferences = (outfitList: Outfit[]): Outfit[] => {
    let filtered = [...outfitList];
    
    // Filter by activity
    if (activity) {
      filtered = filtered.filter(outfit => {
        // Match exact activity or occasion
        return outfit.occasions.some(occasion => 
          occasion.toLowerCase() === activity.toLowerCase() || 
          (activity === 'work' && ['business', 'formal'].includes(occasion.toLowerCase())) ||
          (activity === 'casual' && ['everyday', 'outdoor'].includes(occasion.toLowerCase())) ||
          (activity === 'sport' && ['sporty', 'outdoor'].includes(occasion.toLowerCase())) ||
          (activity === 'party' && ['special', 'date'].includes(occasion.toLowerCase()))
        );
      });
    }
    
    // Filter by time of day (using tags or other attributes that might indicate suitability)
    if (timeOfDay) {
      filtered = filtered.filter(outfit => {
        // Morning/day outfits usually favor brighter colors and casual wear
        if (timeOfDay === 'morning' || timeOfDay === 'afternoon') {
          return !outfit.occasions.includes('party') && !outfit.occasions.includes('formal');
        }
        
        // Evening/night outfits usually favor darker colors and more formal wear
        if (timeOfDay === 'evening' || timeOfDay === 'night') {
          return outfit.occasions.includes('party') || 
                 outfit.occasions.includes('formal') || 
                 outfit.occasions.includes('date') || 
                 outfit.occasions.includes('special');
        }
        
        return true;
      });
    }
    
    return filtered;
  };
  
  const handleLikeOutfit = () => {
    toast.success('We\'ll suggest more outfits like this!');
  };
  
  const handleDislikeOutfit = () => {
    toast.success('We\'ll suggest fewer outfits like this.');
    handleRegenerateOutfit();
  };
  
  const handleMakeWarmer = () => {
    const warmerOutfits = outfits.filter(outfit => 
      outfit.seasons.includes('autumn') || outfit.seasons.includes('winter')
    );
    
    if (warmerOutfits.length > 0) {
      const randomIndex = Math.floor(Math.random() * warmerOutfits.length);
      setSuggestedOutfit(warmerOutfits[randomIndex]);
      
      toast.success('Found a warmer outfit option', {
        description: 'Added more layers to keep you comfortable.'
      });
    } else {
      toast('No warmer outfits available', {
        description: 'Try adding more cold-weather items to your wardrobe.'
      });
    }
  };
  
  const handleChangeTop = () => {
    if (outfits.length < 2) return;
    
    const currentOutfit = suggestedOutfit;
    
    const topItemId = currentOutfit.items[0];
    
    const differentTopOutfit = outfits.find(o => 
      o.id !== currentOutfit.id && o.items[0] !== topItemId
    );
    
    if (differentTopOutfit) {
      const newOutfit = {
        ...currentOutfit,
        items: [differentTopOutfit.items[0], ...currentOutfit.items.slice(1)],
        name: `${currentOutfit.name} (Modified)`
      };
      
      setSuggestedOutfit(newOutfit);
      
      toast.success('Changed the top item', {
        description: 'Keeping the rest of your outfit the same.'
      });
    } else {
      toast('No alternative tops available', {
        description: 'Try adding more variety to your wardrobe.'
      });
    }
  };
  
  const handleChangeBottom = () => {
    if (outfits.length < 2) return;
    
    const currentOutfit = suggestedOutfit;
    
    const bottomItemId = currentOutfit.items[1];
    
    const differentBottomOutfit = outfits.find(o => 
      o.id !== currentOutfit.id && o.items.length > 1 && o.items[1] !== bottomItemId
    );
    
    if (differentBottomOutfit) {
      const newOutfit = {
        ...currentOutfit,
        items: [currentOutfit.items[0], differentBottomOutfit.items[1], ...currentOutfit.items.slice(2)],
        name: `${currentOutfit.name} (Modified)`
      };
      
      setSuggestedOutfit(newOutfit);
      
      toast.success('Changed the bottom item', {
        description: 'Keeping the rest of your outfit the same.'
      });
    } else {
      toast('No alternative bottoms available', {
        description: 'Try adding more variety to your wardrobe.'
      });
    }
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
      
      setSelectedLocation({
        city: data.city,
        country: data.country
      });
      
      if (user) {
        // Save user preferences to Supabase
        const savePreferences = async () => {
          try {
            const { error } = await supabase
              .from('user_preferences')
              .upsert({
                user_id: user.id,
                preferred_country: data.country,
                preferred_city: data.city,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              });
            
            if (error) {
              console.error('Error saving preferences:', error);
              toast.error('Failed to save your location preferences');
              return;
            }
            
            toast.success('Saved your location preferences');
          } catch (err) {
            console.error('Failed to save user preferences:', err);
            toast.error('Something went wrong');
          }
        };
        
        savePreferences();
      }
      
      setShowLocationAlert(false);
    } else {
      setShowLocationAlert(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="container px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="w-full py-6 md:py-8 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md text-white">
          <div className="container max-w-6xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center">Your Perfect Outfit Awaits</h1>
            <p className="text-lg text-center mt-2 text-white/80">Dress confidently with personalized style recommendations for any occasion</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Weather Widget */}
          <div className="h-full">
            <h2 className="text-xl font-bold mb-3">Current Weather</h2>
            <WeatherWidget onWeatherChange={handleWeatherChange} 
                           selectedLocation={selectedLocation} 
                           showError={false} />
          </div>
          
          {/* Olivia's Advice */}
          <div className="h-full">
            <h2 className="text-xl font-bold mb-3">Olivia's Style Advice</h2>
            <div className="rounded-xl border shadow-sm bg-gradient-to-br from-pink-50 to-purple-50 dark:from-purple-950/20 dark:to-indigo-950/30 p-5 flex flex-col h-[calc(100%-32px)]">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-10 w-10 border-2 border-white/30 shadow-sm">
                  <AvatarImage src="/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png" alt="Olivia" />
                  <AvatarFallback className="bg-purple-600">OB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">Olivia Bloom</p>
                  <p className="text-xs text-muted-foreground">Style Assistant</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="bg-white/60 dark:bg-gray-800/40 rounded-lg p-3 shadow-sm border border-white/40 dark:border-gray-700/40 text-sm">
                  {weather ? (
                    <p>Based on the current weather in {selectedLocation.city || 'your area'} ({weather.temperature}°{weather.temperatureUnit}, {weather.condition}), I've picked an outfit that's both stylish and practical.</p>
                  ) : (
                    <p>I'll help you dress appropriately for the weather once we have your location.</p>
                  )}
                </div>
                
                <div className="bg-white/60 dark:bg-gray-800/40 rounded-lg p-3 shadow-sm border border-white/40 dark:border-gray-700/40 text-sm">
                  <p>Your style preferences show you enjoy {sampleUserPreferences.preferredStyles.join(', ')} styles. I've taken this into account for today's recommendation.</p>
                </div>
                
                {suggestedOutfit && (
                  <div className="bg-white/60 dark:bg-gray-800/40 rounded-lg p-3 shadow-sm border border-white/40 dark:border-gray-700/40 text-sm">
                    <p>The "{suggestedOutfit.name}" outfit would be perfect for today. It works well for {suggestedOutfit.occasions.join(', ')} occasions, making it versatile for your day.</p>
                  </div>
                )}
                
                {activity && (
                  <div className="bg-white/60 dark:bg-gray-800/40 rounded-lg p-3 shadow-sm border border-white/40 dark:border-gray-700/40 text-sm">
                    <p>Since you're planning for {activity} activities today, I've selected items that provide the right balance of comfort and style.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Outfit Suggestion - Full Width */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Today's Outfit Suggestion</h2>
          <div className="bg-white dark:bg-gray-950 rounded-xl border shadow-sm p-4 md:p-6">
            <OutfitSuggestion 
              outfit={suggestedOutfit}
              onLike={handleLikeOutfit}
              onDislike={handleDislikeOutfit}
              onWear={() => handleWearOutfit(suggestedOutfit.id)}
              onToggleFavorite={() => handleToggleFavorite(suggestedOutfit.id)}
              onRegenerateOutfit={handleRegenerateOutfit}
              onMakeWarmer={handleMakeWarmer}
              onChangeTop={handleChangeTop}
              onChangeBottom={handleChangeBottom}
              weather={weather}
            />
          </div>
        </div>
        
        {/* Location Settings Form */}
        <div className="mt-8 bg-muted/50 rounded-xl border p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">Location Settings</h2>
          
          {showLocationAlert && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Missing Location</AlertTitle>
              <AlertDescription>
                Please select both a country and city to get accurate weather and outfit recommendations.
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
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
                        defaultValue={field.value}
                        value={field.value}
                        disabled={!selectedCountry}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedCountry ? "Select a city" : "Select a country first"} />
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
              
              <Button type="submit" className="w-full sm:w-auto">
                <MapPin className="mr-2 h-4 w-4" />
                Update Location
              </Button>
            </form>
          </Form>
        </div>
        
        {/* Activity and Time Filters */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Outfit Filters</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-3">Time of Day</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={timeOfDay === 'morning' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeOfDayChange('morning')}
                  className="flex items-center"
                >
                  <Sun className="mr-1 h-4 w-4" />
                  Morning
                </Button>
                <Button
                  variant={timeOfDay === 'afternoon' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeOfDayChange('afternoon')}
                  className="flex items-center"
                >
                  <CloudSun className="mr-1 h-4 w-4" />
                  Afternoon
                </Button>
                <Button
                  variant={timeOfDay === 'evening' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeOfDayChange('evening')}
                  className="flex items-center"
                >
                  <Cloud className="mr-1 h-4 w-4" />
                  Evening
                </Button>
                <Button
                  variant={timeOfDay === 'night' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeOfDayChange('night')}
                  className="flex items-center"
                >
                  <AlarmClockCheck className="mr-1 h-4 w-4" />
                  Night
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Activity</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activity === 'casual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleActivityChange('casual')}
                >
                  Casual
                </Button>
                <Button
                  variant={activity === 'work' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleActivityChange('work')}
                >
                  Work
                </Button>
                <Button
                  variant={activity === 'sport' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleActivityChange('sport')}
                >
                  Sport
                </Button>
                <Button
                  variant={activity === 'party' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleActivityChange('party')}
                >
                  Party
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outfits;
