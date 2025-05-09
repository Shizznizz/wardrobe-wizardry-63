
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Shirt, Rainbow, Calendar, Info } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface StyleAdviceProps {
  className?: string;
}

interface AdviceItem {
  id: number;
  icon: React.ReactNode; // Changed from JSX.Element to React.ReactNode
  title: string;
  content: string;
  color: string;
}

const OliviaStyleAdvice = ({ className }: StyleAdviceProps) => {
  const isMobile = useIsMobile();
  const [showInfo, setShowInfo] = useState(false);
  
  // Sample advice items with different icons and colors
  const adviceItems: AdviceItem[] = [
    {
      id: 1,
      icon: <Rainbow className="h-4 w-4" />,
      title: "Color Harmony",
      content: "Mix and match colors from the same palette for a cohesive look. Try complementary colors for a bold statement!",
      color: "from-purple-500/30 to-pink-500/30"
    },
    {
      id: 2,
      icon: <Shirt className="h-4 w-4" />,
      title: "Wardrobe Insight",
      content: "Did you know? The average person uses only 20% of their wardrobe regularly. Our AI helps you rediscover the other 80%!",
      color: "from-blue-500/30 to-indigo-500/30"
    },
    {
      id: 3,
      icon: <Calendar className="h-4 w-4" />,
      title: "Plan Ahead",
      content: "Have you tried styling based on your upcoming events? It's a great way to plan your outfits ahead of time.",
      color: "from-emerald-500/30 to-teal-500/30"
    }
  ];
  
  // Card container animation
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  // Individual advice item animation
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "relative p-6 rounded-xl border border-purple-500/30 backdrop-blur-lg bg-gradient-to-br from-slate-900/60 to-purple-900/40",
        "shadow-lg hover:shadow-purple-500/10 transition-shadow duration-300",
        className
      )}
    >
      {/* Subtle glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-blue-500/20 rounded-xl blur-lg opacity-70 -z-10"></div>
      
      {/* Header with avatar, name and info button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-purple-400/30 shadow-md">
            <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500">OB</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Olivia Bloom
            </h2>
            <p className="text-xs text-purple-300/90">Your AI Stylist</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <Info className="h-4 w-4 text-purple-300" />
        </button>
      </div>
      
      {/* Info box that appears when clicking the info icon */}
      {showInfo && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-16 right-6 bg-slate-800/90 border border-purple-500/20 p-3 rounded-lg shadow-lg z-10 max-w-[240px] text-xs text-white/80"
        >
          Olivia Bloom is your personal AI style advisor. She provides tailored fashion tips, outfit recommendations, and style insights based on your preferences and the latest trends.
          <div className="absolute right-3 -top-2 h-3 w-3 bg-slate-800/90 border-t border-l border-purple-500/20 transform rotate-45"></div>
        </motion.div>
      )}
      
      {/* Advice items grid */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'}`}>
        {adviceItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className={`p-4 rounded-lg bg-gradient-to-br ${item.color} border border-white/10 shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-full bg-white/10 text-white">
                {item.icon}
              </div>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
            </div>
            <p className="text-xs text-white/80">{item.content}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OliviaStyleAdvice;
