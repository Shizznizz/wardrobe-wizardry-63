
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

const outfitItems = [
  {
    id: 1,
    name: "Business Casual",
    image: "/placeholder.svg",
    colors: ["blue", "gray", "white"],
    season: "All year"
  },
  {
    id: 2,
    name: "Winter Formal",
    image: "/placeholder.svg",
    colors: ["black", "burgundy", "silver"],
    season: "Winter"
  },
  {
    id: 3,
    name: "Summer Breeze",
    image: "/placeholder.svg",
    colors: ["teal", "white", "beige"],
    season: "Summer"
  },
  {
    id: 4,
    name: "Autumn Layers",
    image: "/placeholder.svg",
    colors: ["brown", "orange", "cream"],
    season: "Autumn"
  },
  {
    id: 5,
    name: "Spring Pastel",
    image: "/placeholder.svg",
    colors: ["lavender", "mint", "pink"],
    season: "Spring"
  }
];

const OutfitSlider = () => {
  return (
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
            <motion.div whileHover={{ y: -5 }} className="h-full">
              <Card className="glass-dark border-white/10 h-full">
                <CardContent className="p-4">
                  <div className="aspect-[3/4] rounded-md overflow-hidden bg-black/20 mb-3">
                    <img 
                      src={outfit.image} 
                      alt={outfit.name} 
                      className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                    />
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex bg-white/10 border-white/20 text-white hover:bg-white/20 left-0" />
      <CarouselNext className="hidden md:flex bg-white/10 border-white/20 text-white hover:bg-white/20 right-0" />
    </Carousel>
  );
};

export default OutfitSlider;
