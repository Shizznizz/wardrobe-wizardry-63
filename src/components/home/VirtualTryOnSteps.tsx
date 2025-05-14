
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Shirt, Sparkles } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const VirtualTryOnSteps = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-purple-400" />,
      title: "Upload a Photo of yourself or Olivia",
      description: "No good photo of yourself? No problem! Choose from Olivia's model images for the perfect virtual try-on experience."
    },
    {
      icon: <Shirt className="h-8 w-8 text-pink-400" />,
      title: "Pick a piece of Clothing You Want to Try",
      description: "Select any item from your digital wardrobe or one of our trending pieces to see how it would look on you."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-blue-400" />,
      title: "See It on You Instantly",
      description: "Olivia uses AI magic to show you wearing the outfit in seconds, no changing room needed!"
    }
  ];

  return (
    <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            How Virtual Try-On Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:border-purple-500/30 transition-all hover:shadow-lg"
            >
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-900/30 to-pink-900/30 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {/* Before Image: Olivia */}
          <div className="rounded-lg overflow-hidden">
            <AspectRatio ratio={3/4} className="bg-slate-800/60">
              <img
                src="/lovable-uploads/0d17107f-9669-4861-9060-6dbd31ca6db2.png"
                alt="Olivia without shirt"
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
          
          {/* Item Image: T-shirt */}
          <div className="rounded-lg overflow-hidden">
            <AspectRatio ratio={3/4} className="bg-slate-800/60 flex items-center justify-center p-4">
              <img
                src="/lovable-uploads/976eb626-3977-4b64-a550-f81af9fad23b.png"
                alt="Graphic t-shirt"
                className="object-contain w-full h-full max-h-[80%]"
              />
            </AspectRatio>
          </div>
          
          {/* After Image: Olivia wearing the t-shirt */}
          <div className="rounded-lg overflow-hidden">
            <AspectRatio ratio={3/4} className="bg-slate-800/60">
              <img
                src="/lovable-uploads/57e50499-0c71-4a0c-9f68-5708cac95552.png"
                alt="Olivia wearing the shirt"
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button 
            onClick={() => navigate('/shop-and-try')}
            className="bg-gradient-to-r from-[#EC6FF1] to-[#FF8AF0] text-white px-8 py-6 text-lg rounded-lg font-semibold"
          >
            Try it Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTryOnSteps;
