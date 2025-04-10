import { motion } from 'framer-motion';
import { Camera, Upload, Image, User, Check, Shirt } from 'lucide-react';

const ShopTryExplainer = () => {
  const steps = [
    {
      icon: <User className="h-12 w-12 text-blue-400" />,
      title: "Upload your photo",
      description: "Upload a full-body photo or choose Olivia as your model"
    },
    {
      icon: <Shirt className="h-12 w-12 text-pink-400" />,
      title: "Select clothing",
      description: "Upload your own or choose from our curated selections"
    },
    {
      icon: <Check className="h-12 w-12 text-green-400" />,
      title: "See the result",
      description: "Instantly preview how the item looks on you"
    }
  ];

  return (
    <div className="w-full mb-12">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center bg-slate-800/40 backdrop-blur-md p-6 rounded-xl border border-slate-700/60 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 } 
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 p-4 rounded-full mb-4">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
            <p className="text-slate-300 text-sm">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ShopTryExplainer;
