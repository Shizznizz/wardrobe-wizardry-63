
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "small" | "large";
  noPadding?: boolean;
}

export function Container({ 
  children, 
  className, 
  size = "default", 
  noPadding = false,
  ...props 
}: ContainerProps) {
  return (
    <div
      className={cn(
        !noPadding && "px-4 sm:px-6 md:px-8",
        {
          "mx-auto max-w-6xl": size === "default",
          "mx-auto max-w-4xl": size === "small",
          "mx-auto max-w-7xl": size === "large",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
