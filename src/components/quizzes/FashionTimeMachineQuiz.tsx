
import { Star, Sparkles, Heart, Coffee } from 'lucide-react';
import { QuizData } from './QuizModal';

const FashionTimeMachineQuiz = (): QuizData => {
  return {
    id: 'fashion-time-machine',
    title: 'Fashion Time Machine',
    description: 'Explore which fashion eras resonate with your personal style.',
    questions: [
      {
        id: 'decade',
        text: "What fashion decade speaks to you most?",
        options: [
          { id: 'a', label: '60s mod' },
          { id: 'b', label: '70s boho' },
          { id: 'c', label: '90s minimalism' },
          { id: 'd', label: '2000s Y2K' }
        ]
      },
      {
        id: 'regret',
        text: "What was your biggest childhood fashion regret?",
        options: [
          { id: 'a', label: 'Velcro sneakers' },
          { id: 'b', label: 'Butterfly clips' },
          { id: 'c', label: 'Neon everything' },
          { id: 'd', label: 'Low-rise jeans' }
        ]
      },
      {
        id: 'nostalgic',
        text: "Pick a nostalgic fashion piece you'd still wear today:",
        options: [
          { id: 'a', label: 'Denim jacket' },
          { id: 'b', label: 'Slip dress' },
          { id: 'c', label: 'Cargo pants' },
          { id: 'd', label: 'Platform shoes' }
        ]
      },
      {
        id: 'highschool',
        text: "How would your high school self describe your current style?",
        options: [
          { id: 'a', label: '"Glow-up level: 100"' },
          { id: 'b', label: '"Cooler than I imagined"' },
          { id: 'c', label: '"Surprisingly the same"' },
          { id: 'd', label: '"What happened to me?!"' }
        ]
      },
      {
        id: 'song',
        text: "What song defines your fashion era?",
        options: [
          { id: 'a', label: 'Britney Spears – Toxic' },
          { id: 'b', label: 'Rihanna – Umbrella' },
          { id: 'c', label: 'TLC – No Scrubs' },
          { id: 'd', label: 'Spice Girls – Wannabe' }
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
          label: 'Retro Modern Fusionist',
          description: 'You skillfully blend iconic vintage elements with contemporary style. Your wardrobe honors fashion history while remaining firmly planted in the present, creating a timeless yet fresh aesthetic.',
          tags: ['Historically informed', 'Selective adaptation', 'Contemporary twist'],
          colors: ['vintage-inspired', 'classic combinations'],
          recommendations: ['Mix vintage pieces with modern silhouettes', 'Study fashion history for inspiration', 'Invest in timeless pieces with a modern twist']
        },
        'b': {
          label: '70s Bohemian Revivalist',
          description: 'Your style channels the free-spirited essence of 70s fashion with a modern sensibility. You gravitate toward flowing silhouettes, natural materials, and a relaxed approach that honors vintage bohemian aesthetics.',
          tags: ['Earth-inspired', 'Free-spirited', 'Romantically nostalgic'],
          colors: ['earth tones', 'warm browns', 'burnt orange'],
          recommendations: ['Embrace flowing fabrics and natural textures', 'Layer vintage-inspired jewelry', 'Choose pieces with bohemian details']
        },
        'c': {
          label: '90s Minimalist Enthusiast',
          description: 'You appreciate the clean lines and understated cool of 90s minimalism. Your style incorporates sleek silhouettes, thoughtful basics, and an effortless approach that balances nostalgia with modern simplicity.',
          tags: ['Clean aesthetic', 'Understated', 'Thoughtfully simple'],
          colors: ['monochrome', 'neutral palette', 'black and white'],
          recommendations: ['Focus on clean lines and minimal details', 'Invest in quality basics in neutral colors', 'Choose understated, timeless pieces']
        },
        'd': {
          label: 'Y2K Trend Revivalist',
          description: "You embrace the playful experimentation of Y2K fashion with a contemporary twist. Your bold choices in color, texture, and silhouette create a style that is both nostalgically fun and refreshingly current.",
          tags: ['Experimentally bold', 'Playfully ironic', 'Confident reinvention'],
          colors: ['metallics', 'bright colors', 'futuristic tones'],
          recommendations: ['Experiment with metallic fabrics and bold colors', 'Mix futuristic elements with everyday pieces', 'Embrace playful, statement accessories']
        }
      };
      
      return results[mostCommon] || results['a'];
    }
  };
};

export default FashionTimeMachineQuiz;
