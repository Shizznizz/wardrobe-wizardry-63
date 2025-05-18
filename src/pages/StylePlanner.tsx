
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import OutfitCalendar from '@/components/outfits/OutfitCalendar';
import { useOutfitState } from '@/hooks/useOutfitState';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, CalendarIcon, CalendarDays, Clock, Users, Sparkles, Activity, PieChart } from 'lucide-react';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import OliviaAssistantSection from '@/components/outfits/OliviaAssistantSection';
import MissedOpportunitiesSection from '@/components/outfits/calendar/MissedOpportunitiesSection';

const StylePlanner = () => {
  const { outfits, clothingItems, outfitLogs, addOutfitLog } = useOutfitState();
  const { savedLocation } = useLocationStorage();
  const [showTimeline, setShowTimeline] = useState(false);
  const isMobile = useIsMobile();

  const handleShowTimeline = () => {
    setShowTimeline(true);
    // Scroll to timeline section or open timeline view
    const timelineSection = document.getElementById('style-timeline');
    if (timelineSection) {
      timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate monthly data for the current year
  const currentYear = new Date().getFullYear();
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

  // For mobile, we'll show only the most recent 7 months to prevent crowding
  const filteredMonthlyData = isMobile 
    ? monthlyWearData.slice(-7) 
    : monthlyWearData;

  // Dummy data for the most worn items
  const mostWornItems = [
    { name: 'Black Jeans', count: 16 },
    { name: 'White T-shirt', count: 12 },
    { name: 'Blue Blazer', count: 9 },
    { name: 'Sneakers', count: 8 }
  ];

  // Dummy data for top occasions
  const topOccasions = [
    { name: 'Work', count: 25 },
    { name: 'Casual', count: 18 },
    { name: 'Night Out', count: 10 },
    { name: 'Formal', count: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      <EnhancedHeroSection
        title="Plan, Track & Analyze Your Style"
        subtitle="Visualize your fashion journey, review insights, and plan outfits with Olivia's help."
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
      
      {/* My Style Calendar Section */}
      <section className="container mx-auto px-4 pt-10 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-purple-200">My Style Calendar</h2>
            <p className="text-purple-200/80">Track, plan and analyze your outfits over time</p>
          </div>

          {/* Calendar section */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-purple-500/20 shadow-lg">
            <OutfitCalendar 
              outfits={outfits} 
              clothingItems={clothingItems}
              onAddLog={addOutfitLog}
              location={savedLocation}
            />
          </div>
        </motion.div>
      </section>
      
      {/* Olivia Chat Section */}
      <section className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-purple-200">Need styling help for an upcoming day or event?</h3>
          </div>
          
          <OliviaAssistantSection onChatClick={() => console.log("Chat with Olivia clicked")} />
        </motion.div>
      </section>
      
      {/* Style Insights & Usage Stats */}
      <section id="style-timeline" className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-purple-200">Style Insights & Usage Stats</h2>
            <p className="text-purple-200/80">Understand your style patterns and preferences</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Monthly wear frequency chart */}
            <Card className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-200 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Monthly Outfit Wear Frequency
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-4">
                <div className="w-full overflow-x-auto overflow-y-hidden">
                  <div className={`h-[300px] ${isMobile ? 'min-w-[450px]' : 'w-full'}`}>
                    <ChartContainer config={{ count: {} }} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={filteredMonthlyData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#aaa" 
                            angle={0} 
                            tick={{ fontSize: isMobile ? 10 : 12 }}
                            dy={10}
                          />
                          <YAxis 
                            stroke="#aaa" 
                            tick={{ fontSize: isMobile ? 10 : 12 }}
                          />
                          <Tooltip 
                            content={<ChartTooltipContent />} 
                            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                          />
                          <Bar 
                            dataKey="count" 
                            fill="#a855f7" 
                            radius={[4, 4, 0, 0]}
                            maxBarSize={isMobile ? 30 : 60}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
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
              <CardContent className="pt-4 overflow-y-auto max-h-[300px]">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {/* Most Worn Items */}
            <Card className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Most Worn Items
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-2">
                  {mostWornItems.map((item, i) => (
                    <li key={i} className="flex justify-between items-center">
                      <span className="text-sm text-white/90">{item.name}</span>
                      <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded-full">
                        {item.count} times
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Top Occasions & Activities */}
            <Card className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Top Occasions & Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-2">
                  {topOccasions.map((item, i) => (
                    <li key={i} className="flex justify-between items-center">
                      <span className="text-sm text-white/90">{item.name}</span>
                      <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded-full">
                        {item.count} outfits
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* AI Assistant Usage */}
            <Card className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  AI Assistant Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/90">Outfit suggestions</span>
                    <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded-full">32</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/90">Style advice</span>
                    <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded-full">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/90">Weather adaptations</span>
                    <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded-full">14</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wardrobe Usage Stats */}
            <Card className="bg-slate-800/50 border-purple-500/20 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200 flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Wardrobe Usage Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/90">Items utilized</span>
                    <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded-full">68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/90">Seasonal rotation</span>
                    <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded-full">74%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/90">Color variety</span>
                    <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded-full">56%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Missed Opportunities Section */}
      <section className="container mx-auto px-4 py-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-purple-200">Missed Opportunities</h2>
            <p className="text-purple-200/80">Days where you had activities but didn't record an outfit</p>
          </div>

          <MissedOpportunitiesSection outfits={outfits} outfitLogs={outfitLogs} />
        </motion.div>
      </section>
    </div>
  );
};

export default StylePlanner;
