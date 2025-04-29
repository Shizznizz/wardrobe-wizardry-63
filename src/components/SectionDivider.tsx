
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  variant?: "default" | "gradient" | "dotted";
  label?: string; // Added label prop
}

const SectionDivider = ({
  className,
  variant = "default",
  label
}: SectionDividerProps) => {
  return (
    <div className={cn(
      "w-full py-8 my-4",
      variant === "default" && "flex justify-center items-center gap-3",
      variant === "gradient" && "flex justify-center items-center gap-3",
      variant === "dotted" && "flex justify-center items-center gap-2",
      className
    )}>
      {variant === "default" && (
        <>
          <div className="w-12 h-1 bg-purple-500/30 rounded-full" />
          {label && <span className="text-sm font-medium text-purple-300/70">{label}</span>}
          <div className="w-12 h-1 bg-purple-500/30 rounded-full" />
        </>
      )}
      
      {variant === "gradient" && (
        <>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-pink-500/80 rounded-full" />
          {label && <span className="text-sm font-medium text-blue-300/70">{label}</span>}
          <div className="w-16 h-1 bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-blue-500/80 rounded-full" />
        </>
      )}
      
      {variant === "dotted" && (
        <>
          <div className="w-2 h-2 rounded-full bg-blue-400/80" />
          <div className="w-3 h-3 rounded-full bg-purple-500/80" />
          {label && <span className="text-sm font-medium text-blue-300/70">{label}</span>}
          <div className="w-3 h-3 rounded-full bg-purple-500/80" />
          <div className="w-2 h-2 rounded-full bg-blue-400/80" />
        </>
      )}
    </div>
  );
};

export default SectionDivider;
