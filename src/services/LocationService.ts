// Service to handle geolocation and city search functionality
import { countries } from '@/data/countries';

// Sample cities data with populations (would typically be fetched from an API or larger dataset)
// This is a simplified dataset for demo purposes
const citiesDataByCountry: Record<string, Array<{ name: string; population: number }>> = {
  'US': [
    { name: 'New York', population: 8398748 },
    { name: 'Los Angeles', population: 3990456 },
    { name: 'Chicago', population: 2705994 },
    { name: 'Houston', population: 2325502 },
    { name: 'Phoenix', population: 1660272 },
    { name: 'Philadelphia', population: 1584064 },
    { name: 'San Antonio', population: 1547253 },
    { name: 'San Diego', population: 1423851 },
    { name: 'Dallas', population: 1343573 },
    { name: 'San Jose', population: 1030119 },
    { name: 'Austin', population: 978908 },
    { name: 'Jacksonville', population: 903889 },
    { name: 'Fort Worth', population: 895008 },
    { name: 'Columbus', population: 892533 },
    { name: 'San Francisco', population: 883305 },
    { name: 'Charlotte', population: 872498 },
    { name: 'Indianapolis', population: 867125 },
    { name: 'Seattle', population: 744955 },
    { name: 'Denver', population: 716492 },
    { name: 'Washington', population: 705749 },
  ],
  'GB': [
    { name: 'London', population: 8908081 },
    { name: 'Birmingham', population: 1141816 },
    { name: 'Manchester', population: 547627 },
    { name: 'Glasgow', population: 621020 },
    { name: 'Liverpool', population: 498042 },
    { name: 'Leeds', population: 789194 },
    { name: 'Edinburgh', population: 513210 },
    { name: 'Sheffield', population: 582506 },
    { name: 'Bristol', population: 467099 },
    { name: 'Newcastle upon Tyne', population: 300196 },
    { name: 'Belfast', population: 343542 },
    { name: 'Leicester', population: 354224 },
    { name: 'Coventry', population: 371521 },
    { name: 'Nottingham', population: 321500 },
    { name: 'Stoke-on-Trent', population: 256375 },
    { name: 'Southampton', population: 253651 },
    { name: 'Derby', population: 255394 },
    { name: 'Portsmouth', population: 238800 },
    { name: 'Plymouth', population: 234982 },
    { name: 'Brighton', population: 290395 },
  ],
  'CA': [
    { name: 'Toronto', population: 2731571 },
    { name: 'Montreal', population: 1704694 },
    { name: 'Calgary', population: 1239220 },
    { name: 'Ottawa', population: 934243 },
    { name: 'Edmonton', population: 932546 },
    { name: 'Mississauga', population: 721599 },
    { name: 'Winnipeg', population: 705244 },
    { name: 'Vancouver', population: 631486 },
    { name: 'Brampton', population: 593638 },
    { name: 'Hamilton', population: 536917 },
    { name: 'Quebec City', population: 531902 },
    { name: 'Surrey', population: 517887 },
    { name: 'Laval', population: 422993 },
    { name: 'Halifax', population: 403131 },
    { name: 'London', population: 383822 },
    { name: 'Markham', population: 328966 },
    { name: 'Vaughan', population: 306233 },
    { name: 'Gatineau', population: 276245 },
    { name: 'Saskatoon', population: 273010 },
    { name: 'Longueuil', population: 239700 },
  ],
  // Add more countries as needed
};

// Add common/major cities for other countries
// In a real app, this would be fetched from an API
countries.forEach(country => {
  if (!citiesDataByCountry[country.code]) {
    // Add some placeholder cities for countries without specific data
    if (country.code === 'FR') {
      citiesDataByCountry[country.code] = [
        { name: 'Paris', population: 2148271 },
        { name: 'Marseille', population: 861635 },
        { name: 'Lyon', population: 513275 },
        { name: 'Toulouse', population: 475438 },
        { name: 'Nice', population: 342522 },
      ];
    } else if (country.code === 'DE') {
      citiesDataByCountry[country.code] = [
        { name: 'Berlin', population: 3644826 },
        { name: 'Hamburg', population: 1841179 },
        { name: 'Munich', population: 1471508 },
        { name: 'Cologne', population: 1085664 },
        { name: 'Frankfurt', population: 753056 },
      ];
    } else if (country.code === 'JP') {
      citiesDataByCountry[country.code] = [
        { name: 'Tokyo', population: 13929286 },
        { name: 'Yokohama', population: 3724844 },
        { name: 'Osaka', population: 2691742 },
        { name: 'Nagoya', population: 2295638 },
        { name: 'Sapporo', population: 1952356 },
      ];
    } else if (country.code === 'AU') {
      citiesDataByCountry[country.code] = [
        { name: 'Sydney', population: 5230330 },
        { name: 'Melbourne', population: 5078193 },
        { name: 'Brisbane', population: 2560720 },
        { name: 'Perth', population: 2085973 },
        { name: 'Adelaide', population: 1345777 },
      ];
    } else {
      // For countries without specific data, add an empty array
      citiesDataByCountry[country.code] = [];
    }
  }
});

export const getCitiesByCountry = (countryCode: string, searchQuery: string = ''): string[] => {
  const cities = citiesDataByCountry[countryCode] || [];
  
  // If there's a search query, filter cities that match the query
  if (searchQuery) {
    return cities
      .filter(city => city.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(city => city.name);
  }
  
  // Otherwise, return all cities for the country, sorted by population (largest first)
  return cities
    .sort((a, b) => b.population - a.population)
    .map(city => city.name);
};

export const getCurrentLocation = (): Promise<{ city: string; country: string } | null> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Using the OpenCage Geocoding API to get the location name
          // NOTE: In a production app, you'd want to use your own API key
          // and handle this on the server side to protect your API key
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9d27f550ec5640ceb4d73a56065dc9e2&language=en`
          );
          
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            const result = data.results[0].components;
            
            // Find the country code from our countries list
            const countryName = result.country;
            const country = countries.find(c => c.name === countryName);
            
            resolve({
              city: result.city || result.town || result.village || '',
              country: country ? country.code : ''
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error('Error getting location details:', error);
          reject(error);
        }
      },
      error => {
        console.error('Error getting geolocation:', error);
        reject(error);
      }
    );
  });
};

// Helper function to get the country name from a country code
export const getCountryName = (countryCode: string): string => {
  const country = countries.find(c => c.code === countryCode);
  return country ? country.name : '';
};

export const validateLocation = (
  countryCode: string, 
  cityName: string
): { isValid: boolean; message?: string } => {
  // If no country is selected, require selection
  if (!countryCode) {
    return { isValid: false, message: 'Please select a country' };
  }
  
  // If no city is entered, it's valid (we'll allow just country selection)
  if (!cityName) {
    return { isValid: true };
  }
  
  // Check if the city exists in our dataset for the selected country
  const cities = getCitiesByCountry(countryCode);
  const cityExists = cities.some(city => 
    city.toLowerCase() === cityName.toLowerCase()
  );
  
  // For cities not in our dataset, we'll still accept them but warn the user
  if (!cityExists && cities.length > 0) {
    return { 
      isValid: true, 
      message: 'City not recognized. Weather data might be less accurate.'
    };
  }
  
  return { isValid: true };
};
