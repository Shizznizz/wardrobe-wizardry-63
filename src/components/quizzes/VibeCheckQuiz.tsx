
import { Sparkles, Star, Heart, Coffee } from 'lucide-react';
import { QuizData } from './QuizModal';

const VibeCheckQuiz = (): QuizData => {
  return {
    id: 'vibe-check',
    name: 'Vibe Check',
    questions: [
      {
        id: 'vibe',
        question: "What vibe do you want your outfit to give off?",
        options: [
          { id: 'a', label: '"Don\'t mess with me"', icon: Star },
          { id: 'b', label: '"I\'m the cool girl"', icon: Sparkles },
          { id: 'c', label: '"I\'m dreamy and kind"', icon: Heart },
          { id: 'd', label: '"I\'m confident, but chill"', icon: Coffee }
        ]
      },
      {
        id: 'room',
        question: "You walk into a room. What's your desired effect?",
        options: [
          { id: 'a', label: 'All eyes on me', icon: Star },
          { id: 'b', label: 'Effortless cool', icon: Sparkles },
          { id: 'c', label: 'Approachable warmth', icon: Heart },
          { id: 'd', label: 'Mysterious and stylish', icon: Coffee }
        ]
      },
      {
        id: 'word',
        question: "Which word fits you best?",
        options: [
          { id: 'a', label: 'Bold', icon: Star },
          { id: 'b', label: 'Sweet', icon: Sparkles },
          { id: 'c', label: 'Smart', icon: Heart },
          { id: 'd', label: 'Wild', icon: Coffee }
        ]
      },
      {
        id: 'accessory',
        question: "Your favorite accessory is:",
        options: [
          { id: 'a', label: 'Statement earrings', icon: Star },
          { id: 'b', label: 'Minimal gold chain', icon: Sparkles },
          { id: 'c', label: 'Chunky boots', icon: Heart },
          { id: 'd', label: 'Oversized sunglasses', icon: Coffee }
        ]
      },
      {
        id: 'social',
        question: "What social setting do you thrive in?",
        options: [
          { id: 'a', label: 'Big events or nightlife', icon: Star },
          { id: 'b', label: 'Cozy hangouts', icon: Sparkles },
          { id: 'c', label: 'Solo time', icon: Heart },
          { id: 'd', label: 'Creative or artsy spaces', icon: Coffee }
        ]
      }
    ],
    getResult: (answers) => {
      // Simple algorithm to determine vibe based on most common answer
      const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
      
      Object.values(answers).forEach(answer => {
        counts[answer] = (counts[answer] || 0) + 1;
      });
      
      const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      
      const results = {
        'a': {
          title: 'Confident Powerhouse',
          description: 'You command attention with bold choices and a fearless approach to fashion. Your strong presence is reflected in statement pieces, structured silhouettes, and an unapologetic style that demands respect.',
          traits: ['Bold', 'Assertive', 'Trend-setter'],
          value: { vibeProfile: 'Confident Powerhouse', energyLevel: 'high', expressionStyle: 'bold', keyElements: ['structure', 'statement', 'power'] }
        },
        'b': {
          title: 'Effortless Trendsetter',
          description: 'You have that enviable "I just threw this on" cool factor. Your relaxed confidence comes through in perfectly balanced outfits that look unstudied yet put-together, with just the right touch of current trends.',
          traits: ['Relaxed', 'Current', 'Balanced'],
          value: { vibeProfile: 'Effortless Trendsetter', energyLevel: 'medium', expressionStyle: 'cool', keyElements: ['balance', 'texture', 'proportion'] }
        },
        'c': {
          title: 'Approachable Dreamer',
          description: 'Your style radiates warmth and thoughtfulness. With soft elements and inviting colors, your outfits create an atmosphere of comfort while still expressing your creative and romantic sensibilities.',
          traits: ['Warm', 'Thoughtful', 'Harmonious'],
          value: { vibeProfile: 'Approachable Dreamer', energyLevel: 'gentle', expressionStyle: 'soft', keyElements: ['comfort', 'flow', 'texture'] }
        },
        'd': {
          title: 'Enigmatic Individualist',
          description: 'Your distinctive style keeps people guessing. You combine unexpected elements with confidence, creating looks that are both intriguing and authentic to your unique perspective on fashion.',
          traits: ['Original', 'Mysterious', 'Boundary-pushing'],
          value: { vibeProfile: 'Enigmatic Individualist', energyLevel: 'variable', expressionStyle: 'eclectic', keyElements: ['contrast', 'surprise', 'depth'] }
        }
      };
      
      return results[mostCommon];
    }
  };
};

export default VibeCheckQuiz;
