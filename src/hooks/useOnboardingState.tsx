
import { useState, useEffect } from 'react';

export function useOnboardingState() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('olivia-onboarding-completed') === 'true';
  });

  const completeOnboarding = () => {
    localStorage.setItem('olivia-onboarding-completed', 'true');
    setHasSeenOnboarding(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('olivia-onboarding-completed');
    setHasSeenOnboarding(false);
  };

  return {
    hasSeenOnboarding,
    completeOnboarding,
    resetOnboarding
  };
}
