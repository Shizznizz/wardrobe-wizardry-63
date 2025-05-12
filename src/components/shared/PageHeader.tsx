
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showAvatar?: boolean;
  className?: string;
  titleClass?: string;
  subtitleClass?: string;
  children?: React.ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  showAvatar = false,
  className = '',
  titleClass = '',
  subtitleClass = '',
  children,
}: PageHeaderProps) => {
  const { user } = useAuth();
  
  return (
    <div className={cn("text-center mb-8", className)}>
      <div className="mb-6">
        <h1 className={cn("text-3xl md:text-4xl font-bold", titleClass)}>
          {title}
        </h1>
        
        {subtitle && (
          <p className={cn("text-base md:text-lg text-white/70 mt-2 max-w-2xl mx-auto", subtitleClass)}>
            {subtitle}
          </p>
        )}
      </div>
      
      {showAvatar && user && (
        <div className="flex justify-center mt-6">
          <Avatar className="h-16 w-16 border-2 border-purple-500/30">
            <AvatarImage 
              src={user.avatar_url || undefined} 
              alt={user.email || "User"} 
            />
            <AvatarFallback className="bg-purple-900 text-lg">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default PageHeader;
