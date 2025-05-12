
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Eye, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Outfit } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface OutfitCarouselProps {
  outfits: Outfit[];
  onPreview: (outfit: Outfit) => void;
  title?: string;
  disabled?: boolean;
}

const OutfitCarousel = ({ outfits, onPreview, title = "Outfits", disabled = false }: OutfitCarouselProps) => {
  const isMobile = useIsMobile();
  
  // Outfit descriptions that reflect Olivia's voice - friendly, feminine, confident
  const outfitDescriptions: Record<string, string> = {
    'Spring Elegance': 'Perfect for garden parties and afternoon tea',
    'Summer Vibes': 'Light and fresh for warm beach days',
    'Fall Classic': 'Cozy layers for crisp autumn air',
    'Winter Chic': 'Sophisticated warmth for holiday gatherings',
    'Trending Style': 'What everyone\'s wearing right now',
    'Office Ready': 'Polished looks that mean business',
    'Date Night': 'Turning heads while staying true to you',
    'Weekend Casual': 'Effortless style for your days off',
    'Pastel Paradise': 'Soft hues for those first warm days',
    'Rain Ready': 'Stylish options for unpredictable spring showers',
    'Spring Office': 'Light layers for the workplace transition',
    'Tropical Sunset': 'Vibrant prints for vacation moments',
    'Summer Nights': 'Breezy elegance for evening soirées',
    'Summer Office': 'Stay cool while staying professional',
    'Harvest Hues': 'Warm tones that capture the changing leaves',
    'Weekend Getaway': 'Versatile pieces for autumn adventures',
    'Autumn Office': 'Sophisticated layers for workplace comfort',
    'Cozy Cabin': 'Warm layers for fireside relaxation',
    'Snow Queen': 'Statement pieces for winter wonderland events',
    'Winter Office': 'Professional looks that beat the chill'
  };

  // Real clothing items per outfit - these would normally come from the database
  const outfitItems: Record<string, Array<{image: string, name: string}>> = {
    'Spring Elegance': [
      {image: '/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png', name: 'Floral Blouse'},
      {image: '/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png', name: 'White Midi Skirt'},
      {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'Strappy Sandals'},
      {image: '/lovable-uploads/db51966b-4679-4d51-81f2-8844a7a57817.png', name: 'Straw Hat'}
    ],
    'Summer Vibes': [
      {image: '/lovable-uploads/e8fc1e11-c29c-400b-8e33-2577a311b453.png', name: 'Blue Tank Top'},
      {image: '/lovable-uploads/5c9492c5-2df1-4f02-8d61-70fd1e57a6af.png', name: 'Denim Shorts'},
      {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'White Sneakers'},
      {image: '/lovable-uploads/075a98ab-d879-4919-8898-87590f8f919a.png', name: 'Tote Bag'}
    ],
    'Fall Classic': [
      {image: '/lovable-uploads/f0afcad3-9696-4e23-a118-04525585d72a.png', name: 'Knit Sweater'},
      {image: '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png', name: 'Skinny Jeans'},
      {image: '/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png', name: 'Ankle Boots'},
      {image: '/lovable-uploads/f29b0fb8-330c-409a-8488-2e7ae2b351ed.png', name: 'Wool Scarf'}
    ],
    'Winter Chic': [
      {image: '/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png', name: 'Cashmere Cardigan'},
      {image: '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png', name: 'Plaid Skirt'},
      {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Knee-high Boots'},
      {image: '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png', name: 'Statement Earrings'}
    ],
    'Trending Style': [
      {image: '/lovable-uploads/f19c0a23-eb9d-4387-b2cf-7cfa1c908099.png', name: 'Oversized Blazer'},
      {image: '/lovable-uploads/05c430e3-091c-4f96-a77b-c360610435d3.png', name: 'Wide Leg Pants'},
      {image: '/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png', name: 'Platform Loafers'},
      {image: '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png', name: 'Gold Hoops'}
    ],
    'Office Ready': [
      {image: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png', name: 'Button-up Shirt'},
      {image: '/lovable-uploads/7fc023d8-bd78-47c7-8725-d8cb48855e20.png', name: 'Tailored Trousers'},
      {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Leather Pumps'},
      {image: '/lovable-uploads/2551cee7-6f38-4c04-b656-16c188b19ace.png', name: 'Structured Bag'}
    ],
    'Date Night': [
      {image: '/lovable-uploads/44448809-be5b-44da-a910-3f9b0e36264b.png', name: 'Satin Cami'},
      {image: '/lovable-uploads/d39047b3-c0ad-4b2c-9d73-c654479f56c4.png', name: 'Leather Skirt'},
      {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Strappy Heels'},
      {image: '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png', name: 'Layered Necklace'}
    ],
    'Weekend Casual': [
      {image: '/lovable-uploads/c0be3b58-4cc0-4277-8c62-da17547e44ff.png', name: 'Graphic Tee'},
      {image: '/lovable-uploads/9d6d8627-f9d3-4af3-a5ec-7b2498799ab2.png', name: 'Boyfriend Jeans'},
      {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'Canvas Sneakers'},
      {image: '/lovable-uploads/352f9956-7bac-4f42-a91b-d20e04157b0d.png', name: 'Baseball Cap'}
    ],
    'Pastel Paradise': [
      {image: '/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png', name: 'Lavender Cardigan'},
      {image: '/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png', name: 'Mint Culotte Pants'},
      {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'White Canvas Sneakers'},
      {image: '/lovable-uploads/db51966b-4679-4d51-81f2-8844a7a57817.png', name: 'Pink Crossbody Bag'}
    ],
    'Rain Ready': [
      {image: '/lovable-uploads/f19c0a23-eb9d-4387-b2cf-7cfa1c908099.png', name: 'Trench Coat'},
      {image: '/lovable-uploads/05c430e3-091c-4f96-a77b-c360610435d3.png', name: 'Straight-leg Jeans'},
      {image: '/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png', name: 'Chelsea Rain Boots'},
      {image: '/lovable-uploads/075a98ab-d879-4919-8898-87590f8f919a.png', name: 'Waterproof Tote'}
    ],
    'Spring Office': [
      {image: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png', name: 'Lightweight Blazer'},
      {image: '/lovable-uploads/c937b60e-901e-48ae-b01d-28d901a11503.png', name: 'Silk Button-up'},
      {image: '/lovable-uploads/7fc023d8-bd78-47c7-8725-d8cb48855e20.png', name: 'Cropped Pants'},
      {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'Pointed Flats'}
    ],
    'Tropical Sunset': [
      {image: '/lovable-uploads/44448809-be5b-44da-a910-3f9b0e36264b.png', name: 'Printed Sundress'},
      {image: '/lovable-uploads/5c9492c5-2df1-4f02-8d61-70fd1e57a6af.png', name: 'Straw Sun Hat'},
      {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'Espadrille Sandals'},
      {image: '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png', name: 'Shell Necklace'}
    ],
    'Summer Nights': [
      {image: '/lovable-uploads/44448809-be5b-44da-a910-3f9b0e36264b.png', name: 'Satin Cami'},
      {image: '/lovable-uploads/d39047b3-c0ad-4b2c-9d73-c654479f56c4.png', name: 'Flowy Maxi Skirt'},
      {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Strappy Heels'},
      {image: '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png', name: 'Gold Bangles'}
    ],
    'Summer Office': [
      {image: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png', name: 'Linen Blazer'},
      {image: '/lovable-uploads/e8fc1e11-c29c-400b-8e33-2577a311b453.png', name: 'Sleeveless Blouse'},
      {image: '/lovable-uploads/28e5664c-3c8a-4b7e-9c99-065ad489583f.png', name: 'Culotte Pants'},
      {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Block Heel Pumps'}
    ],
    'Harvest Hues': [
      {image: '/lovable-uploads/f0afcad3-9696-4e23-a118-04525585d72a.png', name: 'Rust Turtleneck'},
      {image: '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png', name: 'Corduroy Skirt'},
      {image: '/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png', name: 'Leather Boots'},
      {image: '/lovable-uploads/2551cee7-6f38-4c04-b656-16c188b19ace.png', name: 'Suede Crossbody'}
    ],
    'Weekend Getaway': [
      {image: '/lovable-uploads/f19c0a23-eb9d-4387-b2cf-7cfa1c908099.png', name: 'Utility Jacket'},
      {image: '/lovable-uploads/c0be3b58-4cc0-4277-8c62-da17547e44ff.png', name: 'Flannel Shirt'},
      {image: '/lovable-uploads/9d6d8627-f9d3-4af3-a5ec-7b2498799ab2.png', name: 'Boyfriend Jeans'},
      {image: '/lovable-uploads/547609e6-3e31-4592-9c0c-a9a94e8e4996.png', name: 'Hiking Sneakers'}
    ],
    'Autumn Office': [
      {image: '/lovable-uploads/f19c0a23-eb9d-4387-b2cf-7cfa1c908099.png', name: 'Oversized Blazer'},
      {image: '/lovable-uploads/7fc023d8-bd78-47c7-8725-d8cb48855e20.png', name: 'Fine-knit Sweater'},
      {image: '/lovable-uploads/05c430e3-091c-4f96-a77b-c360610435d3.png', name: 'Tailored Pants'},
      {image: '/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png', name: 'Loafers'}
    ],
    'Cozy Cabin': [
      {image: '/lovable-uploads/f0afcad3-9696-4e23-a118-04525585d72a.png', name: 'Cable Knit Sweater'},
      {image: '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png', name: 'Fleece-lined Leggings'},
      {image: '/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png', name: 'Shearling Boots'},
      {image: '/lovable-uploads/f29b0fb8-330c-409a-8488-2e7ae2b351ed.png', name: 'Chunky Scarf'}
    ],
    'Snow Queen': [
      {image: '/lovable-uploads/c26c0c8c-7ff3-432a-b79b-1d22494daba6.png', name: 'White Faux Fur Coat'},
      {image: '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png', name: 'Silver Sequin Dress'},
      {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Crystal Heels'},
      {image: '/lovable-uploads/6d16aa51-bd78-4fb4-a783-8d27a089e19f.png', name: 'Diamond Earrings'}
    ],
    'Winter Office': [
      {image: '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png', name: 'Wool Blazer'},
      {image: '/lovable-uploads/7fc023d8-bd78-47c7-8725-d8cb48855e20.png', name: 'Cashmere Turtleneck'},
      {image: '/lovable-uploads/e41d700a-84eb-4544-9ffc-b68b82f30f7e.png', name: 'Tailored Trousers'},
      {image: '/lovable-uploads/2551cee7-6f38-4c04-b656-16c188b19ace.png', name: 'Leather Tote'}
    ]
  };

  // Helper function to process outfits with their detailed items
  const getOutfitItems = (outfit: Outfit) => {
    const itemsFromOutfit = outfit.itemDetails 
      ? outfit.itemDetails 
      : outfitItems[outfit.name] || [];
      
    return itemsFromOutfit;
  };

  // Helper function to get a description for the outfit
  const getOutfitDescription = (outfit: Outfit) => {
    return outfit.description || outfitDescriptions[outfit.name] || "Olivia's curated selection";
  };

  return (
    <div className="relative">
      {title && <h3 className="text-lg font-medium mb-3 text-white/90">{title}</h3>}
      
      <Carousel 
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {outfits.map((outfit) => (
            <CarouselItem 
              key={outfit.id} 
              className={`pl-2 md:pl-4 ${isMobile ? 'basis-full' : 'basis-1/2 lg:basis-1/3 xl:basis-1/4'}`}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 8px 32px -4px rgba(155, 135, 245, 0.3)'
                }}
                transition={{ duration: 0.2 }}
                className="rounded-xl overflow-hidden bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-white/10 h-full"
              >
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h4 className="text-white font-medium text-lg">{outfit.name}</h4>
                    {outfit.seasons?.includes('winter') && <span className="text-sm">❄️</span>}
                    {outfit.seasons?.includes('spring') && <span className="text-sm">🌸</span>}
                    {outfit.seasons?.includes('summer') && <span className="text-sm">☀️</span>}
                    {outfit.seasons?.includes('autumn') && <span className="text-sm">🍂</span>}
                  </div>
                  <p className="text-white/70 text-sm italic mb-3">
                    {getOutfitDescription(outfit)}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {getOutfitItems(outfit).slice(0, 4).map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="aspect-square rounded-lg overflow-hidden border border-white/10 relative group"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-full h-full bg-slate-800">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-2">
                            <span className="text-white text-xs font-medium">{item.name}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {outfit.seasons?.map((season) => (
                      <Badge 
                        key={`season-${season}`} 
                        variant="outline" 
                        className="text-xs bg-blue-500/20 border-blue-500/30 text-blue-200"
                      >
                        {season}
                      </Badge>
                    ))}
                    
                    {outfit.occasions?.map((occasion) => (
                      <Badge 
                        key={`occasion-${occasion}`} 
                        variant="outline" 
                        className="text-xs bg-purple-500/20 border-purple-500/30 text-purple-200"
                      >
                        {occasion}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => onPreview(outfit)}
                    disabled={disabled}
                    variant="outline"
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-white/10 text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:border-purple-300/30 group"
                  >
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Eye className="mr-2 h-3.5 w-3.5 text-white/80 group-hover:text-white" />
                      <span>Try This Look</span>
                      <ArrowRight className="ml-2 h-3.5 w-3.5 text-white/70 group-hover:text-white" />
                    </motion.div>
                  </Button>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-end gap-2 mt-2">
          <CarouselPrevious className="static mx-0 translate-y-0 border-white/20 bg-slate-800/80 text-white hover:bg-slate-700/90 hover:border-white/30" />
          <CarouselNext className="static mx-0 translate-y-0 border-white/20 bg-slate-800/80 text-white hover:bg-slate-700/90 hover:border-white/30" />
        </div>
      </Carousel>
    </div>
  );
};

export default OutfitCarousel;
