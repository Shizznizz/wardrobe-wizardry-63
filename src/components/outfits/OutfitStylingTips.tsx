
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Lightbulb, Sparkle } from 'lucide-react';
import { motion } from 'framer-motion';

interface StylingTip {
  title: string;
  description: string;
}

const stylingTips: StylingTip[] = [
  {
    title: "Color Harmony",
    description: "Choose complementary colors for a balanced look. This outfit works because the neutral top balances the bold bottom."
  },
  {
    title: "Proportion Play",
    description: "Balance oversized pieces with fitted ones. If you're wearing a loose top, pair it with slim pants or vice versa."
  },
  {
    title: "Accessory Focus",
    description: "Let one statement piece shine. If your outfit has a bold pattern or color, keep accessories minimal and complementary."
  }
];

interface OutfitStylingTipsProps {
  className?: string;
}

const OutfitStylingTips = ({ className }: OutfitStylingTipsProps) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">Styling Tips</h2>
      </div>
      
      <Card className="overflow-hidden border-white/10 bg-slate-900/40 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12 border-2 border-purple-400/30">
              <AvatarImage src="/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png" alt="Olivia Bloom" />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">OB</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold flex items-center text-white">
                Olivia's Style Insights
                <Sparkle className="h-4 w-4 ml-2 text-yellow-400" />
              </h3>
              <p className="text-white/70 text-sm">Fashion Stylist</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {stylingTips.map((tip, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="bg-white/10 p-3 rounded-lg"
              >
                <h4 className="font-medium text-white flex items-center mb-1">
                  <Sparkle className="h-4 w-4 mr-1.5 text-yellow-400" />
                  {tip.title}
                </h4>
                <p className="text-white/80 text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutfitStylingTips;
