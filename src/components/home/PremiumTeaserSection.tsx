
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PremiumTeaserSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <Button 
            onClick={() => navigate('/premium')}
            className="bg-gradient-to-r from-yellow-500 to-amber-400 text-slate-900 font-semibold px-10 py-6 rounded-lg shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
          >
            Want to learn more about our premium features?
          </Button>
          
          <p className="text-white/70 mt-4 text-sm">
            Get exclusive styling perks, early access, and more
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumTeaserSection;
