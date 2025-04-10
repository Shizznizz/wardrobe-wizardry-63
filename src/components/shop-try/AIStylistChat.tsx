
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import OliviaMoodAvatar from './OliviaMoodAvatar';

interface AIStylistChatProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
}

interface ChatMessage {
  sender: 'user' | 'olivia';
  text: string;
  timestamp: Date;
}

const AIStylistChat = ({
  isPremiumUser,
  onUpgradeToPremium
}: AIStylistChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'olivia',
      text: "Hi! I'm Olivia, your AI stylist. What would you like to know about your outfit today?",
      timestamp: new Date()
    }
  ]);
  
  const handleOpenChat = () => {
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    setIsOpen(true);
  };
  
  const handleCloseChat = () => {
    setIsOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };
  
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputText('');
    
    // Simulate Olivia's response after a short delay
    setTimeout(() => {
      const styleResponses = [
        "That outfit looks great! I'd suggest adding some gold accessories to elevate it further.",
        "The colors work well together. You might want to try a statement belt to define your waist.",
        "I love your style! For this outfit, a cropped jacket would be perfect for layering.",
        "Great choice! Consider rolling up the sleeves for a more casual vibe.",
        "This looks fantastic on you! Maybe try a French tuck with the top to add some dimension."
      ];
      
      const oliviaMessage: ChatMessage = {
        sender: 'olivia',
        text: styleResponses[Math.floor(Math.random() * styleResponses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, oliviaMessage]);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-20 right-6 z-50">
      {!isOpen && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <Button
            onClick={handleOpenChat}
            className="rounded-full p-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-0 -left-32 bg-white rounded-lg p-3 shadow-lg text-black text-sm w-36"
          >
            <div className="relative">
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent"></div>
              Want a second opinion?
              
              <div className="absolute -right-2 -bottom-2">
                <OliviaMoodAvatar mood="happy" size="sm" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="w-[350px] h-[450px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl border border-purple-500/20 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-between">
                <div className="flex items-center">
                  <OliviaMoodAvatar mood="happy" size="sm" />
                  <span className="ml-2 font-medium">Olivia Style Chat</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCloseChat}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'olivia' && (
                      <div className="mr-2 flex-shrink-0">
                        <OliviaMoodAvatar mood="happy" size="sm" />
                      </div>
                    )}
                    
                    <div 
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 backdrop-blur-sm text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 border-t border-white/10 bg-slate-900/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Olivia for style advice..."
                    className="flex-grow bg-slate-800 border border-white/20 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 rounded-full h-10 w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-center mt-2">
                  <div className="flex items-center text-xs text-white/50">
                    <Sparkles className="h-3 w-3 mr-1 text-purple-400" />
                    <span>Powered by AI Style Assistant</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIStylistChat;
