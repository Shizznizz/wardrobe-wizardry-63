
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sophie Chen',
    role: 'Fashion Blogger',
    quote: 'This app revolutionized my morning routine – I love it! No more staring at my closet wondering what to wear. Olivia seems to understand my style even better than I do sometimes!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    rating: 5
  },
  {
    id: '2',
    name: 'Jessica Miller',
    role: 'Working Professional',
    quote: "The AI styling advice is surprisingly on point! I've discovered so many new outfit combinations from clothes I already owned. The virtual try-on feature has saved me from so many shopping mistakes.",
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    rating: 5
  },
  {
    id: '3',
    name: 'Alex Rodriguez',
    role: 'College Student',
    quote: 'Being able to virtually try on outfits before buying has saved me so much money. This app is a game-changer! My confidence has skyrocketed since I started using the styling recommendations.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    rating: 4
  },
  {
    id: '4',
    name: 'Emma Johnson',
    role: 'Creative Director',
    quote: 'The personalized style recommendations are spot on! Olivia understands my aesthetic better than my friends do. I especially love how it adapts to my changing style preferences over time.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    rating: 5
  },
];

const TestimonialsCarousel = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  return (
    <div className="w-full py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 inline-block mb-6">
          Loved by Style Enthusiasts
        </h2>
        <p className="text-xl text-purple-100/80 max-w-2xl mx-auto">
          Join thousands of fashion lovers who are transforming their style experience with Olivia Bloom.
        </p>
      </motion.div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2 pl-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className={`h-full glass-dark bg-gradient-to-br from-purple-900/30 to-pink-900/20 p-6 rounded-xl border border-white/10 backdrop-blur-md shadow-lg overflow-hidden transition-all duration-300 ${expandedId === testimonial.id ? 'ring-2 ring-pink-500/50' : ''}`}
                onClick={() => toggleExpand(testimonial.id)}
              >
                <div className="relative">
                  <div className="absolute -top-2 -left-2 text-pink-400/20">
                    <Quote className="h-10 w-10" />
                  </div>
                  <div className="pt-4">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-300' : 'text-gray-400'}`} 
                          fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                        />
                      ))}
                    </div>
                    
                    <p className={`text-white/90 relative z-10 ${expandedId === testimonial.id ? '' : 'line-clamp-4'}`}>
                      "{testimonial.quote}"
                    </p>
                    
                    {testimonial.quote.length > 120 && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(testimonial.id);
                        }} 
                        className="text-pink-400 hover:text-pink-300 text-sm mt-2 transition-colors"
                      >
                        {expandedId === testimonial.id ? 'Read less' : 'Read more'}
                      </button>
                    )}
                    
                    <div className="flex items-center mt-6">
                      <Avatar className="h-12 w-12 border-2 border-pink-400/30">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="bg-pink-500 text-white">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <h4 className="font-medium text-white">{testimonial.name}</h4>
                        <p className="text-sm text-pink-300">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="flex justify-center mt-10 gap-4">
          <CarouselPrevious className="relative static left-0 right-auto translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 h-12 w-12" />
          <CarouselNext className="relative static right-0 left-auto translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 h-12 w-12" />
        </div>
      </Carousel>
    </div>
  );
};

export default TestimonialsCarousel;
