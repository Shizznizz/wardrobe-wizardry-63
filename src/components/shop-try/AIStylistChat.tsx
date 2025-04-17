
import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AIStylistChatProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
  onClose: () => void;
}

const AIStylistChat = ({ 
  isPremiumUser, 
  onUpgradeToPremium, 
  onClose 
}: AIStylistChatProps) => {
  const [messages, setMessages] = useState([
    { id: '1', text: "Hi there! I'm Olivia, your AI fashion stylist. How can I help you today?", sender: 'olivia' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), text: input, sender: 'user' }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on your style profile, I'd recommend trying a flowy maxi dress with minimal accessories for a casual summer look.",
        "I think that piece would look amazing on you! Would you like to see some styling suggestions to go with it?",
        "Let me analyze the current trends to help you with that. What's your preferred color palette for this season?",
        "Looking at your wardrobe, I can suggest several outfit combinations using pieces you already own. Would you like me to show you?"
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { id: Date.now().toString(), text: response, sender: 'olivia' }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-900 w-full max-w-md rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2 border-2 border-white/30">
              <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
              <AvatarFallback className="bg-purple-700">OB</AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-white">Olivia - Style Assistant</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 h-96 overflow-y-auto flex flex-col space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'olivia' && (
                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                  <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
                  <AvatarFallback className="bg-purple-700">OB</AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`max-w-[75%] p-3 rounded-xl ${
                  message.sender === 'user' 
                    ? 'bg-purple-600 text-white ml-auto' 
                    : 'bg-slate-800 text-white'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-700 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask Olivia for styling advice..."
            className="bg-slate-800 border-slate-700 text-white"
          />
          <Button onClick={handleSend} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIStylistChat;
