
import { AlertCircle } from 'lucide-react';
import { WeatherInfo } from '@/lib/types';
import { motion } from 'framer-motion';

interface WeatherErrorProps {
  error: string;
  weather: WeatherInfo | null;
}

const WeatherError = ({ error, weather }: WeatherErrorProps) => {
  return (
    <div className="bg-gradient-to-br from-red-500/50 to-orange-600/50 rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex flex-col items-center text-center space-y-3">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            transition: { duration: 2, repeat: Infinity } 
          }}
          className="text-white"
        >
          <AlertCircle size={40} />
        </motion.div>
        
        <div>
          <h3 className="text-lg font-medium text-white mb-1">Weather Data Error</h3>
          <p className="text-sm text-white/80 mb-1">{error}</p>
          
          {weather && (
            <div className="mt-3 bg-black/20 p-2 rounded-lg">
              <p className="text-sm text-white">Showing estimated weather instead</p>
              <p className="text-white font-medium mt-1">
                {weather.temperature}°C, {weather.condition}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherError;
