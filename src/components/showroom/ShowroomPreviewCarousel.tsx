
import { useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const previewExamples = [
  {
    id: 1,
    title: 'Evening Elegance',
    description: 'Perfect for dinner parties and special events',
    imageUrl: '/lovable-uploads/c0be3b58-4cc0-4277-8c62-da17547e44ff.png',
    tags: ['Evening', 'Formal', 'Summer']
  },
  {
    id: 2,
    title: 'Casual Chic',
    description: 'Comfortable yet stylish for everyday wear',
    imageUrl: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png',
    tags: ['Casual', 'Spring', 'Versatile']
  },
  {
    id: 3,
    title: 'Office Ready',
    description: 'Professional outfits that command respect',
    imageUrl: '/lovable-uploads/413b249c-e4b5-48cd-a468-d23b2a23eca2.png',
    tags: ['Business', 'Professional', 'All Season']
  }
];

const ShowroomPreviewCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Card className="glass-dark border-white/10 overflow-hidden shadow-xl">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
          How Virtual Try-On Works
        </h2>
        
        <p className="text-white/70 mb-6">
          Upload your photo and see how these outfits will look on you with our AI-powered virtual styling.
        </p>
        
        <Carousel 
          opts={{ loop: true }}
          onSelect={(api) => {
            if (api) {
              setActiveIndex(api.selectedScrollSnap());
            }
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {previewExamples.map((example, index) => (
              <CarouselItem key={example.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <motion.img 
                        src={example.imageUrl} 
                        alt={example.title}
                        className="w-full h-full object-cover transition-transform"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-medium text-lg">{example.title}</h3>
                        <p className="text-white/80 text-sm">{example.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {example.tags.map(tag => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="bg-white/20 hover:bg-white/30 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-black/30 hover:bg-black/50 border-white/10" />
          <CarouselNext className="right-2 bg-black/30 hover:bg-black/50 border-white/10" />
        </Carousel>
        
        <div className="flex justify-center mt-4">
          {previewExamples.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 mx-1 rounded-full transition-all ${
                index === activeIndex ? 'bg-purple-500 w-4' : 'bg-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowroomPreviewCarousel;
