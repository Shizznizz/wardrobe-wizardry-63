
import { WeatherInfo, Outfit, TimeOfDay, Activity } from '@/lib/types';
import WeatherWidget from '@/components/WeatherWidget';
import OliviaBloomAdvisor from '@/components/OliviaBloomAdvisor';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import { MessageCircle } from 'lucide-react';

interface WeatherAndAdvisorProps {
  currentWeather: WeatherInfo | null;
  selectedOutfit: Outfit | null;
  timeOfDay: TimeOfDay;
  activity: Activity;
  city: string;
  country: string;
  handleWeatherChange: (weatherData: WeatherInfo) => void;
}

const WeatherAndAdvisor = ({
  currentWeather,
  selectedOutfit,
  timeOfDay,
  activity,
  city,
  country,
  handleWeatherChange
}: WeatherAndAdvisorProps) => {
  return (
    <div className="md:col-span-4 space-y-6">
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Weather Mood</h2>
        </div>
        <WeatherWidget
          className="bg-transparent"
          onWeatherChange={handleWeatherChange}
          city={city}
          country={country}
          savePreferences={true}
        />
      </div>
      
      <div className="bg-card rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            Olivia's Reasoning
          </h2>
        </div>
        <div className="p-4">
          <OliviaBloomAdvisor 
            weather={currentWeather}
            timeOfDay={timeOfDay}
            activity={activity}
            selectedOutfit={selectedOutfit}
          />
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow">
        <div className="p-4">
          <OliviaBloomAssistant />
        </div>
      </div>
    </div>
  );
};

export default WeatherAndAdvisor;
