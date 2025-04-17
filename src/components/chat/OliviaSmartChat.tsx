
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronDown, Sparkles, User, Headphones, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Outfit } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

// Types for the chat interface
interface ChatMessage {
  id: string;
  sender: 'user' | 'olivia';
  text: string;
  timestamp: Date;
  actions?: ChatAction[];
}

interface ChatAction {
  id: string;
  label: string;
  onClick: () => void;
}

interface ContextualPrompt {
  id: string;
  text: string;
  condition: () => boolean;
  actions?: ChatAction[];
}

interface OliviaSmartChatProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
  currentOutfit?: Outfit | null;
  userHasPhoto?: boolean;
  hasUploadedWardrobe?: boolean;
  weatherTemp?: number;
  weatherCondition?: string;
}

const OliviaSmartChat = ({
  isPremiumUser,
  onUpgradeToPremium,
  currentOutfit,
  userHasPhoto,
  hasUploadedWardrobe,
  weatherTemp,
  weatherCondition
}: OliviaSmartChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Fix: Check if user is new based on creation time if available
  const isNewUser = user && new Date().getTime() - new Date(user.created_at || Date.now()).getTime() < 86400000;
  
  // Get the current page
  const currentPage = location.pathname;
  
  // Define contextual prompts based on user state and page
  const contextualPrompts: ContextualPrompt[] = [
    {
      id: 'new-user',
      text: "Hi there! I'm Olivia, your AI fashion stylist. Want help getting started with your first outfit?",
      condition: () => isNewUser,
      actions: [
        {
          id: 'show-tutorial', 
          label: 'Show me how', 
          onClick: () => {
            addOliviaMessage("Great! Let's start by creating your virtual wardrobe or trying on some trending styles. What would you like to do first?", [
              {
                id: 'wardrobe',
                label: 'Create my wardrobe',
                onClick: () => navigateTo('/wardrobe')
              },
              {
                id: 'try-on',
                label: 'Try on looks',
                onClick: () => navigateTo('/shop-and-try')
              }
            ]);
          }
        },
        {
          id: 'skip', 
          label: 'I\'ll explore on my own', 
          onClick: () => addOliviaMessage("No problem! I'm here if you need any styling advice. Just click this chat button anytime.")
        }
      ]
    },
    {
      id: 'cold-weather',
      text: `It's ${weatherTemp ? weatherTemp + '°C' : 'cold'} outside${weatherCondition ? ' and ' + weatherCondition.toLowerCase() : ''}. Want to see some cozy outfits that match today's weather?`,
      condition: () => !!weatherTemp && weatherTemp < 10,
      actions: [
        {
          id: 'show-cold-outfits',
          label: 'Show cozy looks',
          onClick: () => {
            addOliviaMessage("Here are some warm outfits perfect for today's weather. Would you like to try these on?");
            navigateTo('/mix-and-match');
          }
        }
      ]
    },
    {
      id: 'hot-weather',
      text: `It's ${weatherTemp ? weatherTemp + '°C' : 'warm'} and sunny today! Want to see some breathable summer outfits?`,
      condition: () => !!weatherTemp && weatherTemp > 25,
      actions: [
        {
          id: 'show-summer-outfits',
          label: 'Show summer looks',
          onClick: () => {
            addOliviaMessage("Here are some light, breezy outfits perfect for hot weather. Would you like to try these on?");
            navigateTo('/mix-and-match');
          }
        }
      ]
    },
    {
      id: 'shop-try-prompt',
      text: "Would you like help choosing something to try on? I can recommend pieces based on your style preferences.",
      condition: () => currentPage.includes('shop-and-try') && !userHasPhoto,
      actions: [
        {
          id: 'get-recommendations',
          label: 'Get recommendations',
          onClick: () => addOliviaMessage("What kind of look are you going for today? Casual, formal, or something in between?", [
            {
              id: 'casual',
              label: 'Casual',
              onClick: () => addOliviaMessage("Great choice! Casual styles are trending right now. Try uploading your photo to see how these looks would suit you.")
            },
            {
              id: 'formal',
              label: 'Formal',
              onClick: () => addOliviaMessage("Perfect! I have some elegant formal options that would look stunning. Try uploading your photo to see how these would look on you.")
            }
          ])
        }
      ]
    },
    {
      id: 'wardrobe-prompt',
      text: "I can create personalized outfit combinations using your wardrobe pieces. Would you like to see some ideas?",
      condition: () => hasUploadedWardrobe && currentPage.includes('wardrobe'),
      actions: [
        {
          id: 'create-outfit',
          label: 'Create an outfit',
          onClick: () => {
            addOliviaMessage("What's the occasion for this outfit?", [
              {
                id: 'casual',
                label: 'Casual day out',
                onClick: () => addOliviaMessage("I've put together some casual options based on your wardrobe. Check them out in the Mix & Match section!")
              },
              {
                id: 'work',
                label: 'Work/Office',
                onClick: () => addOliviaMessage("I've created some professional looks perfect for the office. Take a look in the Mix & Match section!")
              },
              {
                id: 'date',
                label: 'Date night',
                onClick: () => addOliviaMessage("I've styled some date night outfits that will definitely impress! See them in the Mix & Match section!")
              }
            ]);
          }
        }
      ]
    },
    {
      id: 'outfit-feedback',
      text: currentOutfit ? `How do you like the ${currentOutfit.name} outfit? I can suggest alternatives or accessories.` : "How do you like this outfit? I can suggest alternatives or accessories.",
      condition: () => !!currentOutfit,
      actions: [
        {
          id: 'love-it',
          label: 'Love it!',
          onClick: () => addOliviaMessage("I'm so glad you like it! Would you like to save this to your favorites?", [
            {
              id: 'save-favorite',
              label: 'Save to favorites',
              onClick: () => {
                toast.success('Outfit added to favorites!');
                addOliviaMessage("Perfect! I've added this to your favorites. You can find it in your wardrobe anytime.");
              }
            }
          ])
        },
        {
          id: 'show-alternatives',
          label: 'Show alternatives',
          onClick: () => addOliviaMessage("I have some other styles that might work well for you. Let me show you some alternatives based on your preferences.")
        }
      ]
    },
    {
      id: 'default-prompt',
      text: "Hi! I'm Olivia, your AI fashion stylist. How can I help with your style today?",
      condition: () => true,
      actions: [
        {
          id: 'style-advice',
          label: 'Get style advice',
          onClick: () => addOliviaMessage("What kind of style advice are you looking for today?", [
            {
              id: 'outfit-ideas',
              label: 'Outfit ideas',
              onClick: () => navigateTo('/mix-and-match')
            },
            {
              id: 'try-clothes',
              label: 'Try on clothes',
              onClick: () => navigateTo('/shop-and-try')
            },
            {
              id: 'color-advice',
              label: 'Color combinations',
              onClick: () => addOliviaMessage("Colors that complement each other create harmonious outfits. What's your favorite color to wear?")
            }
          ])
        },
        {
          id: 'trending',
          label: 'What\'s trending',
          onClick: () => addOliviaMessage("Right now, oversized blazers, wide-leg pants, and statement accessories are trending. Would you like me to show you some examples?", [
            {
              id: 'show-trends',
              label: 'Show me trends',
              onClick: () => {
                addOliviaMessage("Here are some of the hottest trends right now. Would you like to try any of these on?");
                navigateTo('/shop-and-try');
              }
            }
          ])
        }
      ]
    }
  ];
  
  // Helper function to navigate to different pages
  const navigateTo = (path: string) => {
    toast.info(`Navigating to ${path.replace('/', '')}`);
    window.location.href = path;
  };
  
  // Function to add a user message
  const addUserMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };
  
  // Function to add an Olivia message
  const addOliviaMessage = (text: string, actions?: ChatAction[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'olivia',
      text,
      timestamp: new Date(),
      actions
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (!isOpen) {
      setHasNewMessages(true);
      setUnreadCount(prev => prev + 1);
    }
  };
  
  // Send a message as the user
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add the user message
    addUserMessage(input);
    setInput('');
    
    if (!isPremiumUser) {
      // If not premium, suggest upgrade after a short delay
      setTimeout(() => {
        addOliviaMessage(
          "I'd love to help you with that! For personalized fashion advice and styling, upgrade to premium for full access to my styling capabilities.", 
          [{
            id: 'upgrade',
            label: 'Upgrade to Premium',
            onClick: onUpgradeToPremium
          }]
        );
      }, 1000);
      return;
    }
    
    // Simple response logic based on keywords in the message
    const lowerInput = input.toLowerCase();
    
    setTimeout(() => {
      if (lowerInput.includes('outfit') || lowerInput.includes('look') || lowerInput.includes('style')) {
        addOliviaMessage(
          "I'd be happy to help you with outfit ideas! What's the occasion you're dressing for?",
          [
            {
              id: 'casual',
              label: 'Casual',
              onClick: () => addOliviaMessage("For a casual look, try pairing straight-leg jeans with an oversized button-up and some white sneakers. It's effortless but put-together!")
            },
            {
              id: 'formal',
              label: 'Formal',
              onClick: () => addOliviaMessage("For formal occasions, you can't go wrong with a well-fitted blazer over a simple dress or a classic suit with subtle accessories.")
            },
            {
              id: 'date',
              label: 'Date Night',
              onClick: () => addOliviaMessage("For date night, try something that makes you feel confident! A nice top with your favorite jeans or a comfortable dress with statement jewelry works well.")
            }
          ]
        );
      } else if (lowerInput.includes('weather') || lowerInput.includes('rain') || lowerInput.includes('cold') || lowerInput.includes('hot')) {
        addOliviaMessage(
          "Dressing for the weather is smart! Would you like outfit recommendations based on today's forecast?",
          [
            {
              id: 'yes-weather',
              label: 'Yes, please',
              onClick: () => addOliviaMessage(`Based on ${weatherTemp ? 'the current ' + weatherTemp + '°C' : 'today\'s weather'}, I recommend layers that can be adjusted throughout the day. Would you like me to show some specific options?`)
            }
          ]
        );
      } else if (lowerInput.includes('color') || lowerInput.includes('match')) {
        addOliviaMessage(
          "Color coordination can transform an outfit! Are you looking for colors that match a specific item or general color combination advice?",
          [
            {
              id: 'specific-item',
              label: 'Match specific item',
              onClick: () => addOliviaMessage("What color is the item you want to match? I can suggest complementary colors.")
            },
            {
              id: 'general-advice',
              label: 'General advice',
              onClick: () => addOliviaMessage("Some timeless color combinations include: navy and white, beige and black, or monochromatic looks with different shades of the same color. What's your favorite color to wear?")
            }
          ]
        );
      } else {
        addOliviaMessage(
          "Thanks for your message! How else can I help with your fashion needs today?",
          [
            {
              id: 'outfit-help',
              label: 'Create an outfit',
              onClick: () => navigateTo('/mix-and-match')
            },
            {
              id: 'try-on',
              label: 'Try on looks',
              onClick: () => navigateTo('/shop-and-try')
            }
          ]
        );
      }
    }, 1000);
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Find the first matching contextual prompt
  const getContextualPrompt = () => {
    return contextualPrompts.find(prompt => prompt.condition());
  };
  
  // Initialize with a contextual message
  useEffect(() => {
    if (messages.length === 0) {
      const prompt = getContextualPrompt();
      if (prompt) {
        addOliviaMessage(prompt.text, prompt.actions);
      }
    }
  }, [currentPage]);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Reset unread count when opening the chat
  useEffect(() => {
    if (isOpen) {
      setHasNewMessages(false);
      setUnreadCount(0);
    }
  }, [isOpen]);
  
  // Toggle the chat open state
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };
  
  // Minimize the chat window
  const minimizeChat = () => {
    setIsMinimized(true);
  };
  
  // Expand the minimized chat
  const expandChat = () => {
    setIsMinimized(false);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`rounded-lg shadow-xl mb-4 overflow-hidden ${isMobile ? 'w-[calc(100vw-48px)]' : 'w-80'} max-h-[500px] flex flex-col`}
            ref={chatContainerRef}
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3 flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 border-2 border-white/30">
                  <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
                  <AvatarFallback className="bg-purple-700">OB</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <h3 className="font-medium text-white text-sm">Olivia</h3>
                  <p className="text-white/80 text-xs">AI Style Assistant</p>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={minimizeChat}
                  className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleChat}
                  className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="flex-grow overflow-y-auto p-3 space-y-3 bg-slate-950/95 backdrop-blur-sm">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'olivia' && (
                    <Avatar className="h-8 w-8 mt-1 mr-2 flex-shrink-0">
                      <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
                      <AvatarFallback className="bg-purple-700">OB</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="flex flex-col max-w-[85%]">
                    <div 
                      className={`rounded-xl p-3 ${
                        message.sender === 'user' 
                          ? 'bg-purple-600 text-white ml-auto' 
                          : 'bg-slate-800 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.actions.map((action) => (
                          <Button
                            key={action.id}
                            size="sm"
                            variant="outline"
                            onClick={action.onClick}
                            className="text-xs bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="p-3 border-t border-slate-800 bg-slate-900 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Olivia for styling advice..."
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 flex-shrink-0"
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
        
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg p-3 mb-4 cursor-pointer shadow-lg"
            onClick={expandChat}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
                  <AvatarFallback className="bg-purple-700">OB</AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-medium">Olivia</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleChat();
                }}
                className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-3 shadow-lg shadow-purple-500/20 flex items-center justify-center relative"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <AnimatePresence>
          {hasNewMessages && !isOpen && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute -top-2 -right-2 bg-blue-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default OliviaSmartChat;
