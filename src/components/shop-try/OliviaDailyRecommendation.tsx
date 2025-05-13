
import { useState, useEffect } from 'react';
import { ClothingItem, WeatherInfo } from '@/lib/types';
import { generateRandomWeather } from '@/services/WeatherService';
import StyleAlchemySection from './StyleAlchemySection';

interface OliviaDailyRecommendationProps {
  isPremiumUser: boolean;
  onTryItem: (item: ClothingItem) => void;
  onUpgradeToPremium: () => void;
  customLocation?: { city: string; country: string } | null;
}

const OliviaDailyRecommendation = ({
  isPremiumUser,
  onTryItem,
  onUpgradeToPremium,
  customLocation
}: OliviaDailyRecommendationProps) => {
  const [loading, setLoading] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    const fetchWeatherAndItems = async () => {
      try {
        let weather: WeatherInfo;
        if (customLocation) {
          weather = generateRandomWeather(customLocation.city, customLocation.country);
        } else {
          weather = generateRandomWeather("New York", "USA");
        }
        setWeatherInfo(weather);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Removed toast error notification
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAndItems();
  }, [customLocation]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <StyleAlchemySection
      weather={weatherInfo}
      onTryItem={onTryItem}
      isPremiumUser={isPremiumUser}
      onUpgradeToPremium={onUpgradeToPremium}
      customLocation={customLocation}
    />
  );
};

export default OliviaDailyRecommendation;
