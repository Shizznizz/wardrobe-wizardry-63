
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
import { PlusCircle, Briefcase, Shirt, Sunset, Leaf, FlowerIcon } from "lucide-react";
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
    image: "/lovable-uploads/413b249c-e4b5-48cd-a468-d23b2a23eca2.png",
    quote: "Effortless professionalism with comfort in mind",
    colors: ["blue", "gray", "white"],
    season: "All year",
    gradient: "from-blue-400/70 to-gray-400/70",
    icon: Briefcase
  },
  {
    id: 2,
    name: "Winter Formal",
    image: "/lovable-uploads/c0be3b58-4cc0-4277-8c62-da17547e44ff.png",
    quote: "Cozy layers with elegant sophistication",
    colors: ["black", "burgundy", "silver"],
    season: "Winter",
    gradient: "from-purple-800/70 to-gray-800/70",
    icon: Shirt
  },
  {
    id: 3,
    name: "Summer Breeze",
    image: "/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png",
    quote: "Light fabrics that flow with every step",
    colors: ["teal", "white", "beige"],
    season: "Summer",
    gradient: "from-teal-400/70 to-blue-200/70",
    icon: Sunset
  },
  {
    id: 4,
    name: "Autumn Layers",
    image: "/lovable-uploads/2551cee7-6f38-4c04-b656-16c188b19ace.png",
    quote: "Rich textures that embrace the changing leaves",
    colors: ["brown", "orange", "cream"],
    season: "Autumn",
    gradient: "from-amber-600/70 to-orange-300/70",
    icon: Leaf
  },
  {
    id: 5,
    name: "Spring Pastel",
    image: "/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png",
    quote: "Soft hues that bloom with the season",
    colors: ["lavender", "mint", "pink"],
    season: "Spring",
    gradient: "from-purple-300/70 to-green-200/70",
    icon: FlowerIcon
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
                    <Card className="glass-dark border-white/10 h-full transform transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-4">
                        <div className={`aspect-[3/4] rounded-md overflow-hidden bg-gradient-to-br ${outfit.gradient} mb-3 flex items-center justify-center relative`}>
                          {outfit.image ? (
                            <motion.img 
                              src={outfit.image} 
                              alt={outfit.name} 
                              className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            />
                          ) : (
                            <div className="text-white/30 text-lg font-medium">
                              {outfit.name}
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <h3 className="text-lg font-medium text-white">{outfit.name}</h3>
                            <p className="text-white/90 text-sm italic mt-1">{outfit.quote}</p>
                          </div>
                        </div>
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
                        <motion.img 
                          src={outfit.image} 
                          alt={outfit.name} 
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
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
                    
                    <blockquote className="italic border-l-2 border-purple-500 pl-3 text-slate-300">
                      "{outfit.quote}"
                    </blockquote>
                    
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
