
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
    }

    toast.success("Generated a new outfit suggestion");
  };
  
  const handleTimeOfDayChange = (time: TimeOfDay) => {
    setTimeOfDay(time);
    handleRegenerateOutfit();
  };
  
  const handleActivityChange = (selected: Activity) => {
    setActivity(selected);
    handleRegenerateOutfit();
  };
  
  const filterOutfitsByPreferences = (outfitsList: Outfit[]): Outfit[] => {
    let filtered = [...outfitsList];
    
    if (weather) {
      const tempCategory = weather.temperature < 10 ? 'cold' : 
                          weather.temperature > 25 ? 'hot' : 'mild';
      
      const season = getSeasonFromDate(new Date());
      
      filtered = filtered.filter(outfit => {
        const matchesSeason = outfit.seasons.includes(season);
        
        let matchesTemp = true;
        if (tempCategory === 'cold' && !outfit.forCold) matchesTemp = false;
        if (tempCategory === 'hot' && !outfit.forHot) matchesTemp = false;
        
        let matchesWeather = true;
        if (weather.condition.toLowerCase().includes('rain') && !outfit.forRain) {
          matchesWeather = false;
        }
        
        return matchesSeason && matchesTemp && matchesWeather;
      });
    }
    
    if (timeOfDay) {
      filtered = filtered.filter(outfit => {
        const timeMatch = outfit.timeOfDay ? outfit.timeOfDay.includes(timeOfDay) : true;
        return timeMatch;
      });
    }
    
    if (activity) {
      filtered = filtered.filter(outfit => {
        const activityMatch = outfit.activities ? outfit.activities.includes(activity) : true;
        return activityMatch;
      });
    }
    
    return filtered;
  };
  
  const getSeasonFromDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  };
  
  const getTimeOfDayGreeting = (): string => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  };
  
  const handleLikeOutfit = () => {
    toast.success("You liked this outfit!", {
      description: "This helps improve your recommendations."
    });
  };
  
  const handleDislikeOutfit = () => {
    handleRegenerateOutfit();
    toast.success("Generated a new outfit suggestion for you.", {
      description: "Thanks for your feedback."
    });
  };
  
  const toggleFavoriteOutfit = () => {
    setOutfits(prev => 
      prev.map(outfit => 
        outfit.id === suggestedOutfit.id 
          ? { 
              ...outfit, 
              favorite: !outfit.favorite
            } 
          : outfit
      )
    );
    
    setSuggestedOutfit(prev => ({
      ...prev,
      favorite: !prev.favorite
    }));
    
    if (!suggestedOutfit.favorite) {
      toast.success("Added to favorites!");
    } else {
      toast.success("Removed from favorites");
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    setSelectedLocation({
      city: data.city,
      country: data.country
    });
    
    saveLocationPreferences(data.country, data.city);
    
    toast.success("Location updated", {
      description: `Weather set to ${data.city}, ${data.country}`
    });
  };
  
  useEffect(() => {
    if (selectedLocation.city && selectedLocation.country && isWeatherLoading) {
      setShowLocationAlert(false);
    } else if (!isWeatherLoading && !weather?.city) {
      setShowLocationAlert(true);
    } else {
      setShowLocationAlert(false);
    }
  }, [selectedLocation, isWeatherLoading, weather]);
  
  useEffect(() => {
    if (showWelcomeMessage) {
      setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000);
    }
  }, [showWelcomeMessage]);
  
  const greeting = getTimeOfDayGreeting();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white pb-24">
      <Header weather={weather ? { temperature: weather.temperature, condition: weather.condition } : undefined} />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Title and Weather Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Good {greeting}, here's your perfect outfit for today!
            </h1>
            
            {weather && (
              <p className="text-lg text-white/80 mb-4">
                Selected for {weather.temperature}°C in {weather.city || 'your area'}
              </p>
            )}
            
            {suggestedOutfit && (
              <h2 className="text-xl md:text-2xl font-semibold mb-4">
                {suggestedOutfit.name}
                {suggestedOutfit.favorite && (
                  <Heart className="inline-block ml-2 h-5 w-5 text-pink-400 fill-pink-400" />
                )}
              </h2>
            )}
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Select value={timeOfDay} onValueChange={(val) => handleTimeOfDayChange(val as TimeOfDay)}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/10 border-white/20">
                  <SelectValue placeholder="Time of day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={activity} onValueChange={(val) => handleActivityChange(val as Activity)}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/10 border-white/20">
                  <SelectValue placeholder="Activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Right Column - Olivia Bloom Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="border-2 border-purple-400 h-10 w-10">
                <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                <AvatarFallback>OB</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-purple-100">Olivia Bloom</h3>
                <p className="text-sm text-white/60">Your AI Style Assistant</p>
              </div>
            </div>
            
            {weather && (
              <p className="text-white/90 mb-3">
                Based on the {weather.temperature}°C {weather.condition.toLowerCase()}, 
                I've chosen something {weather.temperature < 15 ? 'warm and cozy' : 'light and comfortable'} 
                that will keep you {weather.temperature < 15 ? 'protected from the cold' : 'cool throughout the day'}.
              </p>
            )}
            
            <p className="text-white/90">
              This outfit works well for {activity || 'everyday activities'} during the {timeOfDay || greeting}.
              Feel free to swap items if you want to try something different!
            </p>
          </div>
        </div>
        
        {showLocationAlert && (
          <Alert variant="destructive" className="mb-6 bg-orange-900/50 border-orange-600">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Location needed</AlertTitle>
            <AlertDescription>
              Please set your location below to get personalized outfit recommendations based on your local weather.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-8">
          {isWeatherLoading ? (
            <div className="mb-6">
              <Skeleton className="h-12 w-full mb-2 bg-white/10" />
              <Skeleton className="h-32 w-full bg-white/10" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <OutfitSuggestion 
                  outfit={suggestedOutfit} 
                  items={sampleClothingItems} 
                  weather={weather || undefined}
                  timeOfDay={timeOfDay}
                  activity={activity}
                  onWear={handleWearOutfit}
                  onLike={handleLikeOutfit}
                  onDislike={handleDislikeOutfit}
                  onToggleFavorite={toggleFavoriteOutfit}
                />
                
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={handleRegenerateOutfit} 
                    variant="default" 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate New Outfit
                  </Button>
                </div>
              </div>
              
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-gradient-to-br from-gray-900/80 to-black/90 border-white/10 overflow-hidden">
                  <div className="px-4 py-4">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <h3 className="text-xl font-semibold mb-2">Update Location</h3>
                        
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20">
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
                                disabled={!selectedCountry || availableCities.length === 0}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20">
                                    <SelectValue placeholder="Select a city" />
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
                        
                        <Button type="submit" className="w-full">
                          <MapPin className="h-4 w-4 mr-2" />
                          Update Weather
                        </Button>
                      </form>
                    </Form>
                  </div>
                </Card>
                
                <WeatherWidget 
                  className="bg-gradient-to-br from-gray-900/80 to-black/90 border border-white/10 rounded-lg overflow-hidden"
                  onWeatherChange={handleWeatherChange}
                  city={selectedLocation.city}
                  country={selectedLocation.country}
                />
                
                <StyleTip />
              </div>
            </div>
          )}
          
          <TrendingItems />
        </div>
      </main>
    </div>
  );
};

export default Outfits;
