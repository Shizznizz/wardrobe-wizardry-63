
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  quote: string;
  outfit: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah M.',
    avatar: '/placeholder.svg',
    quote: 'The virtual try-on was spot on! Saved me from making a mistake with sizing.',
    outfit: 'Summer Breeze Collection'
  },
  {
    id: '2',
    name: 'Alex K.',
    avatar: '/placeholder.svg',
    quote: 'Olivia\'s style suggestions are amazing. Found my perfect date night look!',
    outfit: 'Evening Glamour Set'
  },
  {
    id: '3',
    name: 'Emily R.',
    avatar: '/placeholder.svg',
    quote: 'This is like having a personal stylist in your pocket. Game changer!',
    outfit: 'Business Casual Edit'
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((current) => 
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  const previous = () => {
    setCurrentIndex((current) => 
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  return (
    <div className="py-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-center text-lg font-medium text-white/90 mb-8">
          What Our Users Say
        </h3>
        
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20"
            >
              <Quote className="w-8 h-8 text-purple-400/50 mb-4" />
              
              <p className="text-lg text-white/90 italic mb-6">
                "{testimonials[currentIndex].quote}"
              </p>
              
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-purple-500/30">
                  <AvatarImage src={testimonials[currentIndex].avatar} />
                  <AvatarFallback>{testimonials[currentIndex].name[0]}</AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-medium text-white">{testimonials[currentIndex].name}</p>
                  <p className="text-sm text-purple-300">{testimonials[currentIndex].outfit}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              onClick={previous}
              className="pointer-events-auto bg-black/30 rounded-full hover:bg-black/50 text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="pointer-events-auto bg-black/30 rounded-full hover:bg-black/50 text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-purple-500' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
