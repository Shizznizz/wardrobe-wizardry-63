
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const outfitItems = [
  {
    id: 1,
    name: "Business Casual",
    image: null,
    colors: ["blue", "gray", "white"],
    season: "All year",
    gradient: "from-blue-400/70 to-gray-400/70"
  },
  {
    id: 2,
    name: "Winter Formal",
    image: null,
    colors: ["black", "burgundy", "silver"],
    season: "Winter",
    gradient: "from-purple-800/70 to-gray-800/70"
  },
  {
    id: 3,
    name: "Summer Breeze",
    image: null,
    colors: ["teal", "white", "beige"],
    season: "Summer",
    gradient: "from-teal-400/70 to-blue-200/70"
  },
  {
    id: 4,
    name: "Autumn Layers",
    image: null,
    colors: ["brown", "orange", "cream"],
    season: "Autumn",
    gradient: "from-amber-600/70 to-orange-300/70"
  },
  {
    id: 5,
    name: "Spring Pastel",
    image: null,
    colors: ["lavender", "mint", "pink"],
    season: "Spring",
    gradient: "from-purple-300/70 to-green-200/70"
  }
];

const OutfitSlider = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-blue-300/80 italic cursor-help">
                Trending outfit combos based on real wardrobes and seasonal trends
              </p>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 border-slate-700">
              <p className="text-sm">These outfits are curated based on popular combinations and current fashion trends</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Carousel 
        className="w-full" 
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {outfitItems.map((outfit) => (
            <CarouselItem key={outfit.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Dialog>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ y: -5 }} className="h-full cursor-pointer">
                    <Card className="glass-dark border-white/10 h-full">
                      <CardContent className="p-4">
                        <div className={`aspect-[3/4] rounded-md overflow-hidden bg-gradient-to-br ${outfit.gradient} mb-3 flex items-center justify-center`}>
                          {outfit.image ? (
                            <img 
                              src={outfit.image} 
                              alt={outfit.name} 
                              className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                            />
                          ) : (
                            <div className="text-white/30 text-lg font-medium">
                              {outfit.name}
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-medium text-white">{outfit.name}</h3>
                        <p className="text-white/70 text-sm">{outfit.season}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-1">
                        {outfit.colors.map((color, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs py-0.5 px-2 bg-white/10 rounded-full"
                          >
                            {color}
                          </span>
                        ))}
                      </CardFooter>
                    </Card>
                  </motion.div>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl">{outfit.name} Outfit</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Perfect for {outfit.season.toLowerCase()} occasions
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4">
                    <div className={`aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${outfit.gradient} flex items-center justify-center`}>
                      {outfit.image ? (
                        <img 
                          src={outfit.image} 
                          alt={outfit.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-white/50 text-xl font-medium">
                          {outfit.name} Preview
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg">Colors</h3>
                      <div className="flex flex-wrap gap-2">
                        {outfit.colors.map((color, idx) => (
                          <span 
                            key={idx} 
                            className="text-sm py-1 px-3 bg-white/10 rounded-full"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <PlusCircle size={16} />
                        <span>Copy to My Wardrobe</span>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex bg-white/10 border-white/20 text-white hover:bg-white/20 left-0" />
        <CarouselNext className="hidden md:flex bg-white/10 border-white/20 text-white hover:bg-white/20 right-0" />
      </Carousel>
    </div>
  );
};

export default OutfitSlider;
