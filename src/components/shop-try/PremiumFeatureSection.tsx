
import { motion } from 'framer-motion';
import { LayoutGrid, Upload, Sparkles, BrainCircuit, Shirt, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PremiumFeatureSectionProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
}

const PremiumFeatureSection = ({
  isPremiumUser,
  onUpgradeToPremium
}: PremiumFeatureSectionProps) => {
  const features = [
    {
      icon: <Upload className="h-10 w-10 text-purple-400" />,
      title: 'Multiple Photo Uploads',
      description: 'Try on outfits in different poses or events'
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-blue-400" />,
      title: 'AI Outfit Feedback',
      description: 'Olivia will give personalized suggestions'
    },
    {
      icon: <Shirt className="h-10 w-10 text-pink-400" />,
      title: 'Premium Closet Access',
      description: 'Curated collections & trending pieces'
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="flex items-center mb-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <h2 className="px-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Go Premium & Let Olivia Work Her Magic ✨
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="relative">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="relative backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-colors group"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/70 text-sm">
                {feature.description}
              </p>
              
              {!isPremiumUser && (
                <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-500 border-none">
                  Premium
                </Badge>
              )}
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center">
          {!isPremiumUser ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={onUpgradeToPremium}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 py-6 px-8 text-lg rounded-lg shadow-lg shadow-purple-500/20 group relative overflow-hidden"
                size="lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Sparkles className="mr-2 h-5 w-5 text-yellow-200" />
                <span>Upgrade to Premium – Only €2.99/week</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="mt-3 text-white/60 text-sm">
                Cancel anytime. No commitment.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 backdrop-blur-sm bg-white/5 rounded-xl border border-green-500/30"
            >
              <div className="flex items-center justify-center gap-2 text-green-400">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">You're enjoying Premium features!</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumFeatureSection;
