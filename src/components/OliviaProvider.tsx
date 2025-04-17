
import { ReactNode } from 'react';
import { OliviaProvider as OliviaContextProvider } from '@/contexts/OliviaContext';
import OliviaSmartChat from '@/components/chat/OliviaSmartChat';
import { useOlivia } from '@/contexts/OliviaContext';

interface OliviaProviderProps {
  children: ReactNode;
  isPremiumUser?: boolean;
  onUpgradeToPremium?: () => void;
}

// Helper component to render the chat inside the context
const OliviaChatWithContext = () => {
  const {
    currentOutfit,
    userHasPhoto,
    hasUploadedWardrobe,
    weatherTemp,
    weatherCondition,
    isPremiumUser,
    handleUpgradeToPremium
  } = useOlivia();

  return (
    <OliviaSmartChat
      isPremiumUser={isPremiumUser}
      onUpgradeToPremium={handleUpgradeToPremium}
      currentOutfit={currentOutfit}
      userHasPhoto={userHasPhoto}
      hasUploadedWardrobe={hasUploadedWardrobe}
      weatherTemp={weatherTemp}
      weatherCondition={weatherCondition}
    />
  );
};

// Main provider component
const OliviaProvider = ({ 
  children, 
  isPremiumUser, 
  onUpgradeToPremium 
}: OliviaProviderProps) => {
  return (
    <OliviaContextProvider 
      isPremiumUser={isPremiumUser} 
      onUpgradeToPremium={onUpgradeToPremium}
    >
      {children}
      <OliviaChatWithContext />
    </OliviaContextProvider>
  );
};

export default OliviaProvider;
