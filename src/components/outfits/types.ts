
import { LucideIcon } from 'lucide-react';

export interface OutfitItem {
  id: number;
  name: string;
  image: string;
  quote: string;
  colors: string[];
  season: string;
  gradient: string;
  icon: LucideIcon;
}
