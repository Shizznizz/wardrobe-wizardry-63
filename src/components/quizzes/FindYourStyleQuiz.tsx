
import { Star, Check, Sparkles, Heart } from 'lucide-react';
import { QuizData } from './QuizModal';

const FindYourStyleQuiz = (): QuizData => {
  return {
    id: 'find-your-style',
    title: 'Find Your Style',
    description: 'Discover fashion styles that complement your unique personality and preferences.',
    questions: [
      {
        id: 'outfit',
        text: "What's your go-to outfit when you're in a rush?",
        options: [
          { id: 'a', label: 'Jeans + graphic tee' },
          { id: 'b', label: 'Blazer + slacks' },
          { id: 'c', label: 'Flowy dress' },
          { id: 'd', label: 'Oversized hoodie + sneakers' }
        ]
      },
      {
        id: 'colors',
        text: "Choose a color palette that speaks to you:",
        options: [
          { id: 'a', label: 'Neutral tones (beige, white, taupe)' },
          { id: 'b', label: 'Bold & vibrant (red, fuchsia, cobalt)' },
          { id: 'c', label: 'Earthy & calm (moss, terracotta, cream)' },
          { id: 'd', label: 'Monochrome (black, grey, charcoal)' }
        ]
      },
      {
        id: 'mood',
        text: "What's your ultimate fashion mood?",
        options: [
          { id: 'a', label: 'Polished & powerful' },
          { id: 'b', label: 'Cozy & casual' },
          { id: 'c', label: 'Romantic & playful' },
          { id: 'd', label: 'Cool & edgy' }
        ]
      },
      {
        id: 'celeb',
        text: "Which celeb's closet would you steal?",
        options: [
          { id: 'a', label: 'Zendaya' },
          { id: 'b', label: 'Hailey Bieber' },
          { id: 'c', label: 'Bella Hadid' },
          { id: 'd', label: 'Alexa Chung' }
        ]
      },
      {
        id: 'fashion',
        text: "Finish the sentence: Fashion should be...",
        options: [
          { id: 'a', label: 'Functional' },
          { id: 'b', label: 'Fun' },
          { id: 'c', label: 'Fearless' },
          { id: 'd', label: 'Flattering' }
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
          label: 'Classic Minimalist',
          description: 'You prefer timeless pieces with clean lines and neutral palettes. Your wardrobe focuses on quality over quantity, with versatile items that can be mixed and matched effortlessly.',
          tags: ['Sophisticated', 'Refined', 'Quality-focused'],
          colors: ['neutral', 'black', 'white'],
          recommendations: ['Invest in quality basics in neutral colors', 'Choose timeless silhouettes over trendy pieces', 'Focus on fit and fabric quality']
        },
        'b': {
          label: 'Trendy Eclectic',
          description: 'You love experimenting with bold colors, patterns, and the latest fashion trends. Your closet is a vibrant mix of statement pieces that express your outgoing personality.',
          tags: ['Adventurous', 'Colorful', 'Fashion-forward'],
          colors: ['bright', 'pattern', 'contrast'],
          recommendations: ['Stay updated with current fashion trends', 'Mix patterns and textures boldly', 'Invest in statement accessories']
        },
        'c': {
          label: 'Romantic Bohemian',
          description: 'Your style is dreamy, feminine, and free-spirited. You gravitate toward flowy fabrics, earthy tones, and pieces with delicate details that create a soft, ethereal look.',
          tags: ['Whimsical', 'Nature-inspired', 'Comfortable'],
          colors: ['earth', 'pastels', 'cream'],
          recommendations: ['Choose flowing fabrics like chiffon and silk', 'Add romantic details like lace and embroidery', 'Layer delicate jewelry for a bohemian touch']
        },
        'd': {
          label: 'Street Chic',
          description: 'You blend urban edge with modern silhouettes. Your wardrobe has a cool, effortless vibe with statement sneakers, oversized pieces, and a monochromatic color scheme.',
          tags: ['Effortless', 'Confident', 'Contemporary'],
          colors: ['black', 'grey', 'white'],
          recommendations: ['Invest in quality streetwear basics', 'Mix oversized and fitted pieces', 'Add edgy accessories like chunky sneakers']
        }
      };
      
      return results[mostCommon] || results['a'];
    }
  };
};

export default FindYourStyleQuiz;
