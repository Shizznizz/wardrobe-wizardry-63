import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SendHorizontal, Sparkles, Calendar, CalendarDays, X, Wand2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const outfitSuggestions = [
  "Try your beige trench coat with black ankle boots and a white blouse — perfect balance of cozy and chic.",
  "A lightweight cardigan over a floral dress with white sneakers would be ideal for this situation.",
  "Layer a denim jacket over a striped tee with dark jeans and boots for a casual but put-together look.",
  "A midi skirt with a tucked-in sweater and knee-high boots would be both comfortable and stylish.",
  "Pair your favorite jeans with a cozy oversized sweater and ankle boots for the perfect blend of comfort and style.",
  "A blazer over a simple t-shirt with straight-leg trousers and loafers creates an effortlessly polished look.",
  "Try a sweater dress with tights and ankle boots, topped with your camel coat for warmth and elegance.",
  "Layer a turtleneck under a slip dress with chunky boots for an on-trend transitional outfit."
];

const eventSuggestions = [
  { value: 'casual-dinner', label: 'Casual Dinner', temp: '15°C', icon: 'calendar' },
  { value: 'date-night', label: 'Date Night', temp: '18°C', icon: 'calendar' },
  { value: 'work-meeting', label: 'Work Meeting', temp: '21°C', icon: 'calendar' },
  { value: 'coffee-date', label: 'Coffee Date', temp: '16°C', icon: 'calendar' },
  { value: 'weekend-brunch', label: 'Weekend Brunch', temp: '19°C', icon: 'calendar' },
  { value: 'formal-event', label: 'Formal Event', temp: '22°C', icon: 'calendar' },
  { value: 'outdoor-activity', label: 'Outdoor Activity', temp: '14°C', icon: 'calendar' },
  { value: 'casual-friday', label: 'Casual Friday', temp: '20°C', icon: 'calendar' },
  { value: 'evening-party', label: 'Evening Party', temp: '17°C', icon: 'calendar' },
  { value: 'beach-day', label: 'Beach Day', temp: '25°C', icon: 'sun' },
  { value: 'rainy-day', label: 'Rainy Day', temp: '12°C', icon: 'cloud-rain' },
  { value: 'shopping-trip', label: 'Shopping Trip', temp: '18°C', icon: 'shirt' }
];

const moodOptions = [
  { value: 'happy', label: 'Happy' },
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'creative', label: 'Creative' },
];

const locationOptions = [
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'mixed', label: 'Mixed (Indoor & Outdoor)' },
];

const timeOptions = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
];

const getRandomSuggestion = () => {
  const randomIndex = Math.floor(Math.random() * outfitSuggestions.length);
  return outfitSuggestions[randomIndex];
};

