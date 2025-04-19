
import { Camera, Sparkles, Shirt } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  iconColor: string;
  delay: number;
}

const Feature = ({ icon, title, description, color, iconColor, delay }: FeatureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center text-center"
    >
      <motion.div 
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-4",
          `bg-${color}-500/20`
        )}
        whileHover={{ rotate: 5 }}
      >
        <div className={cn("w-8 h-8", iconColor)}>
          {icon}
        </div>
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/80">{description}</p>
    </motion.div>
  );
};

const HowItWorks = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="py-16">
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 pb-1 mb-4`}>
            <span className="flex items-center justify-center gap-2">
              <Sparkles className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-blue-400`} />
              How It Works
            </span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Experience the future of personal styling with AI-powered recommendations
          </p>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <Feature 
          icon={<Camera className="w-full h-full" />}
          title="Smart Wardrobe Organization"
          description="Digitize your closet with AI-powered cataloging and get instant outfit combinations based on your style preferences."
          color="blue"
          iconColor="text-blue-400"
          delay={0.1}
        />
        
        <Feature 
          icon={<Sparkles className="w-full h-full" />}
          title="AI Style Assistant"
          description="Get personalized outfit recommendations from Olivia based on weather, occasions, and your calendar events."
          color="purple"
          iconColor="text-purple-400"
          delay={0.2}
        />
        
        <Feature 
          icon={<Shirt className="w-full h-full" />}
          title="Virtual Try-On"
          description="Preview outfits on your virtual model before wearing them, ensuring perfect style combinations every time."
          color="pink"
          iconColor="text-pink-400"
          delay={0.3}
        />
      </div>
    </div>
  );
};

export default HowItWorks;
