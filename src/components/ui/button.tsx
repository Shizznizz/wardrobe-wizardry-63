
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
        pill: "rounded-full bg-slate-800/70 text-white hover:bg-slate-700/90 border border-white/5 shadow-sm transition-all duration-300 hover:border-purple-500/30",
        gradient: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md",
        "olivia-primary": "bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white shadow-sm",
        "olivia-outline": "border border-white/20 text-white hover:bg-white/10 transition-colors",
        "olivia-accent": "border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-100 hover:border-purple-500/50 transition-colors",
        "hero-primary": "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300",
        "hero-secondary": "bg-transparent border-2 border-pink-500/30 hover:border-pink-500/50 text-pink-100 hover:bg-white/10 transition-all duration-300",
        "fashion-primary": "relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-pink-500/20 transition-all duration-300 group border border-white/10",
        "fashion-secondary": "relative overflow-hidden bg-transparent border border-purple-500/30 text-purple-100 hover:border-purple-400/50 hover:bg-purple-500/10 transition-all duration-300 group",
        "fashion-tertiary": "relative overflow-hidden bg-transparent border border-pink-400/20 text-pink-100 hover:border-pink-400/40 hover:bg-pink-500/10 transition-all duration-300 group",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
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
