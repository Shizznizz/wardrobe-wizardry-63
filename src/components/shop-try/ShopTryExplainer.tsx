
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { UploadCloud, ShoppingBag, Sparkles } from 'lucide-react';

const ShopTryExplainer = () => {
  const steps = [
    {
      icon: <UploadCloud className="h-10 w-10 text-purple-400" />,
      title: "Upload Your Photo",
      description: "Upload a full-body photo or use our model Olivia to see how clothes fit."
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-blue-400" />,
      title: "Choose Clothing",
      description: "Select from trending items, or upload a photo of clothing you're interested in."
    },
    {
      icon: <Sparkles className="h-10 w-10 text-pink-400" />,
      title: "See The Magic",
      description: "Our AI creates a realistic preview showing how the item will look on you."
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="border-0 h-full bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/10 backdrop-blur-sm p-6 hover:shadow-xl hover:shadow-purple-900/10 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-full">
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-medium text-white">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ShopTryExplainer;
