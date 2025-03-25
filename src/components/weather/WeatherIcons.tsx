
import { motion } from 'framer-motion';
import { Wind, Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudSun } from 'lucide-react';

interface WeatherIconProps {
  iconSize?: number;
}

export const SunIcon = ({ iconSize = 50 }: WeatherIconProps) => {
  const sunVariants = {
    animate: {
      rotate: 360,
      transition: { 
        duration: 20, 
        repeat: Infinity, 
        ease: "linear" 
      }
    }
  };

  return (
    <motion.div variants={sunVariants} animate="animate" className="text-amber-400">
      <Sun size={iconSize} strokeWidth={1.5} />
    </motion.div>
  );
};

export const CloudSunIcon = ({ iconSize = 50 }: WeatherIconProps) => {
  const cloudVariants = {
    animate: {
      x: [0, 10, 0],
      transition: { 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  };

  return (
    <motion.div variants={cloudVariants} animate="animate" className="text-slate-200">
      <CloudSun size={iconSize} strokeWidth={1.5} />
    </motion.div>
  );
};

export const CloudIcon = ({ iconSize = 50 }: WeatherIconProps) => {
  const cloudVariants = {
    animate: {
      x: [0, 10, 0],
      transition: { 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  };

  return (
    <motion.div variants={cloudVariants} animate="animate" className="text-slate-300">
      <Cloud size={iconSize} strokeWidth={1.5} />
    </motion.div>
  );
};

export const RainIcon = ({ iconSize = 50 }: WeatherIconProps) => {
  return (
    <motion.div
      animate={{
        y: [-5, 5],
        transition: { 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut",
          repeatType: "mirror" 
        }
      }}
      className="text-blue-300"
    >
      <CloudRain size={iconSize} strokeWidth={1.5} />
    </motion.div>
  );
};

export const SnowIcon = ({ iconSize = 50 }: WeatherIconProps) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        transition: { duration: 2, repeat: Infinity }
      }}
      className="text-blue-100"
    >
      <CloudSnow size={iconSize} strokeWidth={1.5} />
    </motion.div>
  );
};

export const FogIcon = ({ iconSize = 50 }: WeatherIconProps) => {
  return (
    <motion.div
      animate={{
        opacity: [1, 0.7, 1],
        transition: { duration: 3, repeat: Infinity }
      }}
      className="text-gray-300"
    >
      <CloudFog size={iconSize} strokeWidth={1.5} />
    </motion.div>
  );
};

export const WeatherIconSelector = ({ iconName, iconSize = 50 }: { iconName: string; iconSize?: number }) => {
  if (iconName.includes('sun') || iconName.includes('clear')) {
    return <SunIcon iconSize={iconSize} />;
  }
  
  if (iconName.includes('cloud') && iconName.includes('sun')) {
    return <CloudSunIcon iconSize={iconSize} />;
  }
  
  if (iconName.includes('cloud')) {
    return <CloudIcon iconSize={iconSize} />;
  }
  
  if (iconName.includes('rain')) {
    return <RainIcon iconSize={iconSize} />;
  }
  
  if (iconName.includes('snow')) {
    return <SnowIcon iconSize={iconSize} />;
  }
  
  if (iconName.includes('fog')) {
    return <FogIcon iconSize={iconSize} />;
  }
  
  // Default icon
  return <SunIcon iconSize={iconSize} />;
};
