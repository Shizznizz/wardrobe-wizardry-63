
import { motion } from 'framer-motion';
import { RefreshCw, Thermometer, Edit, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Outfit, WeatherInfo } from '@/lib/types';
import { toast } from 'sonner';

interface OutfitExplanationSectionProps {
  currentOutfit?: Outfit;
  onRefresh: () => void;
  temperature: number;
  weather?: WeatherInfo;
}

const OutfitExplanationSection = ({
  currentOutfit,
  onRefresh,
  temperature,
  weather
}: OutfitExplanationSectionProps) => {
  if (!currentOutfit) return null;
  
  // Generate explanation points (in real app, would come from AI)
  const explanationPoints = [
    `The color palette is cohesive and balanced with complementary tones.`,
    `Layering provides both style and flexibility for changing temperatures.`,
    `The silhouette is on-trend while maintaining a timeless appeal.`
  ];
  
  // Generate style tags (in real app, would come from dataset)
  const styleTags = currentOutfit.tags || ['Casual', 'Versatile', 'Balanced'];
  
  const handleMakeWarmer = () => {
    toast.success('Adjusting for warmer temperature...');
    onRefresh();
  };
  
  const handleMakeCooler = () => {
    toast.success('Adjusting for cooler temperature...');
    onRefresh();
  };
  
  const handleChangeTop = () => {
    toast.success('Finding alternative top options...');
    onRefresh();
  };
  
  return (
    <Card className="bg-slate-900/70 border border-white/10 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">
              Why This Works
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {styleTags.map((tag, idx) => (
              <Badge 
                key={idx} 
                variant="outline"
                className="bg-purple-500/20 border-purple-400/30 text-purple-200 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-white/80 italic mb-3">
            Olivia thinks this outfit works because:
          </p>
          
          <ul className="space-y-2">
            {explanationPoints.map((point, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-start gap-2"
              >
                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-purple-500/20 mt-0.5 flex-shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                </div>
                <span className="text-white/90 text-sm">{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Refresh</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleMakeWarmer}
            className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
          >
            <Thermometer className="mr-2 h-4 w-4" />
            <span>Make Warmer</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleMakeCooler}
            className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
          >
            <Thermometer className="mr-2 h-4 w-4" />
            <span>Make Cooler</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleChangeTop}
            className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Change Top</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitExplanationSection;
