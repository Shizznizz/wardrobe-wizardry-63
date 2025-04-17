
import { useState } from 'react';
import OliviaSmartChat from '@/components/chat/OliviaSmartChat';

interface FloatingOliviaWidgetProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
  onOpenChat?: () => void;
  currentOutfit?: any;
  userHasPhoto?: boolean;
  hasUploadedWardrobe?: boolean;
  weatherTemp?: number;
  weatherCondition?: string;
}

const FloatingOliviaWidget = ({ 
  isPremiumUser, 
  onUpgradeToPremium,
  onOpenChat,
  currentOutfit,
  userHasPhoto,
  hasUploadedWardrobe,
  weatherTemp,
  weatherCondition
}: FloatingOliviaWidgetProps) => {
  // We're now simply using the OliviaSmartChat component
  return (
    <OliviaSmartChat
      isPremiumUser={isPremiumUser}
      onUpgradeToPremium={onUpgradeToPremium}
      currentOutfit={currentOutfit}
      userHasPhoto={userHasPhoto}
      hasUploadedWardrobe={hasUploadedWardrobe}
      weatherTemp={weatherTemp}
      weatherCondition={weatherCondition}
    />
  );
};

export default FloatingOliviaWidget;
