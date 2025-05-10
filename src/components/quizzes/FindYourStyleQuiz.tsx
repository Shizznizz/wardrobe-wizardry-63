
import { Star, Check, Sparkles, Heart } from 'lucide-react';
import { QuizData } from './QuizModal';

const FindYourStyleQuiz = (): QuizData => {
  return {
    id: 'find-your-style',
    name: 'Find Your Style',
    questions: [
      {
        id: 'outfit',
        question: "What's your go-to outfit when you're in a rush?",
        options: [
          { id: 'a', label: 'Jeans + graphic tee', icon: Star },
          { id: 'b', label: 'Blazer + slacks', icon: Check },
          { id: 'c', label: 'Flowy dress', icon: Heart },
          { id: 'd', label: 'Oversized hoodie + sneakers', icon: Sparkles }
        ]
      },
      {
        id: 'colors',
        question: "Choose a color palette that speaks to you:",
        options: [
          { id: 'a', label: 'Neutral tones (beige, white, taupe)', icon: Star },
          { id: 'b', label: 'Bold & vibrant (red, fuchsia, cobalt)', icon: Check },
          { id: 'c', label: 'Earthy & calm (moss, terracotta, cream)', icon: Heart },
          { id: 'd', label: 'Monochrome (black, grey, charcoal)', icon: Sparkles }
        ]
      },
      {
        id: 'mood',
        question: "What's your ultimate fashion mood?",
        options: [
          { id: 'a', label: 'Polished & powerful', icon: Star },
          { id: 'b', label: 'Cozy & casual', icon: Check },
          { id: 'c', label: 'Romantic & playful', icon: Heart },
          { id: 'd', label: 'Cool & edgy', icon: Sparkles }
        ]
      },
      {
        id: 'celeb',
        question: "Which celeb's closet would you steal?",
        options: [
          { id: 'a', label: 'Zendaya', icon: Star },
          { id: 'b', label: 'Hailey Bieber', icon: Check },
          { id: 'c', label: 'Bella Hadid', icon: Heart },
          { id: 'd', label: 'Alexa Chung', icon: Sparkles }
        ]
      },
      {
        id: 'fashion',
        question: "Finish the sentence: Fashion should be...",
        options: [
          { id: 'a', label: 'Functional', icon: Star },
          { id: 'b', label: 'Fun', icon: Check },
          { id: 'c', label: 'Fearless', icon: Heart },
          { id: 'd', label: 'Flattering', icon: Sparkles }
        ]
      }
    ],
    getResult: (answers) => {
      // Simple algorithm to determine style type based on most common answer
      const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
      
      Object.values(answers).forEach(answer => {
        counts[answer] = (counts[answer] || 0) + 1;
      });
      
      const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      
      const results = {
        'a': {
          title: 'Classic Minimalist',
          description: 'You prefer timeless pieces with clean lines and neutral palettes. Your wardrobe focuses on quality over quantity, with versatile items that can be mixed and matched effortlessly.',
          traits: ['Sophisticated', 'Refined', 'Quality-focused'],
          value: { styleType: 'Classic Minimalist', mainColors: ['neutral', 'black', 'white'], preferredItems: ['blazers', 'straight-leg pants', 'button-ups'] }
        },
        'b': {
          title: 'Trendy Eclectic',
          description: 'You love experimenting with bold colors, patterns, and the latest fashion trends. Your closet is a vibrant mix of statement pieces that express your outgoing personality.',
          traits: ['Adventurous', 'Colorful', 'Fashion-forward'],
          value: { styleType: 'Trendy Eclectic', mainColors: ['bright', 'pattern', 'contrast'], preferredItems: ['statement jackets', 'printed dresses', 'unique accessories'] }
        },
        'c': {
          title: 'Romantic Bohemian',
          description: 'Your style is dreamy, feminine, and free-spirited. You gravitate toward flowy fabrics, earthy tones, and pieces with delicate details that create a soft, ethereal look.',
          traits: ['Whimsical', 'Nature-inspired', 'Comfortable'],
          value: { styleType: 'Romantic Bohemian', mainColors: ['earth', 'pastels', 'cream'], preferredItems: ['maxi dresses', 'flowy blouses', 'layered jewelry'] }
        },
        'd': {
          title: 'Street Chic',
          description: 'You blend urban edge with modern silhouettes. Your wardrobe has a cool, effortless vibe with statement sneakers, oversized pieces, and a monochromatic color scheme.',
          traits: ['Effortless', 'Confident', 'Contemporary'],
          value: { styleType: 'Street Chic', mainColors: ['black', 'grey', 'white'], preferredItems: ['oversized jackets', 'statement sneakers', 'modern basics'] }
        }
      };
      
      return results[mostCommon];
    }
  };
};

export default FindYourStyleQuiz;
