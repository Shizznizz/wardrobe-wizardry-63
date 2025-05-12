
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EnhancedHeroSectionProps = {
  title: string;
  subtitle?: string;
  image?: {
    src: string;
    alt: string;
    variant?: 'portrait' | 'landscape' | 'standing';
  };
  buttons?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'neutral' | 'lavender';
    className?: string;
    icon?: React.ReactNode;
  }[];
  titleSize?: 'small' | 'medium' | 'large';
  className?: string;
};

const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = ({
  title,
  subtitle,
  image,
  buttons = [],
  titleSize = 'large',
  className = '',
}) => {
  return (
    <div className={cn("relative overflow-hidden border-b border-white/10", className)}>
      {/* Title section now placed above the image */}
      <div className="container mx-auto px-4 py-8 md:py-10 relative z-10">
        <div className="text-center mb-6">
          <h1 className={cn(
            "font-bold text-white tracking-tight",
            titleSize === 'large' && "text-3xl md:text-5xl",
            titleSize === 'medium' && "text-2xl md:text-4xl",
            titleSize === 'small' && "text-xl md:text-3xl"
          )}>
            {title}
          </h1>
          
          {subtitle && (
            <p className="mt-3 text-sm md:text-base lg:text-lg text-white/70 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Image section */}
      {image && (
        <div className="relative pb-[40%] md:pb-[30%] lg:pb-[25%] overflow-hidden border-t border-white/5">
          <img
            src={image.src}
            alt={image.alt}
            className={cn(
              "absolute inset-0 w-full h-full object-cover",
              image.variant === 'portrait' && "object-[50%_30%]",
              image.variant === 'landscape' && "object-[50%_50%]",
              image.variant === 'standing' && "object-[50%_25%]"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-purple-900/30 mix-blend-multiply" />
        </div>
      )}
      
      {/* Buttons section - positioned below the image */}
      {buttons.length > 0 && (
        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex flex-wrap justify-center gap-4">
            {buttons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                className={cn(
                  button.variant === 'primary' && "bg-purple-600 hover:bg-purple-700",
                  button.variant === 'secondary' && "bg-transparent border border-white/20 hover:bg-white/10",
                  button.variant === 'lavender' && "bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90",
                  button.className
                )}
              >
                {button.icon && <span className="mr-2">{button.icon}</span>}
                {button.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedHeroSection;
