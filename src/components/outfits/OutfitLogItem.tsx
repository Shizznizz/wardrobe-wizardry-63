
import { format } from 'date-fns';
import { Activity, TimeOfDay } from '@/lib/types';

export interface OutfitLog {
  id: string;
  outfitId: string;
  date: Date;
  timeOfDay: TimeOfDay;
  notes?: string;
  weatherCondition?: string;
  temperature?: string;
  activity?: Activity;
  customActivity?: string;
  askForAiSuggestion?: boolean;
  aiSuggested?: boolean;
  aiSuggestionFeedback?: 'positive' | 'negative' | null;
  occasionEmoji?: string;
  thumbnailUrl?: string;
}

interface OutfitLogItemProps {
  log: OutfitLog;
  outfitName: string;
  onDelete?: () => void;
  onView?: () => void;
  onEdit?: () => void;
}

// Mapping of activities to emojis
const activityEmojis: Record<string, string> = {
  casual: '👕',
  work: '💼',
  formal: '👔',
  party: '🎉',
  date: '❤️',
  interview: '🎓',
  presentation: '📊',
  dinner: '🍽️',
  sport: '🏃',
  other: '📝'
};

// Mapping of weather conditions to emojis
const weatherEmojis: Record<string, string> = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️',
  windy: '💨'
};

const OutfitLogItem = ({ log, outfitName, onDelete, onView, onEdit }: OutfitLogItemProps) => {
  const activityEmoji = log.activity ? activityEmojis[log.activity] || '📝' : '';
  const weatherEmoji = log.weatherCondition ? weatherEmojis[log.weatherCondition] || '' : '';
  const activityDisplay = log.activity === 'other' && log.customActivity ? log.customActivity : log.activity;
  
  // Determine if this is a future planned outfit
  const isFuturePlanned = new Date(log.date) > new Date();
  
  return (
    <div className="p-3 bg-slate-800/50 border border-purple-500/30 rounded-lg mb-2 relative">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white flex items-center">
            {activityEmoji && <span className="mr-2">{activityEmoji}</span>}
            {outfitName}
            {log.aiSuggested && <span className="ml-2 px-1.5 py-0.5 text-xs bg-purple-600/50 rounded-full">AI Suggested</span>}
          </h3>
          <p className="text-sm text-gray-300">
            {format(new Date(log.date), 'MMMM d, yyyy')} • {log.timeOfDay}
            {activityDisplay && <span className="ml-1">• {activityDisplay}</span>}
          </p>
          
          {(log.weatherCondition || log.temperature) && (
            <p className="text-sm text-gray-400 mt-1">
              {weatherEmoji} {log.weatherCondition}
              {log.weatherCondition && log.temperature && ' • '}
              {log.temperature}
            </p>
          )}
          
          {log.notes && (
            <p className="text-sm text-gray-300 mt-2 italic">"{log.notes}"</p>
          )}
          
          {isFuturePlanned && log.askForAiSuggestion && !log.aiSuggested && (
            <div className="mt-2 p-2 bg-purple-800/20 rounded text-xs text-purple-200">
              Olivia will suggest an outfit for this planned event
            </div>
          )}
          
          {log.aiSuggested && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-sm text-gray-300">Was this suggestion helpful?</span>
              <button 
                className={`p-1 rounded ${log.aiSuggestionFeedback === 'positive' ? 'bg-green-600' : 'bg-slate-700'}`}
                onClick={() => {/* Handle feedback logic */}}
              >
                👍
              </button>
              <button 
                className={`p-1 rounded ${log.aiSuggestionFeedback === 'negative' ? 'bg-red-600' : 'bg-slate-700'}`}
                onClick={() => {/* Handle feedback logic */}}
              >
                👎
              </button>
            </div>
          )}
        </div>
        
        {log.thumbnailUrl && (
          <div className="h-12 w-12 rounded overflow-hidden">
            <img 
              src={log.thumbnailUrl} 
              alt={outfitName} 
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="absolute top-2 right-2 flex space-x-1">
        {onView && (
          <button
            onClick={onView}
            className="p-1 text-xs text-purple-300 hover:text-purple-100"
          >
            View
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1 text-xs text-red-300 hover:text-red-100"
          >
            Delete
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1 text-xs text-blue-300 hover:text-blue-100"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default OutfitLogItem;
