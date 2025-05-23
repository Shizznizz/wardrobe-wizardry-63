
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "small" | "large";
}

export function Container({ 
  children, 
  className, 
  size = "default", 
  ...props 
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 md:px-6",
        {
          "max-w-6xl": size === "default",
          "max-w-4xl": size === "small",
          "max-w-7xl": size === "large",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
