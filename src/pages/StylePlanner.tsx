
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import OutfitCalendar from '@/components/outfits/OutfitCalendar';
import { useOutfitState } from '@/hooks/useOutfitState';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, CalendarIcon, CalendarDays, Clock } from 'lucide-react';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';

const StylePlanner = () => {
  const { outfits, clothingItems, outfitLogs, addOutfitLog } = useOutfitState();
  const { savedLocation } = useLocationStorage();
  const [showTimeline, setShowTimeline] = useState(false);

  const handleShowTimeline = () => {
    setShowTimeline(true);
    // Scroll to timeline section or open timeline view
    const timelineSection = document.getElementById('style-timeline');
    if (timelineSection) {
      timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Example data for stats
  const monthlyWearData = [
    { name: 'Jan', count: 4 },
    { name: 'Feb', count: 7 },
    { name: 'Mar', count: 5 },
    { name: 'Apr', count: 9 },
    { name: 'May', count: 6 },
    { name: 'Jun', count: 8 },
    { name: 'Jul', count: 12 },
    { name: 'Aug', count: 10 },
    { name: 'Sep', count: 14 },
    { name: 'Oct', count: 8 },
    { name: 'Nov', count: 6 },
    { name: 'Dec', count: 11 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      <EnhancedHeroSection
        title="Your Style Planner & Insights"
        subtitle="Explore your fashion evolution and unlock personalized insights that guide your unique style journey."
        image={{
          src: "/lovable-uploads/56943e49-b4d1-47fe-adf7-ee221134ef60.png",
          alt: "Woman in light beige pantsuit with gold belt and sunglasses",
          variant: "standing"
        }}
        buttons={[
          {
            label: "Show Me My Style Timeline",
            onClick: handleShowTimeline,
            variant: "lavender"
          }
        ]}
      />
      
      <section id="style-timeline" className="container mx-auto px-4 pt-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-purple-200">Your Style Journey</h2>
            <p className="text-purple-200/80">Track, plan and analyze your outfits over time</p>
          </div>

          {/* Calendar section */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-lg">
            <OutfitCalendar 
              outfits={outfits} 
              clothingItems={clothingItems}
              onAddLog={addOutfitLog}
              location={savedLocation}
            />
          </div>
          
          {/* Style insights section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-purple-200">Style Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly wear frequency chart */}
              <Card className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-purple-200 flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Monthly Outfit Wear Frequency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ count: {} }} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyWearData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#aaa" />
                        <YAxis stroke="#aaa" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Style evolution timeline */}
              <Card className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-purple-200 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Your Style Evolution
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="relative pl-8 space-y-6">
                    {/* Timeline elements */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="relative">
                        <div className="absolute left-0 top-1.5 -translate-x-[18px] h-4 w-4 rounded-full bg-purple-500"></div>
                        {i !== 3 && <div className="absolute left-0 top-5 -translate-x-[15px] h-14 w-0.5 bg-purple-500/30"></div>}
                        <div>
                          <p className="text-xs text-purple-400">{format(new Date(2024, i + 6, i * 5), 'MMM dd, yyyy')}</p>
                          <h4 className="text-sm font-medium text-white">Style Milestone {i}</h4>
                          <p className="text-xs text-purple-200/70 mt-1">
                            {i === 1 ? "Started building your basics collection" : 
                             i === 2 ? "Incorporated more colors into your wardrobe" : 
                             "Developed a consistent personal style"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default StylePlanner;
