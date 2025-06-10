
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face",
      content: "Olivia completely transformed my morning routine. I used to spend 30 minutes staring at my closet - now I'm dressed and confident in 5 minutes!",
      rating: 5
    },
    {
      name: "Jessica Taylor",
      role: "Fashion Blogger",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      content: "As someone who writes about fashion, I'm impressed by how well Olivia understands style nuances. It's like having a personal stylist 24/7.",
      rating: 5
    },
    {
      name: "Maya Patel",
      role: "Creative Professional",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
      content: "The weather integration is genius! No more being caught in the rain wearing the wrong outfit. Olivia always keeps me weather-appropriate and stylish.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            What Style Lovers 
            <span className="bg-gradient-to-r from-coral-400 to-purple-400 bg-clip-text text-transparent">
              {" "}Are Saying
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Join thousands of fashion-forward individuals who've discovered their perfect style with Olivia.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-coral-400 mb-6" />
              
              {/* Content */}
              <p className="text-white/80 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-coral-400 text-coral-400" />
                ))}
              </div>
              
              {/* Author */}
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-white/60">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;
