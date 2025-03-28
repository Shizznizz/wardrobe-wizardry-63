
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, ArrowRight, Sparkles } from 'lucide-react';

const OliviaChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'olivia',
      text: 'Hi there! I\'m Olivia, your personal style assistant. How can I help you today?'
    }
  ]);

  // Start animation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add user message
      setMessages(prev => [...prev, { sender: 'user', text: message }]);
      setMessage('');
      
      // Simulate Olivia's response after a short delay
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'olivia', 
          text: 'I\'m here to help with your fashion needs! Would you like me to suggest an outfit for today?' 
        }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-coral-200 mb-2"
          >
            {/* Chat header */}
            <div className="p-3 bg-gradient-to-r from-coral-500 to-coral-400 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
                  <AvatarFallback className="bg-coral-200 text-coral-700">OB</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-white flex items-center text-sm">
                    Olivia Bloom
                    <Sparkles className="h-3 w-3 ml-1 text-yellow-200" />
                  </h3>
                  <p className="text-xs text-white/80">Style Assistant</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-6 w-6 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 p-3 overflow-y-auto max-h-80 bg-purple-50">
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'olivia' && (
                      <Avatar className="h-6 w-6 mr-2 mt-0.5">
                        <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
                        <AvatarFallback className="bg-coral-200 text-coral-700">OB</AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`max-w-[85%] p-2 rounded-lg text-sm ${
                        msg.sender === 'user' 
                          ? 'bg-coral-500 text-white' 
                          : 'bg-white border border-purple-100 shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat input */}
            <div className="p-3 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="sm"
                  className="rounded-full h-8 w-8 p-0 bg-coral-500 hover:bg-coral-600"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-gradient-to-r from-coral-500 to-coral-400 text-white rounded-full shadow-lg p-0.5 flex items-center justify-center w-16 h-16 hover:shadow-coral transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full bg-white/20 z-0"
          animate={showAnimation ? { 
            scale: [1, 1.1, 1],
            opacity: [0, 0.5, 0]
          } : {}}
          transition={showAnimation ? { 
            repeat: Infinity, 
            duration: 2,
            repeatType: "loop"
          } : {}}
        />
        <Avatar className="h-full w-full border-2 border-white/30">
          <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
          <AvatarFallback className="bg-coral-200 text-coral-700">OB</AvatarFallback>
        </Avatar>
        {!isOpen && showAnimation && (
          <motion.div 
            className="absolute -top-1 -right-1 bg-coral-600 rounded-full p-1"
            animate={{ 
              y: [0, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              repeatType: "loop"
            }}
          >
            <MessageCircle className="h-3 w-3 text-white" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default OliviaChat;
