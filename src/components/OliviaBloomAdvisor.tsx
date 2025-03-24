
import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Outfit, ClothingItem, WeatherInfo } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'olivia' | 'user';
}

interface OliviaBloomAdvisorProps {
  outfit?: Outfit;
  items?: ClothingItem[];
  weather?: WeatherInfo;
  userPreferences?: {
    favoriteColors?: string[];
    favoriteStyles?: string[];
  };
}

const OliviaBloomAdvisor = ({ 
  outfit, 
  items, 
  weather, 
  userPreferences 
}: OliviaBloomAdvisorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showInitialGreeting, setShowInitialGreeting] = useState(true);

  // Generate initial greeting message based on outfit, weather, etc.
  useEffect(() => {
    if (showInitialGreeting && outfit) {
      const initialMessages = generateInitialMessages(outfit, items, weather, userPreferences);
      setMessages(initialMessages);
      setShowInitialGreeting(false);
    }
  }, [outfit, items, weather, userPreferences, showInitialGreeting]);

  const generateInitialMessages = (
    outfit?: Outfit,
    items?: ClothingItem[],
    weather?: WeatherInfo,
    userPreferences?: {
      favoriteColors?: string[];
      favoriteStyles?: string[];
    }
  ): Message[] => {
    const messages: Message[] = [];
    
    // Initial greeting
    const greeting = {
      id: '1',
      text: "Hi there! I'm Olivia Bloom, your personal style advisor. How can I help with your outfit today?",
      sender: 'olivia' as const
    };
    messages.push(greeting);
    
    // If we have an outfit, add a styling tip
    if (outfit) {
      const outfitItems = items?.filter(item => outfit.items.includes(item.id)) || [];
      
      let stylingMessage = "";
      
      // Personalize message based on available data
      if (weather && outfit.personalityTags && outfit.personalityTags.length > 0) {
        stylingMessage = `I picked this ${outfit.personalityTags[0]} ${outfit.name.toLowerCase()} look for you because it matches today's ${weather.temperature}°C weather and works perfectly for ${outfit.occasions[0] || 'your day'}.`;
      } else if (outfit.seasons.includes('summer') && weather && weather.temperature > 20) {
        stylingMessage = `This ${outfit.name.toLowerCase()} is perfect for today's warm weather! The light fabrics will keep you comfortable all day.`;
      } else if (outfit.favorite) {
        stylingMessage = `I've chosen one of your favorite outfits today! This ${outfit.name.toLowerCase()} look has always worked well for you.`;
      } else if (outfitItems.length > 0) {
        const mainItem = outfitItems[0];
        stylingMessage = `The ${mainItem.color} ${mainItem.type} is the star of this outfit. I love how it sets the tone for the entire look!`;
      } else {
        stylingMessage = `This ${outfit.name.toLowerCase()} look is a great choice today. The style works for various occasions!`;
      }
      
      messages.push({
        id: '2',
        text: stylingMessage,
        sender: 'olivia'
      });
      
      // Add a styling tip
      const stylingTips = [
        `Try accessorizing with a ${getComplementaryColor(outfitItems[0]?.color)} scarf for a pop of color.`,
        `You could roll up the sleeves for a more casual look.`,
        `This outfit would look great with minimal jewelry to keep it sleek and balanced.`,
        `Consider adding a belt to define your waist with this particular silhouette.`,
        `Layer with a light jacket if the temperature drops later.`
      ];
      
      messages.push({
        id: '3',
        text: stylingTips[Math.floor(Math.random() * stylingTips.length)],
        sender: 'olivia'
      });
    }
    
    return messages;
  };
  
  const getComplementaryColor = (color?: string): string => {
    const colorPairs: Record<string, string> = {
      'black': 'white',
      'white': 'black',
      'blue': 'orange',
      'green': 'red',
      'red': 'green',
      'purple': 'yellow',
      'yellow': 'purple',
      'orange': 'blue',
      'brown': 'blue',
      'pink': 'green',
      'gray': 'red'
    };
    
    return colorPairs[color as keyof typeof colorPairs] || 'neutral';
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user'
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    
    // Generate Olivia's response
    setTimeout(() => {
      const oliviaResponses = [
        "That's a great question! Based on this outfit, I'd suggest keeping accessories minimal and letting the main pieces speak for themselves.",
        "I see your style! This outfit would pair beautifully with ankle boots or simple flats depending on the occasion.",
        "Great observation! The color palette of this outfit works because it follows a complementary scheme - notice how the tones balance each other.",
        "You have a good eye! This particular combination works for multiple seasons - just add layers for cooler weather.",
        "That's exactly the right instinct! This outfit's personality is definitely on the minimalist side, which makes it versatile for different settings.",
        "I love your thinking! This outfit has a timeless quality that won't go out of style - a worthy investment for your wardrobe.",
      ];
      
      const oliviaResponse: Message = {
        id: Date.now().toString(),
        text: oliviaResponses[Math.floor(Math.random() * oliviaResponses.length)],
        sender: 'olivia'
      };
      
      setMessages(prev => [...prev, oliviaResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      {/* Chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-purple-100 z-50"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src="/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png" alt="Olivia Bloom" />
                  <AvatarFallback className="bg-purple-200 text-purple-700">OB</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-white flex items-center">
                    Olivia Bloom
                    <Sparkles className="h-4 w-4 ml-1 text-yellow-200" />
                  </h3>
                  <p className="text-xs text-white/80">Style Advisor</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'olivia' && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                      <AvatarImage src="/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png" alt="Olivia Bloom" />
                      <AvatarFallback className="bg-purple-200 text-purple-700">OB</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Olivia for style advice..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  size="icon"
                  className="rounded-full h-10 w-10 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OliviaBloomAdvisor;
