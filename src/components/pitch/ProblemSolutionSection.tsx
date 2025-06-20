
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { CloudRain, Shirt, Zap, Target } from 'lucide-react';

const ProblemSolutionSection = () => {
  const problems = [
    {
      icon: Shirt,
      title: "Closet Overwhelm",
      description: "You have tons of clothes but nothing feels right to wear"
    },
    {
      icon: CloudRain,
      title: "Weather Mismatches", 
      description: "Always caught off-guard by weather changes and outfit disasters"
    },
    {
      icon: Zap,
      title: "Style Stress",
      description: "Decision fatigue from trying to put together the perfect look daily"
    }
  ];

  const solutions = [
    {
      icon: Target,
      title: "Smart Curation",
      description: "AI analyzes your wardrobe and suggests perfect outfit combinations"
    },
    {
      icon: CloudRain,
      title: "Weather Integration",
      description: "Outfits automatically match your location's weather forecast"
    },
    {
      icon: Zap,
      title: "Effortless Style",
      description: "Get dressed confidently in minutes, not hours"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 to-purple-950/30 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Fashion Frustration? 
            <span className="bg-gradient-to-r from-coral-400 to-purple-400 bg-clip-text text-transparent block">
              We Get It.
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Every morning shouldn't feel like a style crisis. Olivia transforms your fashion chaos into curated confidence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-8 text-coral-400">The Problems</h3>
            <div className="space-y-6">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-6 rounded-2xl bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/20 hover:border-red-400/40 cursor-pointer group transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    boxShadow: "0 10px 25px rgba(239, 68, 68, 0.15)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-all duration-300"
                    whileHover={{ 
                      boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)" 
                    }}
                  >
                    <problem.icon className="h-6 w-6 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors duration-300">{problem.title}</h4>
                    <p className="text-white/70 group-hover:text-white/80 transition-colors duration-300">{problem.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <motion.h3 
                className="text-lg font-medium text-coral-300 mb-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Meet Olivia's Styling Powers
              </motion.h3>
              <h3 className="text-2xl font-bold text-purple-400">The Solutions</h3>
            </div>
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-6 rounded-2xl bg-gradient-to-r from-purple-900/20 to-coral-900/20 border border-purple-500/20 hover:border-purple-400/40 cursor-pointer group transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    boxShadow: "0 10px 25px rgba(168, 85, 247, 0.15)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300"
                    whileHover={{ 
                      boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" 
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 10px rgba(168, 85, 247, 0.2)",
                        "0 0 15px rgba(168, 85, 247, 0.3)",
                        "0 0 10px rgba(168, 85, 247, 0.2)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  >
                    <solution.icon className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors duration-300">{solution.title}</h4>
                    <p className="text-white/70 group-hover:text-white/80 transition-colors duration-300">{solution.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ProblemSolutionSection;
