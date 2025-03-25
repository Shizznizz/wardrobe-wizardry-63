import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import WeatherWidget from '@/components/WeatherWidget';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import StyleTip from '@/components/StyleTip';
import TrendingItems from '@/components/TrendingItems';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { WeatherInfo, Outfit, TimeOfDay, Activity } from '@/lib/types';
import { sampleClothingItems, sampleOutfits, sampleUserPreferences } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { 
  RefreshCw, 
  Camera, 
  MapPin, 
  AlertTriangle, 
  Calendar, 
  AlarmClockCheck, 
  MessageCircle, 
  Sun, 
  CloudRain, 
  CloudSun, 
  Cloud,
  Sparkles,
  Umbrella,
  ThermometerSnowflake,
  ThermometerSun,
  Shirt,
  PanelBottom,
  Heart,
  Shuffle,
  Glasses,
  Crown,
  Layers,
  BadgePlus,
  Scissors
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
import { useLocationPreferences } from '@/hooks/use-location-preferences';

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
  const [outfitVariation, setOutfitVariation] = useState<string | null>(null);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { locationPreferences, saveLocationPreferences } = useLocationPreferences();
  
  const form = useForm<FormValues>({
    defaultValues: {
      country: "",
      city: ""
    }
  });

  const selectedCountry = form.watch("country");
  
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (locationPreferences.country && locationPreferences.city && !preferencesLoaded) {
        form.setValue('country', locationPreferences.country);
        
        const countryCities = citiesByCountry[locationPreferences.country as keyof typeof citiesByCountry] || [];
        setAvailableCities(countryCities);
        
        setTimeout(() => {
          form.setValue('city', locationPreferences.city);
        }, 0);
        
        setSelectedLocation({
          city: locationPreferences.city,
          country: locationPreferences.country
        });
        
        saveLocationPreferences(locationPreferences.country, locationPreferences.city);
        
        setPreferencesLoaded(true);
        console.log('Loaded local location preferences');
        return;
      }
      
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
            
            saveLocationPreferences(data.preferred_country, data.preferred_city);
            
            console.log('Loaded user preferences from database:', data);
            toast.success('Loaded your saved location preferences');
          }
          
          setPreferencesLoaded(true);
        } catch (err) {
          console.error('Failed to load user preferences:', err);
        }
      }
    };
    
    loadUserPreferences();
  }, [user, form, preferencesLoaded, locationPreferences, saveLocationPreferences]);
  
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
    toast.success("Great choice! Outfit has been logged as worn today.", {
      description: "This helps Olivia learn your preferences better."
    });
  };
  
  const handleRegenerateOutfit = () => {
    const filteredOutfits = filterOutfitsByPreferences(outfits);
    
    if (filteredOutfits.length === 0) {
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
    
    setTimeout(() => {
      handleRegenerateOutfit();
    }, 100);
  };
  
  const handleActivityChange = (value: Activity) => {
    setActivity(value === activity ? undefined : value);
    
    setTimeout(() => {
      handleRegenerateOutfit();
    }, 100);
  };
  
  const filterOutfitsByPreferences = (outfitList: Outfit[]): Outfit[] => {
    let filtered = [...outfitList];
    
    if (activity) {
      filtered = filtered.filter(outfit => {
        return outfit.occasions.some(occasion => 
          occasion.toLowerCase() === activity.toLowerCase() || 
          (activity === 'work' && ['business', 'formal'].includes(occasion.toLowerCase())) ||
          (activity === 'casual' && ['everyday', 'outdoor'].includes(occasion.toLowerCase())) ||
          (activity === 'sport' && ['sporty', 'outdoor'].includes(occasion.toLowerCase())) ||
          (activity === 'party' && ['special', 'date'].includes(occasion.toLowerCase()))
        );
      });
    }
    
    if (timeOfDay) {
      filtered = filtered.filter(outfit => {
        if (timeOfDay === 'morning' || timeOfDay === 'afternoon') {
          return !outfit.occasions.includes('party') && !outfit.occasions.includes('formal');
        }
        
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
        country: data.country,
        city: data.city
      });
      
      saveLocationPreferences(data.country, data.city);
      
      setShowLocationAlert(false);
      
      toast.success(`Location updated to ${data.city}, ${countryName}`, {
        description: "Weather data will update with the new location"
      });
    }
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  const getWeatherIcon = () => {
    if (!weather) return <Sun className="text-amber-400 animate-pulse h-6 w-6" />;
    
    const condition = weather.condition.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return <CloudRain className="text-blue-300 h-6 w-6" />;
    }
    
    if (condition.includes('cloud')) {
      return <Cloud className="text-gray-300 h-6 w-6" />;
    }
    
    if (condition.includes('cloud') && condition.includes('sun')) {
      return <CloudSun className="text-amber-300 h-6 w-6" />;
    }
    
    return <Sun className="text-amber-400 h-6 w-6" />;
  };
  
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'there';
  
  const handleMakeEdgier = () => {
    const currentOutfit = suggestedOutfit;
    
    const edgierOutfit = {
      ...currentOutfit,
      name: `${currentOutfit.name} (Edgier)`,
      description: currentOutfit.description || 'Edgy version with darker tones and statement pieces',
      styling: [...(currentOutfit.styling || []), 'edgy']
    };
    
    setSuggestedOutfit(edgierOutfit);
    setOutfitVariation('edgy');
    
    toast.success('Added some edge to your look', {
      description: 'Incorporating darker tones and statement pieces.'
    });
  };
  
  const handleAddAccessories = () => {
    const currentOutfit = suggestedOutfit;
    
    const availableAccessories = sampleClothingItems.filter(
      item => item.type.toLowerCase().includes('accessory') && 
      !currentOutfit.items.includes(item.id)
    );
    
    if (availableAccessories.length > 0) {
      const randomAccessory = availableAccessories[Math.floor(Math.random() * availableAccessories.length)];
      
      const accessorizedOutfit = {
        ...currentOutfit,
        name: `${currentOutfit.name} (Accessorized)`,
        items: [...currentOutfit.items, randomAccessory.id]
      };
      
      setSuggestedOutfit(accessorizedOutfit);
      setOutfitVariation('accessorized');
      
      toast.success('Added accessories to your outfit', {
        description: `Enhanced your look with ${randomAccessory.name}.`
      });
    } else {
      toast.info('No additional accessories available', {
        description: 'Try adding more accessories to your wardrobe.'
      });
    }
  };
  
  const handleAddLayers = () => {
    const currentOutfit = suggestedOutfit;
    
    const layerItems = sampleClothingItems.filter(
      item => (item.type.toLowerCase().includes('jacket') || 
              item.type.toLowerCase().includes('cardigan') ||
              item.type.toLowerCase().includes('coat')) && 
              !currentOutfit.items.includes(item.id)
    );
    
    if (layerItems.length > 0) {
      const randomLayer = layerItems[Math.floor(Math.random() * layerItems.length)];
      
      const layeredOutfit = {
        ...currentOutfit,
        name: `${currentOutfit.name} (Layered)`,
        items: [currentOutfit.items[0], ...currentOutfit.items.slice(1), randomLayer.id]
      };
      
      setSuggestedOutfit(layeredOutfit);
      setOutfitVariation('layered');
      
      toast.success('Added a layer to your outfit', {
        description: `Added a ${randomLayer.name} for extra warmth and style.`
      });
    } else {
      toast.info('No layering pieces available', {
        description: 'Try adding jackets or cardigans to your wardrobe.'
      });
    }
  };
  
  const handleTryNewLook = () => {
    const filteredOutfits = outfits.filter(outfit => outfit.id !== suggestedOutfit.id);
    
    if (filteredOutfits.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredOutfits.length);
      setSuggestedOutfit(filteredOutfits[randomIndex]);
      setOutfitVariation('new');
      
      toast.success('Here\'s a completely different look', {
        description: 'Sometimes a fresh perspective is all you need!'
      });
    } else {
      toast.info('No alternative outfits available', {
        description: 'Try adding more outfits to your wardrobe.'
      });
    }
  };
  
  const getOutfitVariationComment = () => {
    if (!weather) return "Let me help you put the finishing touches on your outfit!";
    
    if (outfitVariation === 'edgy') {
      return `Adding some edge to your look with darker tones and statement pieces, perfect for ${weather.condition} weather.`;
    } else if (outfitVariation === 'accessorized') {
      return `The right accessories can elevate your outfit and prepare you for ${weather.temperature}°C ${weather.condition} conditions.`;
    } else if (outfitVariation === 'layered') {
      return `Layering is key for ${weather.temperature}°C weather, allowing you to adjust throughout the day as needed.`;
    } else if (outfitVariation === 'new') {
      return `Sometimes a completely different direction is best for ${weather.condition} weather. What do you think of this alternative?`;
    }
    
    if (weather.temperature < 10) {
      return `It's quite cold at ${weather.temperature}°C! Let's add some warm finishing touches to this outfit.`;
    } else if (weather.temperature > 25) {
      return `At ${weather.temperature}°C, let's keep your outfit breathable while adding some style!`;
    } else {
      return `For today's ${weather.condition} weather at ${weather.temperature}°C, here are some final touches to perfect your look.`;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900">
      <Header />
      
      <main className="container max-w-6xl px-4 pt-20 pb-20">
        <motion.div 
          className="mb-6 text-center md:text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {getGreeting()} {userName}
            </h1>
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {getWeatherIcon()}
            </motion.div>
          </div>
          <motion.p 
            className="text-purple-200 text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Here's your perfect look for today {weather ? `(${weather.temperature}°C ${weather.condition})` : ''}
          </motion.p>
          <motion.p 
            className="text-purple-200/80 text-sm md:text-base mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Olivia helps you find the perfect outfit for today's weather and your style preferences.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Umbrella className="h-5 w-5 mr-2 text-blue-300" />
                Weather Conditions
              </h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Country</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map(country => (
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
                          <FormLabel className="text-white">City</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!selectedCountry || availableCities.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={availableCities.length === 0 ? "Select country first" : "Select city"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableCities.map(city => (
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
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    disabled={!form.watch("country") || !form.watch("city")}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Update Location
                  </Button>
                </form>
                
                <WeatherWidget 
                  className="mt-4" 
                  onWeatherChange={handleWeatherChange}
                  city={selectedLocation.city}
                  country={selectedLocation.country}
                  savePreferences={!!user}
                />
              </Form>
            </div>
          </div>
          
          <div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 border-2 border-white/70 shadow-md flex-shrink-0">
                  <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-md font-semibold text-white mb-2 flex items-center">
                    Olivia's Outfit Reasoning
                    <MessageCircle className="h-4 w-4 ml-2 text-purple-300" />
                  </h3>
                  <div className="text-sm text-purple-100 space-y-2 relative bg-white/5 p-3 rounded-lg rounded-tl-none border border-white/10">
                    <p>
                      {weather ? 
                        `Based on the ${weather.temperature}°C ${weather.condition} weather, and your selected filters, I've chosen a ${weather.temperature < 15 ? 'warm' : 'cool and comfortable'} outfit that's perfect for today.`
                        : 
                        "Once you set your location, I'll analyze the weather and suggest an appropriate outfit for you."
                      }
                    </p>
                    {timeOfDay && (
                      <p>
                        For {timeOfDay} hours, I've selected pieces that work well with the lighting and social context of this time.
                      </p>
                    )}
                    {activity && (
                      <p>
                        This outfit is suitable for {activity} activities, balancing comfort, style, and functionality.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
                Suggested Outfit
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRegenerateOutfit} 
                className="text-purple-200 hover:text-white hover:bg-purple-600/30"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Generate New
              </Button>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={suggestedOutfit.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <OutfitSuggestion 
                  outfit={suggestedOutfit}
                  items={sampleClothingItems}
                  weather={weather || undefined}
                  timeOfDay={timeOfDay}
                  activity={activity}
                  onWear={() => handleWearOutfit(suggestedOutfit.id)}
                  onRefresh={handleRegenerateOutfit}
                  onLike={handleLikeOutfit}
                  onDislike={handleDislikeOutfit}
                  onMakeWarmer={handleMakeWarmer}
                  onChangeTop={handleChangeTop}
                  onChangeBottom={handleChangeBottom}
                  onToggleFavorite={() => handleToggleFavorite(suggestedOutfit.id)}
                />
              </motion.div>
            </AnimatePresence>
            
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <Button 
                onClick={() => handleWearOutfit(suggestedOutfit.id)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
                size={isMobile ? "sm" : "default"}
              >
                <Shirt className="h-4 w-4 mr-1" />
                Wear This Outfit
              </Button>
              
              <Button 
                onClick={handleMakeWarmer}
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="border-white/20 text-white bg-white/5 hover:bg-white/10"
              >
                <ThermometerSun className="h-4 w-4 mr-1 text-orange-300" />
                Make It Warmer
              </Button>
              
              <Button 
                onClick={() => handleToggleFavorite(suggestedOutfit.id)}
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className={cn(
                  "border-white/20 text-white bg-white/5 hover:bg-white/10",
                  suggestedOutfit.favorite && "bg-pink-600/30 border-pink-400"
                )}
              >
                <Heart className={cn(
                  "h-4 w-4 mr-1",
                  suggestedOutfit.favorite ? "text-pink-400 fill-pink-400" : "text-pink-300"
                )} />
                {isMobile ? "Favorite" : (suggestedOutfit.favorite ? "Favorited" : "Add to Favorites")}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              <Button 
                onClick={handleChangeTop}
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="border-white/20 text-white bg-white/5 hover:bg-white/10"
              >
                <Shirt className="h-4 w-4 mr-1 text-blue-300" />
                {isMobile ? "Top" : "Change Top"}
              </Button>
              
              <Button 
                onClick={handleChangeBottom}
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="border-white/20 text-white bg-white/5 hover:bg-white/10"
              >
                <PanelBottom className="h-4 w-4 mr-1 text-indigo-300" />
                {isMobile ? "Bottom" : "Change Bottom"}
              </Button>
              
              <Button 
                onClick={handleRegenerateOutfit}
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="border-white/20 text-white bg-white/5 hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-1 text-purple-300" />
                {isMobile ? "New" : "New Suggestion"}
              </Button>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12 border-2 border-white/70 shadow-md">
                <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-300" />
                  Olivia's Final Touches
                </h2>
                <div className="text-white/90 text-sm md:text-base relative bg-white/5 p-4 rounded-lg rounded-tl-none border border-white/10">
                  <p>{getOutfitVariationComment()}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <Button 
                onClick={handleMakeEdgier}
                variant="outline"
                className="bg-black/40 border border-purple-500/40 hover:bg-purple-900/40 hover:border-purple-400 text-white"
              >
                <Scissors className="h-4 w-4 mr-2 text-purple-300" />
                Make it Edgier
              </Button>
              
              <Button 
                onClick={handleAddAccessories}
                variant="outline"
                className="bg-black/40 border border-blue-500/40 hover:bg-blue-900/40 hover:border-blue-400 text-white"
              >
                <Crown className="h-4 w-4 mr-2 text-blue-300" />
                Add Accessories
              </Button>
              
              <Button 
                onClick={handleAddLayers}
                variant="outline"
                className="bg-black/40 border border-green-500/40 hover:bg-green-900/40 hover:border-green-400 text-white"
              >
                <Layers className="h-4 w-4 mr-2 text-green-300" />
                Go Layered
              </Button>
              
              <Button 
                onClick={handleTryNewLook}
                variant="outline"
                className="bg-black/40 border border-pink-500/40 hover:bg-pink-900/40 hover:border-pink-400 text-white"
              >
                <BadgePlus className="h-4 w-4 mr-2 text-pink-300" />
                Try a New Look
              </Button>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shirt className="h-5 w-5 mr-2 text-purple-300" />
                Outfit Filters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-purple-200 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Time of Day
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(['morning', 'afternoon', 'evening', 'night'] as TimeOfDay[]).map((time) => (
                      <Button
                        key={time}
                        onClick={() => handleTimeOfDayChange(time)}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "border-white/20 text-white capitalize",
                          timeOfDay === time 
                            ? "bg-purple-600/50 border-purple-400" 
                            : "bg-white/5 hover:bg-white/10"
                        )}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm text-purple-200 mb-2 flex items-center">
                    <AlarmClockCheck className="h-4 w-4 mr-1" />
                    Activity
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(['work', 'casual', 'sport', 'party', 'date', 'formal'] as Activity[]).map((act) => (
                      <Button
                        key={act}
                        onClick={() => handleActivityChange(act)}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "border-white/20 text-white capitalize",
                          activity === act 
                            ? "bg-blue-600/50 border-blue-400" 
                            : "bg-white/5 hover:bg-white/10"
                        )}
                      >
                        {act}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <StyleTip />
            
            <TrendingItems />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Outfits;
