import React from 'react';
import OutfitPreviewCard from '@/components/outfits/OutfitPreviewCard';
import { Outfit, ClothingItem } from '@/lib/types';

const mockClothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    category: 'tops',
    subcategory: 't-shirts',
    color: 'white',
    brand: 'Basic Brand',
    size: 'M',
    season: ['spring', 'summer'],
    occasions: ['casual'],
    image_url: '/placeholder-top.jpg',
    user_id: 'test-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Blue Denim Jeans',
    category: 'bottoms',
    subcategory: 'jeans',
    color: 'blue',
    brand: 'Denim Co',
    size: '32',
    season: ['spring', 'fall'],
    occasions: ['casual'],
    image_url: '/placeholder-bottom.jpg',
    user_id: 'test-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'White Sneakers',
    category: 'shoes',
    subcategory: 'sneakers',
    color: 'white',
    brand: 'Sneaker Brand',
    size: '10',
    season: ['spring', 'summer', 'fall'],
    occasions: ['casual', 'athletic'],
    image_url: '/placeholder-shoes.jpg',
    user_id: 'test-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockOutfit: Outfit = {
  id: 'test-outfit-1',
  name: 'Casual Day Look',
  items: ['1', '2', '3'],
  season: ['spring', 'summer'],
  occasions: ['casual'],
  user_id: 'test-user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const OutfitPreviewTest = () => {
  const getClothingItemById = (id: string) => {
    return mockClothingItems.find(item => item.id === id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          OutfitPreviewCard Component Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OutfitPreviewCard
            outfit={mockOutfit}
            clothingItems={mockClothingItems}
            getClothingItemById={getClothingItemById}
            stylingTip={{
              title: "Perfect Casual Look",
              description: "This classic combination of a white t-shirt and blue jeans creates a timeless casual look. The white sneakers add a fresh, clean finish that works for any casual occasion."
            }}
            weatherInfo={{
              temperature: "72°F",
              condition: "Sunny"
            }}
            activityInfo={{
              activity: "Weekend Brunch",
              timeOfDay: 'afternoon'
            }}
          />
          
          <OutfitPreviewCard
            outfit={{
              ...mockOutfit,
              id: 'test-outfit-2',
              name: 'Evening Style',
              season: ['fall', 'winter']
            }}
            clothingItems={mockClothingItems}
            getClothingItemById={getClothingItemById}
            stylingTip={{
              title: "Effortless Elegance",
              description: "Elevate your casual pieces with thoughtful styling. The key is in the details and how you carry yourself."
            }}
            weatherInfo={{
              temperature: "65°F",
              condition: "Partly Cloudy"
            }}
            activityInfo={{
              activity: "Dinner Date",
              timeOfDay: 'evening'
            }}
          />
          
          <OutfitPreviewCard
            outfit={{
              ...mockOutfit,
              id: 'test-outfit-3',
              name: 'Active Day',
              occasions: ['athletic', 'casual']
            }}
            clothingItems={mockClothingItems}
            getClothingItemById={getClothingItemById}
            stylingTip={{
              title: "Comfort Meets Style",
              description: "Perfect for an active day while still looking put-together. These pieces transition seamlessly from workout to coffee run."
            }}
            weatherInfo={{
              temperature: "68°F",
              condition: "Clear"
            }}
            activityInfo={{
              activity: "Morning Workout",
              timeOfDay: 'morning'
            }}
          />
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Component Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Responsive Layout</h3>
              <p className="text-sm text-white/80">Stacked on mobile, grid on desktop</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Hover Interactions</h3>
              <p className="text-sm text-white/80">Weather & activity info on hover/tap</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Olivia's Tips</h3>
              <p className="text-sm text-white/80">Personalized styling advice</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Image Placeholders</h3>
              <p className="text-sm text-white/80">Top, bottom, shoes, accessories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitPreviewTest;
