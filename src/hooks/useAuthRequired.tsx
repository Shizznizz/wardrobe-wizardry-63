
import { useState } from 'react';
import { useAuth } from './useAuth';

/**
 * A hook that helps handle authentication requirements for features
 * Returns controls for showing an auth required modal and checking auth status
 */
export const useAuthRequired = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  /**
   * Check if a user is authenticated and show auth modal if not
   * @returns Boolean indicating if user is authenticated
   */
  const checkAuthAndShowModal = (): boolean => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };
  
  /**
   * Execute a callback function only if user is authenticated
   * Otherwise show the auth modal
   * @param callback Function to execute if authenticated
   */
  const executeIfAuthenticated = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      setShowAuthModal(true);
    }
  };
  
  return {
    isAuthenticated,
    showAuthModal,
    setShowAuthModal,
    checkAuthAndShowModal,
    executeIfAuthenticated,
  };
};
