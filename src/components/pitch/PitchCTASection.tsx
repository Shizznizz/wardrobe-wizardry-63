
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PitchCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 to-slate-950/60 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-8">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center space-x-2 text-coral-400">
                <Sparkles className="h-6 w-6" />
                <span className="text-sm font-medium tracking-wider uppercase">Ready to Transform Your Style?</span>
                <Sparkles className="h-6 w-6" />
              </div>
              
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Perfect Outfit is Just 
                <span className="bg-gradient-to-r from-coral-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}One Click Away
                </span>
              </h2>
              
              <p className="text-xl lg:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                Join thousands of style-conscious individuals who wake up confident, 
                knowing their perfect outfit is already waiting for them.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-coral-500 to-coral-400 hover:from-coral-400 hover:to-coral-300 text-white shadow-xl hover:shadow-coral transition-all duration-300 text-xl px-12 py-6 group"
                onClick={() => navigate('/')}
              >
                Start Your Style Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 hover:bg-white/10 text-white text-xl px-12 py-6"
                onClick={() => navigate('/find-your-style')}
              >
                Take a Style Quiz
              </Button>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-white/60 text-sm">
                Free to start • No credit card required • Join 50,000+ users
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default PitchCTASection;
