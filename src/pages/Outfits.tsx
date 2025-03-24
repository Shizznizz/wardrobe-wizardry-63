import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import WeatherWidget from '@/components/WeatherWidget';
import OutfitSuggestion from '@/components/OutfitSuggestion';
import OliviaBloomAdvisor from '@/components/OliviaBloomAdvisor';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { WeatherInfo, Outfit } from '@/lib/types';
import { sampleClothingItems, sampleOutfits, sampleUserPreferences } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { RefreshCw, Camera, MapPin, AlertTriangle } from 'lucide-react';
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
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "C��cuta", 
    "Bucaramanga", "Pereira", "Santa Marta", "Ibagué", "Pasto", "Manizales", 
    "Neiva", "Soledad", "Villavicencio", "Armenia", "Soacha", "Valledupar", 
    "Montería", "Sincelejo", "Popay��n", "Floridablanca", "Palmira", "Buenaventura", 
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
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ city?: string; country?: string }>({});
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
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
  
  const getWelcomeMessage = () => {
    const userName = user?.user_metadata?.name || user?.user_metadata?.full_name || "there";
    const location = selectedLocation.city ? `in ${selectedLocation.city}` : "today";
    const weatherDesc = weather ? 
      `${weather.temperature}°C ${weather.condition.toLowerCase()}` : 
      "current weather";
    
    return `Hey ${userName}! Based on the ${weatherDesc} ${location}, here's something comfy and stylish for your day 💫`;
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
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
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Let us help you start the day in style</h1>
              <p className="text-lg text-white/80 mb-6">
                Choose the perfect outfit for today's weather with our smart suggestions
              </p>
            </div>
            
            <div className={`grid ${isMobile ? '' : 'md:grid-cols-2'} gap-6 items-start mb-8`}>
              <div className={`space-y-4 ${isMobile ? 'w-full px-2' : ''}`}>
                <h2 className={`text-2xl font-bold ${isMobile ? 'text-center' : ''} bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300`}>Today's Weather</h2>
                
                {showLocationAlert && (
                  <Alert variant="destructive" className="mb-4 border-red-500/50 bg-red-950/50 backdrop-blur-sm">
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
                            <FormLabel className="text-white/90">Country</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-white/10 border-white/20 backdrop-blur-md text-white">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-slate-800/95 border-white/10 backdrop-blur-xl text-white">
                                {countries.map((country) => (
                                  <SelectItem key={country.code} value={country.code} className="focus:bg-purple-700/30 focus:text-white">
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
                            <FormLabel className="text-white/90">City</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                              defaultValue={field.value}
                              disabled={!selectedCountry}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-white/10 border-white/20 backdrop-blur-md text-white">
                                  <SelectValue placeholder={selectedCountry ? "Select city" : "Select country first"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-slate-800/95 border-white/10 backdrop-blur-xl text-white">
                                {availableCities.map((city) => (
                                  <SelectItem key={city} value={city} className="focus:bg-purple-700/30 focus:text-white">
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
                      className={`flex items-center gap-2 ${isMobile ? 'mx-auto' : ''} bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 text-white`}
                      disabled={!selectedCountry || !form.watch("city")}
                    >
                      <MapPin className="h-4 w-4" />
                      Update Location
                    </Button>
                  </form>
                </Form>
                
                <WeatherWidget
                  className={`${isMobile ? 'max-w-[280px] mx-auto' : 'w-full'} glass-dark`}
                  onWeatherChange={handleWeatherChange}
                  city={selectedLocation.city}
                  country={selectedLocation.country}
                  savePreferences={!!user}
                />
                
                {!isWeatherLoading && weather && (
                  <div className={`bg-purple-800/30 p-4 rounded-lg border border-white/10 backdrop-blur-md ${isMobile ? 'text-center' : ''}`}>
                    <p className="font-medium text-white/90">{getWeatherRecommendation()}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold ${isMobile ? 'text-center' : ''} bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300`}>Today's Suggestion</h2>
                {isWeatherLoading ? (
                  <div className="glass-dark rounded-lg p-6 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-12 w-12 rounded-full bg-white/5" />
                      <div>
                        <Skeleton className="h-6 w-32 mb-2 bg-white/5" />
                        <Skeleton className="h-4 w-24 bg-white/5" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                      <Skeleton className="aspect-square rounded-md bg-white/5" />
                      <Skeleton className="aspect-square rounded-md bg-white/5" />
                      <Skeleton className="aspect-square rounded-md hidden sm:block bg-white/5" />
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-10 w-28 bg-white/5" />
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
                    onMakeWarmer={handleMakeWarmer}
                    onChangeTop={handleChangeTop}
                    onChangeBottom={handleChangeBottom}
                  />
                )}
                
                <div className="flex flex-col gap-4 mt-6">
                  <Button 
                    variant="secondary" 
                    onClick={handleRegenerateOutfit}
                    className="flex items-center justify-center w-full gap-2 h-12 text-base bg-white/10 border border-white/20 text-white hover:bg-white/20"
                    disabled={isWeatherLoading}
                  >
                    <RefreshCw className="h-5 w-5" />
                    <span>Generate Another Outfit</span>
                  </Button>
                  
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="relative">
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse z-10">
                        Premium
                      </div>
                      <Link
                        to="/try-on"
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "w-full h-14 text-base font-semibold gap-2 relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                        )}
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Camera className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span>Try These Clothes On Your Photo!</span>
                      </Link>
                      <p className="text-xs text-center mt-2 text-white/70">
                        See how these clothes look on you with our virtual try-on feature
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
          
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">My Outfits</h2>
            
            {outfits.length === 0 ? (
              <div className="flex flex-col items-center justify-center glass-dark rounded-lg p-10 space-y-4">
                <p className="text-white/70 text-center">
                  You haven't created any outfits yet.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0">Create Your First Outfit</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {outfits.map(outfit => (
                  <div key={outfit.id} className="glass-dark rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
                    <div className="p-4">
                      <h3 className="text-xl font-medium text-white">{outfit.name}</h3>
                      <div className="flex mt-1 space-x-2">
                        {outfit.seasons.map(season => (
                          <span key={season} className="text-xs py-0.5 px-2 bg-purple-900/40 rounded-full capitalize">
                            {season}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {outfit.items.slice(0, 3).map(itemId => {
                          const item = sampleClothingItems.find(i => i.id === itemId);
                          return item ? (
                            <div key={item.id} className="aspect-square rounded-md overflow-hidden border border-white/10">
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
                        <div className="text-sm text-white/70">
                          Worn {outfit.timesWorn} times
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleFavorite(outfit.id)}
                          className={outfit.favorite ? "text-red-500" : "text-white/80 hover:text-white hover:bg-white/10"}
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
      
      <OliviaBloomAdvisor 
        outfit={suggestedOutfit} 
        items={sampleClothingItems} 
        weather={weather || undefined}
        userPreferences={{
          favoriteColors: sampleUserPreferences.favoriteColors,
          favoriteStyles: sampleUserPreferences.favoriteStyles
        }}
      />
      
      {showWelcomeMessage && (
        <OliviaBloomAssistant
          message={getWelcomeMessage()}
          type="welcome"
          timing="medium"
          actionText="Thanks, Olivia!"
          onAction={() => setShowWelcomeMessage(false)}
          position="bottom-right"
          autoClose={false}
          initialDelay={0.5}
        />
      )}
    </div>
  );
};

export default Outfits;

