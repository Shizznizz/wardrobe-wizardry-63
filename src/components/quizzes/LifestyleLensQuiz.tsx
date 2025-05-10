
import { Briefcase, Star, Coffee, Map } from 'lucide-react';
import { QuizData } from './QuizModal';

const LifestyleLensQuiz = (): QuizData => {
  return {
    id: 'lifestyle-lens',
    name: 'Lifestyle Lens',
    questions: [
      {
        id: 'work',
        question: "What best describes your work or school environment?",
        options: [
          { id: 'a', label: 'Corporate office or formal', icon: Briefcase },
          { id: 'b', label: 'Creative studio or flexible', icon: Star },
          { id: 'c', label: 'Hybrid/remote', icon: Coffee },
          { id: 'd', label: 'Full-time student', icon: Map }
        ]
      },
      {
        id: 'dressup',
        question: "How often do you dress up during the week?",
        options: [
          { id: 'a', label: 'Every day', icon: Briefcase },
          { id: 'b', label: 'A few times', icon: Star },
          { id: 'c', label: 'Only for events', icon: Coffee },
          { id: 'd', label: 'Almost never', icon: Map }
        ]
      },
      {
        id: 'weekend',
        question: "What do weekends usually look like for you?",
        options: [
          { id: 'a', label: 'Brunch, errands, and parties', icon: Briefcase },
          { id: 'b', label: 'Nature, sports, or outdoor adventures', icon: Star },
          { id: 'c', label: 'Netflix, snacks, and chill', icon: Coffee },
          { id: 'd', label: 'Shopping and city trips', icon: Map }
        ]
      },
      {
        id: 'travel',
        question: "How often do you travel or go on getaways?",
        options: [
          { id: 'a', label: 'Monthly', icon: Briefcase },
          { id: 'b', label: 'A few times a year', icon: Star },
          { id: 'c', label: 'Rarely', icon: Coffee },
          { id: 'd', label: 'Constantly on the move', icon: Map }
        ]
      },
      {
        id: 'footwear',
        question: "What's your preferred footwear?",
        options: [
          { id: 'a', label: 'Heels or platforms', icon: Briefcase },
          { id: 'b', label: 'Boots or sneakers', icon: Star },
          { id: 'c', label: 'Sandals or slides', icon: Coffee },
          { id: 'd', label: 'Loafers or ballet flats', icon: Map }
        ]
      }
    ],
    getResult: (answers) => {
      // Simple algorithm to determine lifestyle type based on most common answer
      const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
      
      Object.values(answers).forEach(answer => {
        counts[answer] = (counts[answer] || 0) + 1;
      });
      
      const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      
      const results = {
        'a': {
          title: 'Urban Professional',
          description: 'Your busy city lifestyle calls for a polished wardrobe that transitions from office to evening events seamlessly. You value quality pieces that make a statement while maintaining professionalism.',
          traits: ['Polished', 'Versatile', 'Day-to-night ready'],
          value: { lifestyleType: 'Urban Professional', occasions: ['work', 'formal', 'evening'], clothingFocus: ['tailored', 'versatile', 'statement'] }
        },
        'b': {
          title: 'Active Explorer',
          description: 'You live an energetic lifestyle that balances work and outdoor pursuits. Your wardrobe needs to be versatile enough for creative professional settings while accommodating your love for adventure.',
          traits: ['Adaptable', 'Comfort-focused', 'Weather-ready'],
          value: { lifestyleType: 'Active Explorer', occasions: ['casual', 'outdoor', 'creative-professional'], clothingFocus: ['durable', 'layerable', 'weather-appropriate'] }
        },
        'c': {
          title: 'Homebody Stylist',
          description: 'You prioritize comfort and casual style, with a wardrobe centered around cozy yet put-together looks. You need versatile pieces that work for virtual meetings, casual outings, and relaxed home life.',
          traits: ['Comfortable', 'Low-maintenance', 'Versatile casual'],
          value: { lifestyleType: 'Homebody Stylist', occasions: ['casual', 'virtual', 'lounge'], clothingFocus: ['comfort', 'easy-care', 'mix-and-match'] }
        },
        'd': {
          title: 'Cosmopolitan Nomad',
          description: 'Your on-the-go lifestyle demands a flexible wardrobe of adaptable pieces that can work across multiple settings and climates. You value style that travels well without sacrificing personal expression.',
          traits: ['Adaptable', 'Practical', 'Culturally versatile'],
          value: { lifestyleType: 'Cosmopolitan Nomad', occasions: ['travel', 'multi-purpose', 'urban-casual'], clothingFocus: ['packable', 'versatile', 'mix-and-match'] }
        }
      };
      
      return results[mostCommon];
    }
  };
};

export default LifestyleLensQuiz;
