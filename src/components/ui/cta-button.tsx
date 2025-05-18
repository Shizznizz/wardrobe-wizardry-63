
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CTAButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  isActive?: boolean;
  iconPosition?: 'left' | 'right';
  glowColor?: string;
  enableGlow?: boolean;
}

const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ 
    className, 
    children, 
    icon,
    isActive = false,
    iconPosition = 'left',
    glowColor = 'rgba(147, 51, 234, 0.4)',
    enableGlow = false,
    ...props 
  }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: enableGlow ? 1.02 : 1 }}
        whileTap={{ scale: 0.98 }}
        className={cn("relative", props.disabled && "opacity-60")}
        style={isActive ? { boxShadow: `0 0 20px ${glowColor}` } : {}}
      >
        {enableGlow && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 hover:from-purple-500/20 hover:via-pink-500/30 hover:to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-md animate-pulse-slow"></div>
        )}
        <Button
          ref={ref}
          className={cn(
            "h-[48px] px-6 rounded-lg font-semibold transition-all",
            "hover:shadow-lg disabled:opacity-60",
            enableGlow && "hover:border-pink-500/30 hover:border",
            iconPosition === 'right' ? "flex-row-reverse" : "flex-row",
            className
          )}
          {...props}
        >
          {icon && (
            <span className={cn(
              iconPosition === 'right' ? "ml-2" : "mr-2",
              "flex items-center justify-center"
            )}>
              {icon}
            </span>
          )}
          {children}
        </Button>
      </motion.div>
    );
  }
);

CTAButton.displayName = "CTAButton";

export { CTAButton };
