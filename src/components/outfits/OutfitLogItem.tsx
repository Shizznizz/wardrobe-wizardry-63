
import { Outfit, OutfitLog } from '@/lib/types';

// Export the OutfitLog type from lib/types.ts instead of defining it here
export { OutfitLog };

export interface OutfitLogExtended extends OutfitLog {
  outfit?: Outfit;
}
