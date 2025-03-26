
import { motion } from "framer-motion";
import { 
  Camera, 
  PaintBucket, 
  Upload, 
  Eye
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Upload Your Photo",
    description: "Start by uploading a high-quality photo of yourself in neutral clothing.",
    icon: <Camera className="h-6 w-6" />,
    color: "from-indigo-600 to-purple-700"
  },
  {
    id: 2,
    title: "Select Outfits",
    description: "Browse through your virtual wardrobe or choose from suggested styles.",
    icon: <PaintBucket className="h-6 w-6" />,
    color: "from-purple-600 to-pink-600"
  },
  {
    id: 3,
    title: "AI Processing",
    description: "Our advanced AI precisely maps the clothing to your body shape.",
    icon: <Upload className="h-6 w-6" />,
    color: "from-pink-600 to-rose-600"
  },
  {
    id: 4,
    title: "Visualize Results",
    description: "See yourself in the new outfit with realistic textures and lighting.",
    icon: <Eye className="h-6 w-6" />,
    color: "from-rose-600 to-orange-600"
  }
];

const VerticalStepCards = () => {
  return (
    <div className="flex flex-col space-y-6 md:space-y-8">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Connecting line */}
          {index < steps.length - 1 && (
            <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-white/40 to-white/10 h-full" />
          )}
          
          <div className="flex gap-6">
            {/* Step number with gradient background */}
            <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center z-10 shadow-lg shadow-${step.color.split(' ')[1].replace('to-', '')}/20`}>
              {step.icon}
            </div>
            
            {/* Card content */}
            <div className="neo-blur p-6 rounded-xl flex-1 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-white/80">{step.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VerticalStepCards;
