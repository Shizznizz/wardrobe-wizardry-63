
import { Star, Sparkles, Heart, Coffee } from 'lucide-react';
import { QuizData } from './QuizModal';

const FashionTimeMachineQuiz = (): QuizData => {
  return {
    id: 'fashion-time-machine',
    name: 'Fashion Time Machine',
    questions: [
      {
        id: 'decade',
        question: "What fashion decade speaks to you most?",
        options: [
          { id: 'a', label: '60s mod', icon: Star },
          { id: 'b', label: '70s boho', icon: Sparkles },
          { id: 'c', label: '90s minimalism', icon: Heart },
          { id: 'd', label: '2000s Y2K', icon: Coffee }
        ]
      },
      {
        id: 'regret',
        question: "What was your biggest childhood fashion regret?",
        options: [
          { id: 'a', label: 'Velcro sneakers', icon: Star },
          { id: 'b', label: 'Butterfly clips', icon: Sparkles },
          { id: 'c', label: 'Neon everything', icon: Heart },
          { id: 'd', label: 'Low-rise jeans', icon: Coffee }
        ]
      },
      {
        id: 'nostalgic',
        question: "Pick a nostalgic fashion piece you'd still wear today:",
        options: [
          { id: 'a', label: 'Denim jacket', icon: Star },
          { id: 'b', label: 'Slip dress', icon: Sparkles },
          { id: 'c', label: 'Cargo pants', icon: Heart },
          { id: 'd', label: 'Platform shoes', icon: Coffee }
        ]
      },
      {
        id: 'highschool',
        question: "How would your high school self describe your current style?",
        options: [
          { id: 'a', label: '"Glow-up level: 100"', icon: Star },
          { id: 'b', label: '"Cooler than I imagined"', icon: Sparkles },
          { id: 'c', label: '"Surprisingly the same"', icon: Heart },
          { id: 'd', label: '"What happened to me?!"', icon: Coffee }
        ]
      },
      {
        id: 'song',
        question: "What song defines your fashion era?",
        options: [
          { id: 'a', label: 'Britney Spears – Toxic', icon: Star },
          { id: 'b', label: 'Rihanna – Umbrella', icon: Sparkles },
          { id: 'c', label: 'TLC – No Scrubs', icon: Heart },
          { id: 'd', label: 'Spice Girls – Wannabe', icon: Coffee }
        ]
      }
    ],
    getResult: (answers) => {
      // Simple algorithm to determine style history based on most common answer
      const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
      
      Object.values(answers).forEach(answer => {
        counts[answer] = (counts[answer] || 0) + 1;
      });
      
      const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      
      const results = {
        'a': {
          title: 'Retro Modern Fusionist',
          description: 'You skillfully blend iconic vintage elements with contemporary style. Your wardrobe honors fashion history while remaining firmly planted in the present, creating a timeless yet fresh aesthetic.',
          traits: ['Historically informed', 'Selective adaptation', 'Contemporary twist'],
          value: { styleHistory: 'Retro Modern Fusionist', eraInfluences: ['60s', 'early 2000s'], revivalElements: ['structured shapes', 'pop culture references', 'statement accessories'] }
        },
        'b': {
          title: '70s Bohemian Revivalist',
          description: 'Your style channels the free-spirited essence of 70s fashion with a modern sensibility. You gravitate toward flowing silhouettes, natural materials, and a relaxed approach that honors vintage bohemian aesthetics.',
          traits: ['Earth-inspired', 'Free-spirited', 'Romantically nostalgic'],
          value: { styleHistory: '70s Bohemian Revivalist', eraInfluences: ['70s', 'early 2010s'], revivalElements: ['natural materials', 'flowing silhouettes', 'earthy palette'] }
        },
        'c': {
          title: '90s Minimalist Enthusiast',
          description: 'You appreciate the clean lines and understated cool of 90s minimalism. Your style incorporates sleek silhouettes, thoughtful basics, and an effortless approach that balances nostalgia with modern simplicity.',
          traits: ['Clean aesthetic', 'Understated', 'Thoughtfully simple'],
          value: { styleHistory: '90s Minimalist Enthusiast', eraInfluences: ['90s', 'early 2020s'], revivalElements: ['monochrome', 'clean lines', 'quality basics'] }
        },
        'd': {
          title: 'Y2K Trend Revivalist',
          description: "You embrace the playful experimentation of Y2K fashion with a contemporary twist. Your bold choices in color, texture, and silhouette create a style that is both nostalgically fun and refreshingly current.",
          traits: ['Experimentally bold', 'Playfully ironic', 'Confident reinvention'],
          value: { styleHistory: 'Y2K Trend Revivalist', eraInfluences: ['early 2000s', '2020s'], revivalElements: ['bold colors', 'mixed textures', 'statement accessories'] }
        }
      };
      
      return results[mostCommon];
    }
  };
};

export default FashionTimeMachineQuiz;
