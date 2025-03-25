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
import { 
  RefreshCw, Camera, MapPin, AlertTriangle, Calendar, AlarmClockCheck, 
  MessageCircle, Sun, CloudRain, CloudSun, Cloud, Sparkles, Umbrella
} from 'lucide-react';
import { Coffee, Sunset, Moon, Party } from '@/components/ui/icons';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  // Rest of the component code remains unchanged
};
