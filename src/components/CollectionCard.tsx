
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles } from 'lucide-react';

interface StyleAdvice {
  text: string;
  oliviaImage?: string;
}

interface CollectionCardProps {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  gradient?: string;
  comingSoon?: boolean;
  styleAdvice?: StyleAdvice;
  className?: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  subtitle,
  description,
  image,
  gradient = "from-blue-500/50 to-purple-500/50",
  comingSoon = false,
  styleAdvice,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl overflow-hidden ${className}`}
    >
      <div 
        className={`h-full p-6 bg-gradient-to-br ${gradient} border border-white/10 backdrop-blur-md`}
      >
        {subtitle && (
          <div className="mb-2">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              {subtitle}
            </Badge>
          </div>
        )}
        
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        
        <p className="text-white/80 text-sm mb-4">
          {description}
        </p>
        
        {comingSoon && (
          <div className="mb-4">
            <span className="text-xs uppercase tracking-wider bg-white/10 px-2 py-1 rounded-full text-white/70">
              Coming soon
            </span>
          </div>
        )}
        
        {styleAdvice && (
          <div className="mt-6 bg-black/20 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              {styleAdvice.oliviaImage ? (
                <Avatar className="h-8 w-8 border border-purple-400/30">
                  <AvatarImage src={styleAdvice.oliviaImage} alt="Olivia" />
                  <AvatarFallback className="bg-purple-900 text-white text-xs">OB</AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium flex items-center">
                Style Advice 
                <Sparkles className="h-3 w-3 text-yellow-400 ml-1" />
              </span>
            </div>
            <p className="text-sm text-white/80">
              {styleAdvice.text}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CollectionCard;
