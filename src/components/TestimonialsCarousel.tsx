
import React from "react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jessica M.",
    location: "Paris",
    occupation: "Fashion Buyer",
    age: 32,
    avatar: "/lovable-uploads/075a98ab-d879-4919-8898-87590f8f919a.png",
    quote: "Olivia transformed my wardrobe. I've never received so many compliments on my outfits before!"
  },
  {
    name: "Emma L.",
    location: "New York",
    occupation: "Marketing Director",
    age: 28,
    avatar: "/lovable-uploads/510dbdf2-837f-4649-8da3-bd06977fa677.png",
    quote: "I've saved so much time getting dressed in the mornings. Olivia's outfit recommendations are always perfect for my day."
  },
  {
    name: "Sophie T.",
    location: "London",
    occupation: "Creative Designer",
    age: 34,
    avatar: "/lovable-uploads/2551cee7-6f38-4c04-b656-16c188b19ace.png",
    quote: "The try-on feature is amazing! I can see how clothes look on me before ordering them online."
  }
];

const TestimonialsCarousel = () => {
  return (
    <section className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/5 to-purple-700/5 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Loved by Style Enthusiasts
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 text-yellow-300 fill-yellow-300" />
            ))}
          </div>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            See what our users have to say about their experience with Olivia.
          </p>
        </motion.div>

        <Carousel
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 pl-4">
                <motion.div 
                  className="backdrop-blur-sm bg-slate-800/50 border border-white/10 rounded-xl p-6 md:p-8 h-full shadow-lg relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full"></div>
                  
                  <div className="mb-6 flex items-center">
                    <Avatar className="h-14 w-14 border-2 border-white/10 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600">
                        {testimonial.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-white">{testimonial.name}</h3>
                      <p className="text-sm text-white/70">{testimonial.age}, {testimonial.location} – {testimonial.occupation}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-2 -top-3 text-3xl text-purple-400 opacity-50">"</div>
                    <p className="text-white/90 relative z-10 italic pl-4">
                      {testimonial.quote}
                    </p>
                    <div className="absolute -right-2 bottom-0 text-3xl text-purple-400 opacity-50">"</div>
                  </div>

                  <div className="flex mt-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                    ))}
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden md:flex justify-center mt-8 gap-4">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
