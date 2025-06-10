
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Upload, Brain, CloudRain, Camera } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your Wardrobe",
      description: "Snap photos of your clothes or let Olivia catalog your existing wardrobe pieces.",
      color: "from-coral-500 to-pink-500"
    },
    {
      number: "02", 
      icon: Brain,
      title: "AI Styling Magic",
      description: "Olivia learns your style preferences and creates personalized outfit combinations.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      number: "03",
      icon: CloudRain,
      title: "Weather Integration",
      description: "Get outfit suggestions that perfectly match your location's weather forecast.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "04",
      icon: Camera,
      title: "Virtual Try-On",
      description: "Preview how outfits look on you before committing to the look for the day.",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 to-slate-950/40 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            How Olivia 
            <span className="bg-gradient-to-r from-coral-400 to-purple-400 bg-clip-text text-transparent">
              {" "}Works Her Magic
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Four simple steps to transform your daily style routine from chaotic to curated.
          </p>
        </motion.div>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10 h-full">
                {/* Gradient Step Number Badge */}
                <div className={`inline-flex items-center justify-center w-16 h-8 rounded-full bg-gradient-to-r ${step.color} text-white font-bold text-sm mb-4`}>
                  {step.number}
                </div>
                
                {/* Icon */}
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} p-4 mb-6`}
                  whileInView={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <step.icon className="h-8 w-8 text-white" />
                </motion.div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.description}</p>
              </div>
              
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-80"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/10 h-full">
                  {/* Gradient Step Number Badge */}
                  <div className={`inline-flex items-center justify-center w-16 h-8 rounded-full bg-gradient-to-r ${step.color} text-white font-bold text-sm mb-4`}>
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${step.color} p-3 mb-4`}
                    whileInView={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Scroll indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {steps.map((_, index) => (
              <div key={index} className="w-2 h-2 rounded-full bg-white/30"></div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;
