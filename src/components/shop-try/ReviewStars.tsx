
import { Star, StarHalf } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ReviewStarsProps {
  rating: number;
  reviewCount: number;
  showTooltip?: boolean;
}

const ReviewStars = ({ rating, reviewCount, showTooltip = true }: ReviewStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => {
                if (i < fullStars) {
                  return (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  );
                } else if (i === fullStars && hasHalfStar) {
                  return <StarHalf key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />;
                }
                return <Star key={i} className="w-4 h-4 text-gray-300" />;
              })}
            </div>
            <span className="text-sm text-white/70">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent side="bottom" className="bg-slate-900 border-purple-500/30">
            <p className="text-sm">Based on {reviewCount} customer reviews</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default ReviewStars;
