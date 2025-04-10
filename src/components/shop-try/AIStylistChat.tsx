
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, X, Lock, Sparkles } from 'lucide-react';
import OliviaMoodAvatar from './OliviaMoodAvatar';

interface AIStylistChatProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const AIStylistChat = ({ 
  isPremiumUser, 
  onUpgradeToPremium,
  onClose 
}: AIStylistChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hi! I'm Olivia, your AI stylist. Ask me anything about your outfit or style choices!",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-expand when first mounted if it's in the floating mode
    if (onClose) {
      setIsOpen(true);
    }
  }, [onClose]);
  
  useEffect(() => {
    // Scroll to bottom whenever messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    if (!isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const responses = [
        "That's a great style choice! The colors complement your tone really well.",
        "Try pairing that with a statement accessory to elevate the look.",
        "For that occasion, I'd suggest adding a layer like a cardigan or light jacket.",
        "This silhouette works beautifully for your body type. Great choice!",
        "The material looks perfect for the season you mentioned."
      ];
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };
  
  if (!isPremiumUser && !isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full py-2 pl-3 pr-4 shadow-lg hover:shadow-purple-500/20"
          onClick={onUpgradeToPremium}
        >
          <Lock className="h-4 w-4 mr-2" />
          Unlock AI Stylist
        </Button>
      </motion.div>
    );
  }
  
  if (!isOpen && !onClose) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-3 shadow-lg shadow-purple-500/20"
          onClick={toggleChat}
        >
          <Sparkles className="h-5 w-5 text-white" />
        </Button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 20, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed ${onClose ? 'inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4' : 'bottom-6 right-6 z-50'}`}
    >
      <Card className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg border border-purple-500/20 shadow-2xl overflow-hidden ${onClose ? 'w-full max-w-md h-[600px]' : 'w-80 h-96'}`}>
        <div className="flex justify-between items-center p-3 border-b border-white/10 bg-gradient-to-r from-indigo-800/30 to-violet-800/30">
          <div className="flex items-center">
            <OliviaMoodAvatar mood="neutral" size="sm" />
            <h3 className="ml-2 font-medium text-white">Olivia - AI Stylist</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-white/10"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <div className="mr-2 flex-shrink-0">
                      <OliviaMoodAvatar mood="happy" size="sm" />
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-700/60 text-white border border-white/10'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>
          
          <div className="p-3 border-t border-white/10 bg-slate-800/50">
            {isPremiumUser ? (
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask Olivia for styling advice..."
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                  onClick={handleSend}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500"
                onClick={onUpgradeToPremium}
              >
                <Lock className="h-4 w-4 mr-2" />
                Unlock AI Stylist Chat
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AIStylistChat;
