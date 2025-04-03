
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import OliviaChatDialog from './OliviaChatDialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface OliviaChatTriggerProps {
  buttonText?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 
    'ghost' | 'link' | 'pill' | 'gradient' | 'olivia-primary' | 
    'olivia-outline' | 'olivia-accent' | 'hero-primary' | 
    'hero-secondary' | 'fashion-primary' | 'fashion-secondary' | 'fashion-tertiary';
  className?: string;
}

const OliviaChatTrigger = ({ 
  buttonText = "Chat with Olivia",
  buttonVariant = "default",
  className = ""
}: OliviaChatTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleOpenChat = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to chat with Olivia Bloom, your personal style advisor",
        variant: "default",
      });
      navigate('/auth');
      return;
    }
    
    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant={buttonVariant as any}
        onClick={handleOpenChat}
        size={isMobile ? "sm" : "default"}
        className={`${className} ${isMobile ? 'py-2' : ''}`}
      >
        <MessageCircle className={`${isMobile ? 'mr-1' : 'mr-2'} h-4 w-4`} />
        {isMobile && buttonText.length > 10 ? "Chat" : buttonText}
      </Button>
      
      <OliviaChatDialog 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};

export default OliviaChatTrigger;
