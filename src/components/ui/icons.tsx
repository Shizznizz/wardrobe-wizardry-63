
import {
  Coffee,
  Sparkles,
  Umbrella,
  Sunset,
  Moon,
  PartyPopper,
  Shirt as LucideShirt
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Create a TrousersIcon that uses the Shirt icon but rotated
export const TrousersIcon = (props: any) => (
  <div className="rotate-90">
    <LucideShirt {...props} />
  </div>
);

// Export the PartyPopper icon as Party for simpler usage
export const Party = PartyPopper;

// Export the Shirt from lucide-react
export const Shirt = LucideShirt;

export const PantsIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("size-4", className)}
    {...props}
  >
    <path d="M7 5L17 5"></path>
    <path d="M8 5V19L12 19"></path>
    <path d="M16 5V19L12 19"></path>
    <path d="M10 5L14 5"></path>
  </svg>
);

export const ShirtIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("size-4", className)}
    {...props}
  >
    <path d="M12 7V4c0-1 .6-2 2-2h.01c1.74 0 3.25 1.3 3.45 3.02a3 3 0 0 1-3.3 3.98"></path>
    <path d="M6.54 5.02A3.24 3.24 0 0 1 10 2h.01C11.41 2 12 3 12 4v3"></path>
    <path d="M22 9c0 9-4 12-10 12S2 18 2 9"></path>
  </svg>
);

export {
  Coffee,
  Sparkles,
  Umbrella,
  Sunset,
  Moon
};
