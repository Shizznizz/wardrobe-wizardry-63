
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
      className="flex flex-col items-center text-center"
    >
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center mb-4",
        `bg-${color}-500/20`
      )}>
        <div className={cn("w-8 h-8", iconColor)}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/80">{description}</p>
    </motion.div>
  );
};

const HowItWorks = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="py-6">
      <div className="mb-8 pb-2 border-b border-blue-500/20">
        <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 pb-1`}>
          <span className="flex items-center justify-center md:justify-start gap-2">
            <Sparkles className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-blue-400`} />
            How It Works
          </span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <Feature 
          icon={<Camera className="w-full h-full" />}
          title="Digitize Your Wardrobe"
          description="Upload photos of your clothing items or snap them directly in the app to build your digital wardrobe inventory."
          color="blue"
          iconColor="text-blue-400"
          delay={0.1}
        />
        
        <Feature 
          icon={<Sparkles className="w-full h-full" />}
          title="Get AI Outfit Suggestions"
          description="Receive personalized outfit recommendations based on your style, the weather, and upcoming events in your calendar."
          color="purple"
          iconColor="text-purple-400"
          delay={0.2}
        />
        
        <Feature 
          icon={<Shirt className="w-full h-full" />}
          title="Try On Virtually"
          description="See how outfits look on you or our virtual model Olivia before deciding what to wear or buy."
          color="pink"
          iconColor="text-pink-400"
          delay={0.3}
        />
      </div>
    </div>
  );
};

export default HowItWorks;
