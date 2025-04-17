
import { motion } from 'framer-motion';
import { Upload, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedStepSectionProps {
  onStartStyling: () => void;
  onShowOliviaImageGallery: () => void;
  onShowClothingSelection: () => void;
}

const EnhancedStepSection = ({
  onStartStyling,
  onShowOliviaImageGallery,
  onShowClothingSelection
}: EnhancedStepSectionProps) => {
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-pink-400" />,
      title: "See Yourself in Style",
      subtitle: "Upload a full-body photo or choose Olivia as your virtual model.",
      buttonText: "Upload or Choose Olivia",
      onClick: onShowOliviaImageGallery,
      gradient: "from-pink-500/20 to-purple-500/20",
      buttonVariant: "fashion-primary" as const
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-blue-400" />,
      title: "Try Before You Buy",
      subtitle: "Select an item from your favorite shop or our Editor's Picks.",
      buttonText: "Select Clothing Item",
      onClick: onShowClothingSelection,
      gradient: "from-blue-500/20 to-indigo-500/20",
      buttonVariant: "fashion-secondary" as const
    },
    {
      icon: <Eye className="h-8 w-8 text-green-400" />,
      title: "Visualize Your Fit",
      subtitle: "Preview how the outfit looks on you or Olivia.",
      buttonText: "See Your Styled Look",
      onClick: onStartStyling,
      gradient: "from-green-500/20 to-teal-500/20",
      buttonVariant: "fashion-tertiary" as const
    }
  ];

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${step.gradient} border border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-slate-900/50 backdrop-blur-xl">
                {step.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-white">
                {step.title}
              </h3>
              
              <p className="text-white/70 text-sm min-h-[40px]">
                {step.subtitle}
              </p>

              <Button
                onClick={step.onClick}
                className="w-full mt-4"
                variant={step.buttonVariant}
              >
                {step.buttonText}
              </Button>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-500/5 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedStepSection;
