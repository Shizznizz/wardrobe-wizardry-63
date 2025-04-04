
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OutfitLogItem, { OutfitLog } from '../OutfitLogItem';
import { Outfit } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface OutfitLogsListProps {
  selectedDate: Date | undefined;
  outfitLogsOnDate: OutfitLog[];
  getOutfitById: (id: string) => Outfit | undefined;
  handleViewLog: (log: OutfitLog) => void;
  handleOpenLogDialog: (date?: Date) => void;
}

const OutfitLogsList = ({
  selectedDate,
  outfitLogsOnDate,
  getOutfitById,
  handleViewLog,
  handleOpenLogDialog,
}: OutfitLogsListProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className={`col-span-1 ${isMobile ? 'w-full' : 'md:col-span-2'} bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-purple-200">
          Outfits on {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {outfitLogsOnDate && outfitLogsOnDate.length > 0 ? (
          <div className="space-y-3">
            {outfitLogsOnDate.map(log => {
              const outfit = getOutfitById(log.outfitId);
              if (!outfit) return null;
              
              return (
                <OutfitLogItem 
                  key={log.id}
                  log={log}
                  outfit={outfit}
                  onClick={() => handleViewLog(log)}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 italic mb-4">No outfits logged on this date</p>
            <Button 
              variant="outline" 
              className="border-purple-500/30 hover:bg-purple-500/20"
              onClick={() => handleOpenLogDialog(selectedDate)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Outfit Log
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OutfitLogsList;
