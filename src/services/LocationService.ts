
import { countries } from '@/data/countries';

// Cities by country
const citiesByCountry: Record<string, string[]> = {
  'US': ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'Seattle', 'Boston', 'Denver', 'Austin', 'Portland'],
  'GB': ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Liverpool', 'Glasgow', 'Leeds', 'Bristol', 'Oxford', 'Cambridge'],
  'CA': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Quebec City', 'Winnipeg', 'Halifax', 'Victoria'],
  'AU': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Wollongong', 'Hobart'],
  'FR': ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice', 'Toulouse', 'Strasbourg', 'Lille', 'Nantes', 'Montpellier'],
  'DE': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dresden', 'Nuremberg'],
  'IT': ['Rome', 'Milan', 'Florence', 'Venice', 'Naples', 'Turin', 'Bologna', 'Palermo', 'Verona', 'Genoa'],
  'ES': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Malaga', 'Granada', 'Murcia', 'Cadiz', 'Palma'],
  'NL': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen', 'Tilburg', 'Almere', 'Breda', 'Nijmegen'],
  'JP': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo', 'Nagoya', 'Fukuoka', 'Kobe', 'Hiroshima', 'Sendai'],
  'MX': ['Mexico City', 'Guadalajara', 'Monterrey', 'Cancún', 'Puebla', 'Tijuana', 'Mérida', 'León', 'Querétaro', 'Oaxaca'],
  'BR': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
  'CN': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Xi\'an', 'Nanjing', 'Chongqing', 'Wuhan'],
  'IN': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'],
  'RU': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Omsk', 'Samara', 'Rostov-on-Don', 'Ufa', 'Krasnoyarsk'],
};

export const getCitiesByCountry = (countryCode: string, searchQuery?: string): string[] => {
  const cities = citiesByCountry[countryCode] || [];
  
  if (!searchQuery) return cities;
  
  const lowerCaseQuery = searchQuery.toLowerCase();
  return cities.filter(city => city.toLowerCase().includes(lowerCaseQuery));
};

export const getCountryName = (countryCode: string): string => {
  const country = countries.find(c => c.code === countryCode);
  return country ? country.name : countryCode;
};

export const validateLocation = (countryCode: string, city: string): { isValid: boolean; message?: string } => {
  if (!countryCode) {
    return { isValid: false, message: 'Please select a country' };
  }
  
  if (!city) {
    return { isValid: false, message: 'Please select a city' };
  }
  
  const cities = getCitiesByCountry(countryCode);
  if (!cities.includes(city)) {
    return { isValid: false, message: `${city} is not a valid city in the selected country` };
  }
  
  return { isValid: true };
};

export const getCurrentLocation = async (): Promise<{ city: string; country: string } | null> => {
  // This is a mock implementation - in a real app you would use the Geolocation API
  // and a reverse geocoding service to get the actual location
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        city: 'Amsterdam',
        country: 'NL'
      });
    }, 1000);
  });
};
