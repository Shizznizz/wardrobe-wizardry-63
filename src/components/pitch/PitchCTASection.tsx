
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-coral-500 to-coral-400 hover:from-coral-400 hover:to-coral-300 text-white shadow-xl text-xl px-12 py-6 group relative overflow-hidden transition-all duration-300"
                  onClick={() => navigate('/')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(252, 114, 114, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                  }}
                >
                  {/* Glowing border animation */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                       style={{
                         background: 'linear-gradient(45deg, transparent, rgba(252, 114, 114, 0.3), transparent)',
                         animation: 'glow-rotate 2s linear infinite'
                       }}></div>
                  
                  <span className="relative z-10 flex items-center">
                    Start Your Style Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
              
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
                Free to use • No credit card needed • Join 50,000+ confident users
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Container>

      {/* Add keyframes for glow animation */}
      <style jsx>{`
        @keyframes glow-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default PitchCTASection;
