
import { Camera, Image, Shirt } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: <Camera className="w-6 h-6 text-purple-400" />,
    title: "Upload your full-body photo or use Olivia Bloom's image",
    delay: 0.1
  },
  {
    icon: <Shirt className="w-6 h-6 text-purple-400" />,
    title: "View your saved outfits",
    delay: 0.2
  },
  {
    icon: <Image className="w-6 h-6 text-purple-400" />,
    title: "Try them on instantly",
    delay: 0.3
  }
];

const StepsGuide = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto my-8">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: step.delay }}
          className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-900/60 border border-white/10"
        >
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
            {step.icon}
          </div>
          <p className="text-white/80 text-sm">{step.title}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StepsGuide;
