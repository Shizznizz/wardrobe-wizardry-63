
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sparkles, Settings2 } from 'lucide-react';

interface PreferenceSettingsProps {
  onSave?: () => void;
}

const PreferenceSettings = ({ onSave }: PreferenceSettingsProps) => {
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [defaultView, setDefaultView] = useState('grid');
  
  const handleSave = () => {
    // In a real app, we'd save these to the backend/database
    localStorage.setItem('preferences', JSON.stringify({
      temperatureUnit,
      timeFormat,
      defaultView
    }));
    
    if (onSave) onSave();
  };
  
  return (
    <motion.div 
      className="glass-dark rounded-xl border border-white/10 p-4 sm:p-6 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 flex items-center">
        <Settings2 className="mr-2 h-5 w-5 text-pink-400" />
        Style Preferences
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-white">Temperature Unit</Label>
          <RadioGroup 
            defaultValue={temperatureUnit} 
            onValueChange={setTemperatureUnit}
            className="flex flex-wrap gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="celsius" id="celsius" className="border-pink-400 text-pink-400" />
              <Label htmlFor="celsius" className="text-white/90">Celsius (°C)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fahrenheit" id="fahrenheit" className="border-pink-400 text-pink-400" />
              <Label htmlFor="fahrenheit" className="text-white/90">Fahrenheit (°F)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label className="text-white">Time Format</Label>
          <RadioGroup 
            defaultValue={timeFormat} 
            onValueChange={setTimeFormat}
            className="flex flex-wrap gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="12h" id="12h" className="border-pink-400 text-pink-400" />
              <Label htmlFor="12h" className="text-white/90">12-hour (AM/PM)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24h" id="24h" className="border-pink-400 text-pink-400" />
              <Label htmlFor="24h" className="text-white/90">24-hour</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label className="text-white">Default Wardrobe View</Label>
          <Select defaultValue={defaultView} onValueChange={setDefaultView}>
            <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700/50 text-white">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white">
              <SelectItem value="grid" className="focus:bg-purple-900/30 focus:text-white">Grid View</SelectItem>
              <SelectItem value="list" className="focus:bg-purple-900/30 focus:text-white">List View</SelectItem>
              <SelectItem value="calendar" className="focus:bg-purple-900/30 focus:text-white">Calendar View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] text-white hover:scale-[1.03] transition-transform rounded-xl shadow-md shadow-purple-900/20 flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Save My Preferences
        </Button>
      </div>
    </motion.div>
  );
};

export default PreferenceSettings;
