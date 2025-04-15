
import { useState } from 'react';
import { format } from 'date-fns';
import { Outfit, WeatherInfo, ClothingSeason } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Sun, Cloud, CloudRain, Thermometer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { OutfitLog } from '../OutfitLogItem';
import { Badge } from '@/components/ui/badge';
import WeatherWidget from '@/components/WeatherWidget';

interface DayDetailViewProps {
  selectedDate: Date;
  outfits: Outfit[];
  outfitLogs: OutfitLog[];
  onAddOutfit: (outfitId: string) => void;
  onAddActivity: (activity: string) => void;
  weatherLocation?: { city: string; country: string };
  onWeatherChange?: (weather: WeatherInfo) => void;
}

const DayDetailView = ({
  selectedDate,
  outfits,
  outfitLogs,
  onAddOutfit,
  onAddActivity,
  weatherLocation,
  onWeatherChange
}: DayDetailViewProps) => {
  const [activity, setActivity] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<ClothingSeason | ''>('');
  
  const handleAddActivity = () => {
    if (activity.trim()) {
      onAddActivity(activity.trim());
      setActivity('');
    }
  };
  
  const filteredOutfits = selectedSeason 
    ? outfits.filter(outfit => outfit.seasons.includes(selectedSeason))
    : outfits;

  return (
    <Card className="w-full mt-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Activity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Activity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Enter activity..."
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                  />
                  <Button onClick={handleAddActivity}>Add</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Outfit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Outfit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Select onValueChange={(value) => setSelectedSeason(value as ClothingSeason)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spring">Spring</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="autumn">Autumn</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={onAddOutfit} disabled={!selectedSeason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select outfit" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredOutfits.map(outfit => (
                        <SelectItem key={outfit.id} value={outfit.id}>
                          {outfit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weatherLocation?.city && (
          <Card className="bg-card/30">
            <CardContent className="p-4">
              <WeatherWidget
                city={weatherLocation.city}
                country={weatherLocation.country}
                onWeatherChange={onWeatherChange}
                showToasts={false}
                showError={false}
                className="bg-transparent border-none shadow-none p-0"
              />
            </CardContent>
          </Card>
        )}

        {outfitLogs.length > 0 ? (
          <div className="space-y-2">
            {outfitLogs.map(log => (
              <Card key={log.id} className="bg-card/30">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{log.outfitId}</p>
                    {log.activity && (
                      <Badge variant="secondary" className="mt-1">
                        {log.activity}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No outfits or activities planned for this day
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DayDetailView;
