
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CollapsibleSectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const CollapsibleSection = ({
  title,
  children,
  defaultOpen = true,
  className,
  headerClassName,
  contentClassName,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("border border-white/10 rounded-xl bg-slate-900/50 backdrop-blur-md overflow-hidden", className)}
    >
      <div className={cn("flex items-center justify-between p-4 md:p-6", headerClassName)}>
        <div className="flex-1">{title}</div>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-slate-800/70 hover:bg-slate-700/70"
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-white/70" />
            ) : (
              <ChevronDown className="h-4 w-4 text-white/70" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className={contentClassName}>
        <div className="px-4 pb-4 md:px-6 md:pb-6">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleSection;
