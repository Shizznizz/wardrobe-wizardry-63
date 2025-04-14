
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Heart, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';

const trendingLooks = [
  {
    id: 'trending-1',
    image: '/lovable-uploads/413b249c-e4b5-48cd-a468-d23b2a23eca2.png',
    name: 'Summer Business Casual',
    likes: 248,
    user: 'Emily K.',
    tags: ['summer', 'business', 'minimalist'],
  },
  {
    id: 'trending-2',
    image: '/lovable-uploads/c0be3b58-4cc0-4277-8c62-da17547e44ff.png',
    name: 'Weekend Getaway',
    likes: 187,
    user: 'Alex M.',
    tags: ['casual', 'spring', 'relaxed'],
  },
  {
    id: 'trending-3',
    image: '/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png',
    name: 'Evening Elegance',
    likes: 329,
    user: 'Taylor W.',
    tags: ['formal', 'autumn', 'elegant'],
  },
  {
    id: 'trending-4',
    image: '/lovable-uploads/2551cee7-6f38-4c04-b656-16c188b19ace.png',
    name: 'Cozy Winter Day',
    likes: 214,
    user: 'Jordan L.',
    tags: ['winter', 'casual', 'comfortable'],
  },
];

interface TrendingLooksProps {
  onShowLogin: () => void;
}

const TrendingLooks = ({ onShowLogin }: TrendingLooksProps) => {
  const [likedLooks, setLikedLooks] = useState<string[]>([]);
  
  const handleLike = (id: string) => {
    if (likedLooks.includes(id)) {
      setLikedLooks(prev => prev.filter(lookId => lookId !== id));
    } else {
      setLikedLooks(prev => [...prev, id]);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-200 to-pink-200 flex items-center">
          <Flame className="h-5 w-5 mr-2 text-orange-400" />
          Trending in Community
        </h2>
        
        <Badge 
          variant="outline" 
          className="bg-white/5 border-white/20 px-2 py-1 flex items-center gap-1"
        >
          <Users className="h-3.5 w-3.5 text-purple-400" />
          <span className="text-white/80">347 Active</span>
        </Badge>
      </div>
      
      <Carousel 
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {trendingLooks.map((look, index) => (
            <CarouselItem key={look.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className={cn(
                  "overflow-hidden border-white/10 hover:border-white/20 transition-all",
                  "bg-gradient-to-br from-slate-900/90 to-slate-800/50 backdrop-blur-sm"
                )}>
                  <CardContent className="p-3">
                    <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden mb-3">
                      <img 
                        src={look.image} 
                        alt={look.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-white/20 text-white text-xs flex items-center backdrop-blur-sm">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>{look.likes}</span>
                          </Badge>
                          
                          <Button 
                            size="icon"
                            variant="outline"
                            className={cn(
                              "h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm border-white/10",
                              likedLooks.includes(look.id) ? "text-pink-400" : "text-white"
                            )}
                            onClick={() => handleLike(look.id)}
                          >
                            <Heart className={cn(
                              "h-3.5 w-3.5", 
                              likedLooks.includes(look.id) ? "fill-pink-400" : ""
                            )} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-sm font-medium text-white truncate">{look.name}</h3>
                        <p className="text-xs text-white/50">by {look.user}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 pt-1">
                        {look.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-[10px] py-0 border-white/10 text-white/70"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs h-8 border-white/10 hover:bg-white/10 hover:text-white"
                        onClick={onShowLogin}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        Try Look
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-end mt-4 gap-2">
          <CarouselPrevious className="relative inset-0 h-8 w-8 translate-y-0 border-white/20 bg-slate-800/80 text-white hover:bg-slate-700/90 hover:border-white/30" />
          <CarouselNext className="relative inset-0 h-8 w-8 translate-y-0 border-white/20 bg-slate-800/80 text-white hover:bg-slate-700/90 hover:border-white/30" />
        </div>
      </Carousel>
    </motion.div>
  );
};

export default TrendingLooks;
