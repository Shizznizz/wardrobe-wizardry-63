
import { useState, useEffect, useCallback } from 'react';
import { AssistantTrigger } from '@/components/outfits/OptimizedOliviaAssistant';
import { Outfit } from '@/lib/types';

interface OliviaAssistantState {
  show: boolean;
  message: string;
  trigger: AssistantTrigger;
  outfit: Outfit | null;
  actionText?: string;
  onAction?: () => void;
}

export function useOliviaAssistant() {
  const [assistantState, setAssistantState] = useState<OliviaAssistantState>({
    show: false,
    message: '',
    trigger: 'manual',
    outfit: null
  });
  
  const [hideTips, setHideTips] = useState(() => {
    // Check if user previously set preference in localStorage
    const savedPreference = localStorage.getItem('olivia-hide-tips');
    return savedPreference === 'true';
  });
  
  const [lastFeedback, setLastFeedback] = useState<string | null>(() => {
    return localStorage.getItem('olivia-last-feedback');
  });
  
  // Save user preferences whenever they change
  useEffect(() => {
    localStorage.setItem('olivia-hide-tips', hideTips.toString());
  }, [hideTips]);
  
  // Save last feedback for personalization
  const saveLastFeedback = useCallback((feedback: string) => {
    localStorage.setItem('olivia-last-feedback', feedback);
    setLastFeedback(feedback);
  }, []);
  
  const closeAssistant = useCallback(() => {
    setAssistantState(prev => ({ ...prev, show: false }));
  }, []);
  
  const showAssistant = useCallback((
    message: string, 
    trigger: AssistantTrigger = 'manual',
    outfit: Outfit | null = null,
    actionText?: string,
    onAction?: () => void
  ) => {
    setAssistantState({
      show: true,
      message,
      trigger,
      outfit,
      actionText,
      onAction
    });
  }, []);
  
  // Show outfit recommendation message
  const showOutfitRecommendation = useCallback((outfit: Outfit, weatherCondition?: string) => {
    let message = `I've picked this ${outfit.name} outfit for you based on your style preferences`;
    
    if (weatherCondition) {
      message += ` and the current ${weatherCondition} weather`;
    }
    
    if (lastFeedback) {
      message += `. Last time, you mentioned you preferred ${lastFeedback} looks.`;
    } else {
      message += `. I think the colors will complement your style beautifully!`;
    }
    
    showAssistant(
      message,
      'outfit-recommendation',
      outfit,
      'Thanks!',
      () => {}
    );
  }, [showAssistant, lastFeedback]);
  
  // Show outfit saved message
  const showOutfitSaved = useCallback((outfit: Outfit) => {
    showAssistant(
      `Great choice! I've saved the ${outfit.name} to your wardrobe. You can access it anytime.`,
      'outfit-saved',
      outfit
    );
  }, [showAssistant]);
  
  // Show feedback response
  const showFeedbackResponse = useCallback((feedbackType: string, outfit: Outfit) => {
    let message = '';
    
    switch (feedbackType) {
      case 'like':
        message = `I'm glad you like the ${outfit.name}! I'll remember your preference for similar styles.`;
        saveLastFeedback('similar');
        break;
      case 'dislike':
        message = `I'll find something different from the ${outfit.name} next time.`;
        saveLastFeedback('different');
        break;
      case 'warmer':
        message = `I'll look for warmer options than the ${outfit.name} that still match your style.`;
        saveLastFeedback('warmer');
        break;
      case 'change-top':
        message = `I'll find a different top to go with this outfit's style.`;
        saveLastFeedback('different tops');
        break;
      default:
        message = `Thanks for your feedback on the ${outfit.name}!`;
    }
    
    showAssistant(
      message,
      'feedback',
      outfit
    );
  }, [showAssistant, saveLastFeedback]);
  
  // Manual summon response
  const summonOlivia = useCallback(() => {
    let message = "Hi there! I'm Olivia, your personal style assistant. How can I help you today?";
    
    if (lastFeedback) {
      message = `Hi there! Based on your previous preference for ${lastFeedback} looks, I've curated some special recommendations for you below.`;
    }
    
    showAssistant(
      message,
      'manual',
      null,
      'Show recommendations',
      () => {}
    );
  }, [showAssistant, lastFeedback]);
  
  return {
    assistantState,
    hideTips,
    setHideTips,
    closeAssistant,
    showAssistant,
    showOutfitRecommendation,
    showOutfitSaved,
    showFeedbackResponse,
    summonOlivia
  };
}
