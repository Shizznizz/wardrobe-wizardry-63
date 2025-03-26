
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  variant?: "default" | "gradient" | "dotted";
}

const SectionDivider = ({
  className,
  variant = "default"
}: SectionDividerProps) => {
  return (
    <div className={cn(
      "w-full py-8 my-4",
      variant === "default" && "flex justify-center",
      variant === "gradient" && "flex justify-center",
      variant === "dotted" && "flex justify-center items-center gap-2",
      className
    )}>
      {variant === "default" && (
        <div className="w-24 h-1 bg-purple-500/30 rounded-full" />
      )}
      
      {variant === "gradient" && (
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-pink-500/80 rounded-full" />
      )}
      
      {variant === "dotted" && (
        <>
          <div className="w-2 h-2 rounded-full bg-blue-400/80" />
          <div className="w-3 h-3 rounded-full bg-purple-500/80" />
          <div className="w-2 h-2 rounded-full bg-pink-400/80" />
        </>
      )}
    </div>
  );
};

export default SectionDivider;
