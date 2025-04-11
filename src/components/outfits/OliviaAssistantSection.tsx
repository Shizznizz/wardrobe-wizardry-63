
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import AIStylistChat from '@/components/shop-try/AIStylistChat';

interface OliviaAssistantSectionProps {
  onChatClick: () => void;
}

const OliviaAssistantSection = ({ onChatClick }: OliviaAssistantSectionProps) => {
  const [showChat, setShowChat] = useState(false);
  
  const handleChatClick = () => {
    setShowChat(true);
    onChatClick();
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 mb-16"
      >
        <Card className="overflow-hidden bg-gradient-to-r from-slate-800/90 to-slate-900/90 border-purple-500/20">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/3 relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-pink-500/40 mix-blend-overlay"></div>
                <img 
                  src="/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png" 
                  alt="Olivia - Fashion Stylist" 
                  className="w-full h-56 md:h-full object-cover object-center" 
                />
              </div>
              
              <div className="flex-1 p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 border-2 border-purple-500/40 mr-3">
                    <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500">OB</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Olivia</h3>
                    <p className="text-sm text-purple-200/70">Style Advisor</p>
                  </div>
                </div>
                
                <p className="text-white/90 mb-6 text-lg">
                  Need help picking an outfit for today or a special moment coming up? I'm here for you! Let's chat.
                </p>
                
                <Button 
                  onClick={handleChatClick}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat with Olivia
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {showChat && (
        <AIStylistChat
          isPremiumUser={true}
          onUpgradeToPremium={() => {}}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default OliviaAssistantSection;
