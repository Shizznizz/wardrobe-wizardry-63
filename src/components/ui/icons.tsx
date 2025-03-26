
import {
  Coffee,
  Sparkles,
  Umbrella,
  Sunset,
  Moon,
  PartyPopper,
  Shirt
} from 'lucide-react';

// Create a TrousersIcon that uses the Shirt icon but rotated
export const TrousersIcon = (props: any) => (
  <div className="rotate-90">
    <Shirt {...props} />
  </div>
);

// Export the PartyPopper icon as Party for simpler usage
export const Party = PartyPopper;

export {
  Coffee,
  Sparkles,
  Umbrella,
  Sunset,
  Moon
};
