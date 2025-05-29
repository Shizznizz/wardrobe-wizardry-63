
import { Briefcase, Star, Coffee, Map } from 'lucide-react';
import { QuizData } from './QuizModal';

const LifestyleLensQuiz = (): QuizData => {
  return {
    id: 'lifestyle-lens',
    title: 'Lifestyle Lens',
    description: 'See how your daily activities and lifestyle influence your ideal wardrobe.',
    questions: [
      {
        id: 'work',
        text: "What best describes your work or school environment?",
        options: [
          { id: 'a', label: 'Corporate office or formal' },
          { id: 'b', label: 'Creative studio or flexible' },
          { id: 'c', label: 'Hybrid/remote' },
          { id: 'd', label: 'Full-time student' }
        ]
      },
      {
        id: 'dressup',
        text: "How often do you dress up during the week?",
        options: [
          { id: 'a', label: 'Every day' },
          { id: 'b', label: 'A few times' },
          { id: 'c', label: 'Only for events' },
          { id: 'd', label: 'Almost never' }
        ]
      },
      {
        id: 'weekend',
        text: "What do weekends usually look like for you?",
        options: [
          { id: 'a', label: 'Brunch, errands, and parties' },
          { id: 'b', label: 'Nature, sports, or outdoor adventures' },
          { id: 'c', label: 'Netflix, snacks, and chill' },
          { id: 'd', label: 'Shopping and city trips' }
        ]
      },
      {
        id: 'travel',
        text: "How often do you travel or go on getaways?",
        options: [
          { id: 'a', label: 'Monthly' },
          { id: 'b', label: 'A few times a year' },
          { id: 'c', label: 'Rarely' },
          { id: 'd', label: 'Constantly on the move' }
        ]
      },
      {
        id: 'footwear',
        text: "What's your preferred footwear?",
        options: [
          { id: 'a', label: 'Heels or platforms' },
          { id: 'b', label: 'Boots or sneakers' },
          { id: 'c', label: 'Sandals or slides' },
          { id: 'd', label: 'Loafers or ballet flats' }
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
          label: 'Urban Professional',
          description: 'Your busy city lifestyle calls for a polished wardrobe that transitions from office to evening events seamlessly. You value quality pieces that make a statement while maintaining professionalism.',
          tags: ['Polished', 'Versatile', 'Day-to-night ready'],
          colors: ['navy', 'black', 'white', 'camel'],
          lifestyle: ['work', 'formal', 'evening'],
          recommendations: ['Invest in versatile blazers that work day to night', 'Choose quality work-appropriate basics', 'Add statement accessories for evening transitions']
        },
        'b': {
          label: 'Active Explorer',
          description: 'You live an energetic lifestyle that balances work and outdoor pursuits. Your wardrobe needs to be versatile enough for creative professional settings while accommodating your love for adventure.',
          tags: ['Adaptable', 'Comfort-focused', 'Weather-ready'],
          colors: ['olive', 'denim', 'earth tones'],
          lifestyle: ['casual', 'outdoor', 'creative-professional'],
          recommendations: ['Choose durable, weather-appropriate fabrics', 'Invest in quality outerwear for all seasons', 'Mix athletic-inspired pieces with casual wear']
        },
        'c': {
          label: 'Homebody Stylist',
          description: 'You prioritize comfort and casual style, with a wardrobe centered around cozy yet put-together looks. You need versatile pieces that work for virtual meetings, casual outings, and relaxed home life.',
          tags: ['Comfortable', 'Low-maintenance', 'Versatile casual'],
          colors: ['neutrals', 'soft pastels', 'cozy knits'],
          lifestyle: ['casual', 'virtual', 'lounge'],
          recommendations: ['Invest in comfortable yet polished loungewear', 'Choose pieces that work for video calls', 'Focus on soft, comfortable fabrics']
        },
        'd': {
          label: 'Cosmopolitan Nomad',
          description: 'Your on-the-go lifestyle demands a flexible wardrobe of adaptable pieces that can work across multiple settings and climates. You value style that travels well without sacrificing personal expression.',
          tags: ['Adaptable', 'Practical', 'Culturally versatile'],
          colors: ['black', 'white', 'versatile neutrals'],
          lifestyle: ['travel', 'multi-purpose', 'urban-casual'],
          recommendations: ['Choose wrinkle-resistant, packable fabrics', 'Invest in versatile layers for different climates', 'Focus on mix-and-match pieces']
        }
      };
      
      return results[mostCommon] || results['a'];
    }
  };
};

export default LifestyleLensQuiz;
