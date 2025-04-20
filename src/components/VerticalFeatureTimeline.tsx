
import { motion } from "framer-motion";
import { Camera, Sparkles, Upload, Eye } from "lucide-react";

const steps = [
  {
    icon: <Camera className="h-6 w-6 text-white" />,
    title: "Upload Your Photo",
    description: "Start by uploading a high-quality photo of yourself in neutral clothing.",
    color: "from-indigo-600 to-purple-600"
  },
  {
    icon: <Sparkles className="h-6 w-6 text-white" />,
    title: "Select Outfits",
    description: "Browse through your virtual wardrobe or choose from suggested styles.",
    color: "from-purple-600 to-pink-600"
  },
  {
    icon: <Upload className="h-6 w-6 text-white" />,
    title: "AI Processing",
    description: "Our advanced AI precisely maps the clothing to your body shape.",
    color: "from-pink-600 to-rose-600"
  },
  {
    icon: <Eye className="h-6 w-6 text-white" />,
    title: "Visualize Results",
    description: "See yourself in the new outfit with realistic textures and lighting.",
    color: "from-rose-600 to-orange-600"
  }
];

const VerticalFeatureTimeline = () => {
  return (
    <div className="max-w-4xl mx-auto py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
      >
        Virtual Fitting Room
      </motion.h2>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="flex gap-6 relative"
          >
            {index < steps.length - 1 && (
              <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
            )}
            
            <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
              {step.icon}
            </div>
            
            <div className="flex-1 glass-dark p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-white/80">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VerticalFeatureTimeline;
