
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useShowroomPopups = (isPremiumUser: boolean, isAuthenticated: boolean, userPhoto: string | null, finalImage: string | null) => {
  const [showTips, setShowTips] = useState(true);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [showOliviaImageGallery, setShowOliviaImageGallery] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(false);

  useEffect(() => {
    if (userPhoto && finalImage && !isPremiumUser && !isAuthenticated) {
      const hasSeenPopup = sessionStorage.getItem('hasSeenSubscriptionPopup');
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setShowSubscriptionPopup(true);
          sessionStorage.setItem('hasSeenSubscriptionPopup', 'true');
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [userPhoto, finalImage, isPremiumUser, isAuthenticated]);

  const handleUpgradeToPremium = () => {
    toast.success('Redirecting to premium subscription page');
    setShowSubscriptionPopup(false);
  };

  const handleShowPremiumPopup = () => {
    setShowSubscriptionPopup(true);
  };

  const handleCloseSubscriptionPopup = () => {
    setShowSubscriptionPopup(false);
  };

  return {
    showTips,
    showSubscriptionPopup,
    showOliviaImageGallery,
    showStatusBar,
    setShowTips,
    setShowSubscriptionPopup,
    setShowOliviaImageGallery,
    setShowStatusBar,
    handleUpgradeToPremium,
    handleShowPremiumPopup,
    handleCloseSubscriptionPopup
  };
};
