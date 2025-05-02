
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  showAvatar?: boolean;
  className?: string;
  children?: React.ReactNode;
  avatarSrc?: string;
}

const PageHeader = ({
  title,
  subtitle,
  showAvatar = true,
  className,
  children,
  avatarSrc = "/lovable-uploads/34e8d801-61ee-4254-a7ce-39b52a3a7e65.png"
}: PageHeaderProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        "relative overflow-hidden py-4 md:py-6 px-4 md:px-6 text-center",
        className
      )}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>
      
      {/* Main headline */}
      <motion.h1 
        variants={itemVariants}
        className="text-3xl xs:text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 leading-tight max-w-4xl mx-auto"
      >
        {title}
      </motion.h1>
      
      {/* Subheadline */}
      <motion.p 
        variants={itemVariants}
        className="text-base xs:text-lg text-white/80 max-w-2xl mx-auto mb-6"
      >
        {subtitle}
      </motion.p>
      
      {/* Avatar (optional) */}
      {showAvatar && (
        <motion.div 
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <Avatar className="h-16 w-16 border-2 border-purple-400/50 bg-gradient-to-br from-purple-600/80 to-pink-600/80">
            <AvatarImage src={avatarSrc} alt="Olivia" />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-lg">OB</AvatarFallback>
          </Avatar>
        </motion.div>
      )}
      
      {/* Optional additional content */}
      {children && (
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PageHeader;
