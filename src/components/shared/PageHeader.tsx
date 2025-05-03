
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  showAvatar?: boolean;
  avatarSrc?: string;
  imageVariant?: 'pink-suit' | 'casual' | 'formal' | 'street' | 'neutral';
  imagePosition?: 'left' | 'right' | 'center' | 'none';
  showSparkles?: boolean;
  className?: string;
}

const PageHeader = ({
  title,
  subtitle,
  children,
  showAvatar = true,
  avatarSrc = '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png',
  imageVariant = 'neutral',
  imagePosition = 'right',
  showSparkles = false,
  className,
}: PageHeaderProps) => {
  const getImageSrc = () => {
    switch (imageVariant) {
      case 'pink-suit':
        return '/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png';
      case 'casual':
        return '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png';
      case 'formal':
        return '/lovable-uploads/5e9a3938-d858-47e4-942e-e6f047b9e309.png';
      case 'street':
        return '/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png';
      default:
        return '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png';
    }
  };

  return (
    <motion.div 
      className={cn(
        "relative flex flex-col md:flex-row items-center md:items-start gap-8",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Add a style tag for custom CSS */}
      <style jsx global>{`
        .mobile-header-fix .header-image-container {
          max-width: 45% !important;
        }
        
        @media (max-width: 640px) {
          .mobile-header-fix .header-image-container {
            max-width: 60% !important;
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: 0;
            opacity: 0.8;
          }
          
          .mobile-header-fix .header-content {
            position: relative;
            z-index: 1;
            width: 100%;
          }
        }
      `}</style>
      
      {/* Text Content */}
      <div className={cn(
        "w-full md:w-3/5 space-y-4 header-content",
        imagePosition === 'right' ? 'order-1 md:order-1 text-left' : 'order-1 md:order-2 text-left md:text-right'
      )}>
        {showSparkles && (
          <motion.div 
            className="inline-block"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Sparkles className="w-6 h-6 text-pink-400 mb-2" />
          </motion.div>
        )}
        
        <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-base sm:text-lg text-white/80 max-w-xl">
            {subtitle}
          </p>
        )}
        
        {children && (
          <div className="pt-4">
            {children}
          </div>
        )}
      </div>
      
      {/* Image */}
      {imagePosition !== 'none' && (
        <div className={cn(
          "w-full md:w-2/5 flex justify-center header-image-container",
          imagePosition === 'right' ? 'order-2 md:order-2' : 'order-2 md:order-1'
        )}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-purple-500/20 rounded-full blur-2xl"></div>
            <img 
              src={getImageSrc()} 
              alt="Olivia Fashion Assistant" 
              className="relative z-10 max-h-[350px] md:max-h-[400px] drop-shadow-lg"
            />
          </div>
        </div>
      )}
      
      {/* Avatar (optional) */}
      {showAvatar && (
        <div className="absolute -bottom-6 right-6 z-20 hidden md:block">
          <Avatar className="w-12 h-12 border-2 border-white/20 shadow-lg">
            <AvatarImage src={avatarSrc} alt="Olivia" />
            <AvatarFallback>OB</AvatarFallback>
          </Avatar>
        </div>
      )}
    </motion.div>
  );
};

export default PageHeader;
