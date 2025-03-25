
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const timelineEvents = [
  {
    id: 1,
    date: "March 2025",
    title: "Spring Transition Collection",
    description: "Early spring essentials with versatile layering pieces for changing temperatures.",
    image: "/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png",
    gradient: "from-emerald-200 to-blue-200",
    oliviaComment: "Olivia's pick – Light layering for unpredictable Dutch spring weather. Focus on breathable fabrics with waterproof outer layers."
  },
  {
    id: 2,
    date: "June 2025",
    title: "Summer Essentials",
    description: "Breathable fabrics and versatile pieces for warm days and cool evenings.",
    image: "/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png",
    gradient: "from-sky-200 to-indigo-200",
    oliviaComment: "Olivia's pick – Natural linen blends in earth tones that transition easily from beach to dinner with just a few accessories."
  },
  {
    id: 3,
    date: "September 2025",
    title: "Autumn Capsule Wardrobe",
    description: "Rich textures and warm tones for a versatile fall wardrobe with minimal pieces.",
    image: "/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png",
    gradient: "from-amber-200 to-orange-200",
    oliviaComment: "Olivia's pick – Investing in a quality trench coat will elevate all your autumn looks, especially in neutral tones like olive or camel."
  },
  {
    id: 4,
    date: "December 2025",
    title: "Winter Sophistication",
    description: "Cozy yet elegant winter pieces that work for both indoor gatherings and outdoor activities.",
    image: "/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png",
    gradient: "from-blue-200 to-purple-200",
    oliviaComment: "Olivia's pick – Layered knitwear in complementary tones creates dimension while keeping you warm. Try a fine merino base with chunky cardigan."
  },
  {
    id: 5,
    date: "March 2026",
    title: "Next Year's Preview",
    description: "Early look at the upcoming trends and seasonal transitions for the new year.",
    image: "/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png",
    gradient: "from-pink-200 to-rose-200",
    oliviaComment: "Olivia's pick – Sustainable materials will be even more important next year. Look for organic cotton blends and recycled synthetics."
  }
];

const StylingTimeline = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative py-8">
      {/* Timeline center line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 via-blue-500/50 to-purple-500/50"></div>
      
      <div className="relative">
        {timelineEvents.map((event, index) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5
            }}
            viewport={{ once: true, margin: "-100px" }}
            className={`mb-12 sm:mb-16 flex items-center ${
              isMobile ? "flex-col" : (index % 2 === 0 ? "flex-row" : "flex-row-reverse")
            } relative z-10`}
          >
            {/* Timeline node */}
            <div className={`${isMobile ? "absolute top-0" : "absolute"} left-1/2 transform -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 z-20`}></div>
            
            {/* Content */}
            <div className={`${
              isMobile 
                ? "w-full mt-6 text-center px-4" 
                : `w-5/12 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`
            }`}>
              <span className="text-xs sm:text-sm font-medium text-blue-300">{event.date}</span>
              <h3 className="text-sm sm:text-lg font-semibold text-white mt-1">{event.title}</h3>
              <p className="text-white/70 mt-1 text-xs sm:text-sm">{event.description}</p>
              
              {/* Olivia's Comment */}
              <div className={`mt-3 sm:mt-4 relative bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20`}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 ring-2 ring-purple-500/50">
                    <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400">OB</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] sm:text-xs font-medium text-white/90">Style Advice</span>
                      <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-300" />
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 mt-1">{event.oliviaComment}</p>
                  </div>
                </div>
                {/* Speech bubble triangle - hide on mobile */}
                {!isMobile && (
                  <div className={`absolute ${index % 2 === 0 ? "right-[-8px]" : "left-[-8px]"} top-4 w-0 h-0 
                    ${index % 2 === 0 
                      ? "border-t-[6px] border-t-transparent border-l-[8px] border-l-white/10 border-b-[6px] border-b-transparent" 
                      : "border-t-[6px] border-t-transparent border-r-[8px] border-r-white/10 border-b-[6px] border-b-transparent"
                    }`}></div>
                )}
              </div>
            </div>
            
            {/* Image */}
            <div className={`${
              isMobile 
                ? "w-full mt-4 px-4" 
                : `w-5/12 ${index % 2 === 0 ? "pl-8" : "pr-8"}`
            }`}>
              <Card className="overflow-hidden rounded-lg border border-white/10 hover:border-white/20 transition-duration-300 neo-blur">
                <CardContent className="p-0">
                  <div className="relative aspect-video w-full">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${event.gradient} opacity-80`}></div>
                    
                    {/* Season themed styling */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-3 sm:p-4">
                        <h4 className="text-sm sm:text-lg font-medium text-gray-800">{event.date.split(" ")[0]} Collection</h4>
                        <p className="text-xs sm:text-sm text-gray-700 mt-1">Coming soon</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StylingTimeline;
