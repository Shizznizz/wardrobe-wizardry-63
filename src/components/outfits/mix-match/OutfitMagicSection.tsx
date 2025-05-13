
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import OutfitMagicDialog from './OutfitMagicDialog';
import OptimizedImage from '@/components/ui/optimized-image';

const OutfitMagicSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section className="py-16 relative bg-slate-900">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/background-pattern.svg')] bg-repeat opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-slate-900/60 to-slate-950/80"></div>
      
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Olivia Image with Glow Effect */}
          <div className="relative w-full md:w-2/5 order-2 md:order-1">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
            <div className="relative z-10">
              <OptimizedImage
                src="/lovable-uploads/80d1f035-48ba-42c0-af4e-6af7f81c2bb8.png"
                alt="Olivia, your fashion assistant"
                className="rounded-lg"
                objectFit="cover"
              />
            </div>
          </div>
          
          {/* Text and CTA Content */}
          <div className="w-full md:w-3/5 text-center md:text-left order-1 md:order-2">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-full">
                <Wand2 className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready for a Little Outfit Magic? ✨
            </h2>
            
            <p className="text-lg mb-8 text-slate-200">
              Olivia's here to help you craft your next look—based on your mood, plans, and favorite pieces. Let's build something special, together.
            </p>
            
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-6 px-8 rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              <Wand2 className="h-5 w-5 mr-2" />
              🪄 Let Olivia Curate Your Look
            </Button>
            
            <div className="mt-6">
              <div className="inline-flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
                <span className="text-sm text-purple-300">Personalized to your wardrobe & style</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
      
      <OutfitMagicDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </section>
  );
};

export default OutfitMagicSection;
