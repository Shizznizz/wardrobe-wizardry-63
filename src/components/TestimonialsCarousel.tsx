
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
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
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sophie Chen',
    role: 'Fashion Blogger',
    quote: 'This app revolutionized my morning routine – I love it! No more staring at my closet wondering what to wear.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  },
  {
    id: '2',
    name: 'Jessica Miller',
    role: 'Working Professional',
    quote: "The AI styling advice is surprisingly on point! I've discovered so many new outfit combinations from clothes I already owned.",
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  },
  {
    id: '3',
    name: 'Alex Rodriguez',
    role: 'College Student',
    quote: 'Being able to virtually try on outfits before buying has saved me so much money. This app is a game-changer!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  },
  {
    id: '4',
    name: 'Emma Johnson',
    role: 'Creative Director',
    quote: 'The personalized style recommendations are spot on! Olivia understands my aesthetic better than my friends do.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  },
];

// Remove the props as they're not needed anymore - we use the internal testimonials array
const TestimonialsCarousel = () => {
  return (
    <div className="w-full py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-coral-400 inline-block mb-3">
          What Our Users Say
        </h2>
        <p className="text-purple-100/80 max-w-2xl mx-auto">
          Join thousands of fashion enthusiasts who are transforming their style experience.
        </p>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="h-full glass-dark bg-gradient-to-br from-purple-900/30 to-coral-900/20 p-6 rounded-xl border border-white/10 backdrop-blur-md shadow-lg overflow-hidden"
              >
                <div className="relative">
                  <div className="absolute -top-2 -left-2 text-coral-400/20">
                    <Quote className="h-10 w-10" />
                  </div>
                  <div className="pt-4">
                    <p className="text-white/90 relative z-10 mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center mt-6">
                      <Avatar className="h-12 w-12 border-2 border-coral-400/30">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="bg-coral-500 text-white">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <h4 className="font-medium text-white">{testimonial.name}</h4>
                        <p className="text-sm text-coral-300">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="flex justify-center mt-8 gap-2">
          <CarouselPrevious className="relative static left-0 right-auto translate-y-0 bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30" />
          <CarouselNext className="relative static right-0 left-auto translate-y-0 bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30" />
        </div>
      </Carousel>
    </div>
  );
};

export default TestimonialsCarousel;
