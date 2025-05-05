
import { Outfit } from '@/lib/types';

export interface OutfitLog {
  id: string;
  outfitId: string;
  date: Date;
  timeOfDay: string;
  notes?: string;
  weather_condition?: string;
  temperature?: string;
  user_id: string;
}

export interface OutfitLogExtended extends OutfitLog {
  outfit?: Outfit;
}