const StyleSituation = () => {
  const [situation, setSituation] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() && !selectedEvent) return;
    
    setSuggestion('');
    setTypedText('');
    
    const newSuggestion = getRandomSuggestion();
    setSuggestion(newSuggestion);
    
    setIsTyping(true);
    typeText(newSuggestion);
  };
  
  const typeText = (text: string) => {
    let i = 0;
    setTypedText('');
    
    const typing = setInterval(() => {
      if (i < text.length) {
        setTypedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typing);
        setIsTyping(false);
      }
    }, 30);
  };

  const handleEventSelect = (eventValue: string) => {
    const event = eventSuggestions.find(e => e.value === eventValue);
    if (event) {
      setSituation(`${event.label}, ${event.temp}`);
      setSelectedEvent(event.label);
    }
    setOpen(false);
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const clearSelection = () => {
    setSituation('');
    setSelectedEvent('');
    inputRef.current?.focus();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-sm border border-coral-500/20 rounded-xl p-3 sm:p-6 shadow-xl bg-subtle-pattern space-y-6"
    >
      <h3 className="text-lg sm:text-xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-coral-300 flex items-center justify-center gap-2 mb-6">
        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-coral-400" />
        What are you styling for today?
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Popover open={open} onOpenChange={setOpen}>
            <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-3`}>
              <div className="relative flex-grow">
                <PopoverTrigger asChild>
                  <div className="w-full cursor-pointer">
                    <Input
                      ref={inputRef}
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      placeholder={isMobile ? "Select or type an event" : "Select or type an event (e.g., 'Date Night, 15°C')"}
                      className="flex-grow bg-slate-800/60 border-coral-500/30 text-white placeholder:text-slate-400 text-sm sm:text-base pr-10 hover:border-coral-400/50 focus:border-coral-400 transition-colors duration-200"
                      onClick={() => setOpen(true)}
                    />
                    <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-coral-400" />
                  </div>
                </PopoverTrigger>
                
                {situation && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-white hover:bg-transparent"
                    onClick={clearSelection}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <Button 
                type="submit" 
                className={`bg-gradient-to-r from-coral-500 to-coral-400 hover:from-coral-400 hover:to-coral-300 shadow-lg 
                  hover:shadow-coral transition-all duration-300 rounded-xl
                  ${isMobile ? 'w-full py-2.5 text-sm' : 'px-4 py-2 sm:py-2.5 h-auto min-w-[150px]'} transform hover:scale-[1.02] active:scale-98 transition-all duration-200`}
                disabled={isTyping || (!situation.trim() && !selectedEvent)}
              >
                <Wand2 className={`${isMobile ? 'h-4 w-4 mr-1' : 'h-4 w-4 sm:h-5 sm:w-5 mr-2'}`} />
                {isMobile ? "Recommend outfit" : "What outfit do you recommend?"}
              </Button>
            </div>
            
            <PopoverContent className="p-0 bg-slate-900/95 border border-coral-500/30 text-white w-full" align="start">
              <Command className="bg-transparent">
                <CommandInput placeholder="Search events..." className="border-b border-coral-500/20 text-white placeholder:text-slate-400 bg-transparent" />
                <CommandList className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-coral-600/50 scrollbar-track-slate-800/50">
                  <CommandEmpty className="py-2 px-4 text-slate-400 text-sm">
                    No events found
                  </CommandEmpty>
                  <CommandGroup heading="Popular Events">
                    {eventSuggestions.map((event) => (
                      <CommandItem
                        key={event.value}
                        value={event.value}
                        onSelect={handleEventSelect}
                        className="py-2 hover:bg-coral-600/20 text-white cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {event.icon === 'calendar' && <CalendarDays className="h-4 w-4 text-coral-400" />}
                          {event.icon === 'sun' && <CalendarDays className="h-4 w-4 text-amber-400" />}
                          {event.icon === 'cloud-rain' && <CalendarDays className="h-4 w-4 text-blue-400" />}
                          {event.icon === 'shirt' && <CalendarDays className="h-4 w-4 text-green-400" />}
                          <span>{event.label}</span>
                          <span className="ml-auto text-xs text-slate-400">{event.temp}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-white/70 mb-1 block">Mood</label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="bg-slate-800/60 border-coral-500/30 text-white">
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-coral-500/30">
                {moodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs text-white/70 mb-1 block">Location</label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="bg-slate-800/60 border-coral-500/30 text-white">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-coral-500/30">
                {locationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs text-white/70 mb-1 block">Time of Day</label>
            <Select value={timeOfDay} onValueChange={setTimeOfDay}>
              <SelectTrigger className="bg-slate-800/60 border-coral-500/30 text-white">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-coral-500/30">
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
      
      {(suggestion || isTyping) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-coral-500/20 mt-4 hover:border-coral-400/30 transition-colors duration-200"
        >
          <div className="flex gap-2 sm:gap-3">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-coral-500/50">
              <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
              <AvatarFallback className="bg-gradient-to-r from-coral-500 to-coral-400">OB</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="text-[10px] sm:text-xs text-coral-300 mb-1">Olivia's suggestion:</div>
              <p className="text-white text-xs sm:text-sm">
                {typedText}
                {isTyping && (
                  <span className="inline-block w-2 h-4 bg-coral-400 ml-1 animate-pulse"></span>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StyleSituation;
