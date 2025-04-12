
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, CloudSun, MapPin, Sparkles, 
  Thermometer, Heart, User, Tag, Home, Building
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Mood = 'happy' | 'tired' | 'energetic' | 'relaxed' | 'professional' | 'romantic' | 'creative';
type Location = 'indoor' | 'outdoor' | 'both';
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
type DressCode = 'casual' | 'smart-casual' | 'business-casual' | 'business' | 'formal' | 'cocktail' | 'black-tie';

const EnhancedStyleContext = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activity, setActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [mood, setMood] = useState<Mood>('happy');
  const [location, setLocation] = useState<Location>('indoor');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [dressCode, setDressCode] = useState<DressCode | ''>('');
  const [aiRecommendation, setAiRecommendation] = useState(true);
  
  const moods: { value: Mood; label: string; icon: JSX.Element }[] = [
    { value: 'happy', label: 'Happy', icon: <Heart className="h-4 w-4 text-pink-400" /> },
    { value: 'tired', label: 'Tired', icon: <CloudSun className="h-4 w-4 text-blue-400" /> },
    { value: 'energetic', label: 'Energetic', icon: <Sparkles className="h-4 w-4 text-yellow-400" /> },
    { value: 'relaxed', label: 'Relaxed', icon: <CloudSun className="h-4 w-4 text-teal-400" /> },
    { value: 'professional', label: 'Professional', icon: <Building className="h-4 w-4 text-blue-400" /> },
    { value: 'romantic', label: 'Romantic', icon: <Heart className="h-4 w-4 text-red-400" /> },
    { value: 'creative', label: 'Creative', icon: <Tag className="h-4 w-4 text-purple-400" /> },
  ];
  
  const locations: { value: Location; label: string; icon: JSX.Element }[] = [
    { value: 'indoor', label: 'Indoor', icon: <Home className="h-4 w-4" /> },
    { value: 'outdoor', label: 'Outdoor', icon: <MapPin className="h-4 w-4" /> },
    { value: 'both', label: 'Both', icon: <Building className="h-4 w-4" /> },
  ];
  
  const timeOptions: { value: TimeOfDay; label: string; icon: JSX.Element }[] = [
    { value: 'morning', label: 'Morning', icon: <Clock className="h-4 w-4 text-yellow-400" /> },
    { value: 'afternoon', label: 'Afternoon', icon: <Clock className="h-4 w-4 text-orange-400" /> },
    { value: 'evening', label: 'Evening', icon: <Clock className="h-4 w-4 text-purple-400" /> },
    { value: 'night', label: 'Night', icon: <Clock className="h-4 w-4 text-indigo-400" /> },
  ];
  
  const activityOptions = [
    'Work', 'Meeting', 'Date', 'Party', 'Workout', 'Shopping', 
    'Travel', 'Interview', 'Dinner', 'Concert', 'Other'
  ];
  
  const handleGenerateOutfit = () => {
    // This would trigger the outfit generation logic based on the inputs
    console.log('Generating outfit with:', {
      activity: activity === 'Other' ? customActivity : activity,
      mood,
      location,
      timeOfDay,
      dressCode,
      aiRecommendation
    });
    
    // Placeholder for notification
    setIsExpanded(false);
  };
  
  useEffect(() => {
    // Auto-collapse on small screens
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <motion.div 
      className="w-full bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-purple-400" />
            What are you dressing for today?
          </h2>
          
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto text-white/70 hover:text-white hover:bg-white/10"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity" className="text-white/80">Activity/Event</Label>
                <Select 
                  value={activity} 
                  onValueChange={(value) => {
                    setActivity(value);
                    if (value !== 'Other') setCustomActivity('');
                  }}
                >
                  <SelectTrigger id="activity" className="bg-slate-700/60 border-slate-600/50 text-white">
                    <SelectValue placeholder="Select an activity" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    {activityOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {activity === 'Other' && (
                  <div className="mt-2">
                    <Input
                      placeholder="Describe your activity"
                      value={customActivity}
                      onChange={(e) => setCustomActivity(e.target.value)}
                      className="bg-slate-700/60 border-slate-600/50 text-white placeholder:text-white/50"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-white/80">Time of Day</Label>
                <div className="grid grid-cols-2 gap-2">
                  {timeOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={timeOfDay === option.value ? "default" : "outline"}
                      className={
                        timeOfDay === option.value 
                          ? "bg-purple-600 hover:bg-purple-700 border-none" 
                          : "bg-slate-700/40 border-slate-600/50 text-white hover:bg-slate-700/80"
                      }
                      onClick={() => setTimeOfDay(option.value)}
                    >
                      {option.icon}
                      <span className="ml-2">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/80">How are you feeling today?</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {moods.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={mood === option.value ? "default" : "outline"}
                    className={
                      mood === option.value 
                        ? "bg-purple-600 hover:bg-purple-700 border-none" 
                        : "bg-slate-700/40 border-slate-600/50 text-white hover:bg-slate-700/80"
                    }
                    onClick={() => setMood(option.value)}
                  >
                    {option.icon}
                    <span className="ml-2">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Location</Label>
                <div className="grid grid-cols-3 gap-2">
                  {locations.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={location === option.value ? "default" : "outline"}
                      className={
                        location === option.value 
                          ? "bg-purple-600 hover:bg-purple-700 border-none" 
                          : "bg-slate-700/40 border-slate-600/50 text-white hover:bg-slate-700/80"
                      }
                      onClick={() => setLocation(option.value)}
                    >
                      {option.icon}
                      <span className="ml-2">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dresscode" className="text-white/80">Dress Code (Optional)</Label>
                <Select 
                  value={dressCode} 
                  onValueChange={(value: string) => setDressCode(value as DressCode | '')}
                >
                  <SelectTrigger id="dresscode" className="bg-slate-700/60 border-slate-600/50 text-white">
                    <SelectValue placeholder="Select dress code" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="smart-casual">Smart Casual</SelectItem>
                    <SelectItem value="business-casual">Business Casual</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="cocktail">Cocktail</SelectItem>
                    <SelectItem value="black-tie">Black Tie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="ai-recommendation" 
                checked={aiRecommendation} 
                onCheckedChange={setAiRecommendation} 
              />
              <Label htmlFor="ai-recommendation" className="cursor-pointer">
                Use AI for personalized recommendations
              </Label>
            </div>
            
            <Button 
              onClick={handleGenerateOutfit}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 rounded-md shadow-md"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Perfect Outfit
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default EnhancedStyleContext;
