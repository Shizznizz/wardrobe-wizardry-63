import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        pill: "rounded-full bg-slate-800/70 text-white hover:bg-slate-700/90 border border-white/5 shadow-sm transition-all duration-300 hover:border-coral-500/30",
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md",
        "olivia-primary": "bg-gradient-to-r from-coral-500 to-coral-400 hover:opacity-90 text-white shadow-sm",
        "olivia-outline": "border border-white/20 text-white hover:bg-white/10 transition-colors",
        "olivia-accent": "border border-coral-500/30 text-coral-300 hover:bg-coral-500/20 hover:text-coral-100 hover:border-coral-500/50 transition-colors",
        "hero-primary": "bg-gradient-to-r from-coral-500 to-coral-400 hover:from-coral-400 hover:to-coral-300 text-white shadow-lg hover:shadow-coral hover:-translate-y-1 transition-all duration-300",
        "hero-secondary": "bg-transparent border-2 border-coral-500/30 hover:border-coral-500/50 text-coral-100 hover:bg-white/10 transition-all duration-300",
        "fashion-primary": "relative overflow-hidden bg-gradient-to-r from-coral-500 to-coral-400 text-white hover:from-coral-400 hover:to-coral-300 shadow-lg hover:shadow-coral transition-all duration-300 group border border-white/10",
        "fashion-secondary": "relative overflow-hidden bg-transparent border border-coral-500/30 text-coral-100 hover:border-coral-400/50 hover:bg-coral-500/10 transition-all duration-300 group",
        "fashion-tertiary": "relative overflow-hidden bg-transparent border border-coral-400/20 text-coral-100 hover:border-coral-400/40 hover:bg-coral-500/10 transition-all duration-300 group",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-2.5 py-1.5 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
