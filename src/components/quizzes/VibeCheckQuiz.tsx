
import { Sparkles, Star, Heart, Coffee } from 'lucide-react';
import { QuizData } from './QuizModal';

const VibeCheckQuiz = (): QuizData => {
  return {
    id: 'vibe-check',
    title: 'Vibe Check',
    description: 'Identify the energy and aesthetic your outfits communicate to others.',
    questions: [
      {
        id: 'vibe',
        text: "What vibe do you want your outfit to give off?",
        options: [
          { id: 'a', label: '"Don\'t mess with me"' },
          { id: 'b', label: '"I\'m the cool girl"' },
          { id: 'c', label: '"I\'m dreamy and kind"' },
          { id: 'd', label: '"I\'m confident, but chill"' }
        ]
      },
      {
        id: 'room',
        text: "You walk into a room. What's your desired effect?",
        options: [
          { id: 'a', label: 'All eyes on me' },
          { id: 'b', label: 'Effortless cool' },
          { id: 'c', label: 'Approachable warmth' },
          { id: 'd', label: 'Mysterious and stylish' }
        ]
      },
      {
        id: 'word',
        text: "Which word fits you best?",
        options: [
          { id: 'a', label: 'Bold' },
          { id: 'b', label: 'Sweet' },
          { id: 'c', label: 'Smart' },
          { id: 'd', label: 'Wild' }
        ]
      },
      {
        id: 'accessory',
        text: "Your favorite accessory is:",
        options: [
          { id: 'a', label: 'Statement earrings' },
          { id: 'b', label: 'Minimal gold chain' },
          { id: 'c', label: 'Chunky boots' },
          { id: 'd', label: 'Oversized sunglasses' }
        ]
      },
      {
        id: 'social',
        text: "What social setting do you thrive in?",
        options: [
          { id: 'a', label: 'Big events or nightlife' },
          { id: 'b', label: 'Cozy hangouts' },
          { id: 'c', label: 'Solo time' },
          { id: 'd', label: 'Creative or artsy spaces' }
        ]
      }
    ],
    getResult: (answers) => {
      const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
      
      Object.values(answers).forEach(answer => {
        if (answer in counts) {
          counts[answer] = (counts[answer] || 0) + 1;
        }
      });
      
      const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      
      const results: Record<string, any> = {
        'a': {
          label: 'Confident Powerhouse',
          description: 'You command attention with bold choices and a fearless approach to fashion. Your strong presence is reflected in statement pieces, structured silhouettes, and an unapologetic style that demands respect.',
          tags: ['Bold', 'Assertive', 'Trend-setter'],
          colors: ['red', 'black', 'gold'],
          recommendations: ['Choose structured blazers and statement accessories', 'Embrace bold colors and patterns', 'Invest in quality power pieces']
        },
        'b': {
          label: 'Effortless Trendsetter',
          description: 'You have that enviable "I just threw this on" cool factor. Your relaxed confidence comes through in perfectly balanced outfits that look unstudied yet put-together, with just the right touch of current trends.',
          tags: ['Relaxed', 'Current', 'Balanced'],
          colors: ['white', 'denim', 'beige'],
          recommendations: ['Mix high and low pieces effortlessly', 'Keep up with current trends subtly', 'Perfect the art of layering']
        },
        'c': {
          label: 'Approachable Dreamer',
          description: 'Your style radiates warmth and thoughtfulness. With soft elements and inviting colors, your outfits create an atmosphere of comfort while still expressing your creative and romantic sensibilities.',
          tags: ['Warm', 'Thoughtful', 'Harmonious'],
          colors: ['pastels', 'cream', 'soft pink'],
          recommendations: ['Choose flowing fabrics and soft textures', 'Embrace romantic details like lace and florals', 'Layer delicate jewelry for added charm']
        },
        'd': {
          label: 'Enigmatic Individualist',
          description: 'Your distinctive style keeps people guessing. You combine unexpected elements with confidence, creating looks that are both intriguing and authentic to your unique perspective on fashion.',
          tags: ['Original', 'Mysterious', 'Boundary-pushing'],
          colors: ['black', 'deep purple', 'forest green'],
          recommendations: ['Mix unexpected textures and patterns', 'Experiment with unique silhouettes', 'Add mysterious elements like dark accessories']
        }
      };
      
      return results[mostCommon] || results['a'];
    }
  };
};

export default VibeCheckQuiz;
