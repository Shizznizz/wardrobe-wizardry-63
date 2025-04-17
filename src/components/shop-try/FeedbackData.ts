
export interface FeedbackData {
  rating: number;
  favorite: boolean;
  comment?: string;
  accuracy?: 'good' | 'ok' | 'poor';
}
