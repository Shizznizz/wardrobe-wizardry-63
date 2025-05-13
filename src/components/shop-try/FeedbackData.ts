
export interface FeedbackData {
  rating: number;
  comment?: string;
  favorite: boolean;
  tags: string[];
  shareOnSocial: boolean;
}

export interface OutfitFeedbackData {
  rating: number;
  favorite: boolean;
  tags: string[];
  comment?: string;
  outfitId: string;
  items: string[];
  occasion: string;
  vibe: string;
}
