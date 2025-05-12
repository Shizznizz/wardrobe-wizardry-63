
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  className?: string;
  titleSize?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

const HeroSection = ({
  title,
  subtitle,
  image,
  imageAlt = "Hero image",
  className = '',
  titleSize = 'large',
  children
}: HeroSectionProps) => {
  return (
    <div className={cn("relative overflow-hidden border-b border-white/10", className)}>
      {/* Title section - now positioned above image */}
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
            src={image}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-purple-900/30 mix-blend-multiply" />
        </div>
      )}
      
      {/* Additional content */}
      {children && (
        <div className="container mx-auto px-4 py-4 relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
