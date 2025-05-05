import { Outfit } from '@/lib/types';
import { TimeOfDay } from '@/lib/types';

export interface OutfitLog {
  id: string;
  outfitId: string;
  date: Date;
  timeOfDay: string;
  notes?: string;
  weather_condition?: string;
  temperature?: string;
  user_id: string;
  activity?: string;
  customActivity?: string;
  askForAiSuggestion?: boolean;
  aiSuggested?: boolean;
  aiSuggestionFeedback?: 'positive' | 'negative' | null;
}

export interface OutfitLogExtended extends OutfitLog {
  outfit?: Outfit;
}
