
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CTAButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  isActive?: boolean;
  iconPosition?: 'left' | 'right';
  glowColor?: string;
}

const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ 
    className, 
    children, 
    icon,
    isActive = false,
    iconPosition = 'left',
    glowColor = 'rgba(147, 51, 234, 0.4)',
    ...props 
  }, ref) => {
    return (
      <motion.div
        whileHover={{ 
          scale: 1.02,
          boxShadow: `0 0 20px ${glowColor}`,
        }}
        animate={isActive ? {
          boxShadow: [`0 0 5px ${glowColor}`, `0 0 20px ${glowColor}`, `0 0 5px ${glowColor}`],
        } : {}}
        transition={{
          boxShadow: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }
        }}
        whileTap={{ scale: 0.98 }}
        className={cn("relative", props.disabled && "opacity-60")}
      >
        <Button
          ref={ref}
          className={cn(
            "h-[48px] px-6 rounded-lg font-semibold transition-all",
            "hover:shadow-lg disabled:opacity-60",
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
