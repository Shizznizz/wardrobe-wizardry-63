import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

const outfitStyleLabel = (tags = []) =>
  tags.length
    ? tags.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')
    : '';

const OliviaRecommendationAfterQuiz = ({ quizAnswers, outfit, clothingItems }) => {
  if (!outfit) {
    return (
      <div className="text-white/80 p-6 text-center">No suitable outfit found. Try updating your wardrobe for better suggestions!</div>
    );
  }

  const items = (outfit.items || []).map((itemId) =>
    clothingItems.find((ci) => ci.id === itemId)
  ).filter(Boolean);

  // Group items by type for better display organization
  const itemsByCategory = {
    tops: items.filter(item => 
      ['top', 'shirt', 'blouse', 't-shirt', 'sweater', 'jacket', 'hoodie', 'coat', 'blazer', 'cardigan'].includes(item.type.toLowerCase())
    ),
    bottoms: items.filter(item => 
      ['bottom', 'pants', 'jeans', 'skirt', 'shorts', 'trousers'].includes(item.type.toLowerCase())
    ),
    footwear: items.filter(item => 
      ['shoes', 'sneakers', 'boots', 'sandals'].includes(item.type.toLowerCase())
    ),
    accessories: items.filter(item => 
      ['accessory', 'hat', 'scarf', 'jewelry', 'belt', 'watch'].includes(item.type.toLowerCase())
    ),
    other: items.filter(item => 
      !['top', 'shirt', 'blouse', 't-shirt', 'sweater', 'jacket', 'hoodie', 'coat', 'blazer', 'cardigan',
        'bottom', 'pants', 'jeans', 'skirt', 'shorts', 'trousers',
        'shoes', 'sneakers', 'boots', 'sandals',
        'accessory', 'hat', 'scarf', 'jewelry', 'belt', 'watch'].includes(item.type.toLowerCase())
    )
  };

  // Determine if we have a complete outfit (at least top and bottom)
  const hasCompleteOutfit = itemsByCategory.tops.length > 0 && itemsByCategory.bottoms.length > 0;

  return (
    <Card className="bg-gradient-to-br from-purple-800/80 to-pink-900/50 shadow-xl border border-white/10">
      <CardContent className="p-6">
        <div className="flex gap-4 items-center mb-4">
          <Avatar className="h-12 w-12 border-2 border-purple-400/50">
            <AvatarImage src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" alt="Olivia Bloom" />
            <AvatarFallback className="bg-purple-800">OB</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-white text-lg font-semibold mb-0.5">Olivia's Pick for You</h4>
            <p className="text-white/80 text-sm">
              Based on your answers, I think you'll love this outfit:{' '}
              <span className="font-semibold text-pink-300">
                {outfit.name}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-2">
          <span className="text-white/70 text-xs uppercase tracking-wide">Occasion:</span>
          <span className="ml-2 text-pink-200">{outfit.occasion || 'Any'}</span>
        </div>
        <div className="mb-4">
          <span className="text-white/70 text-xs uppercase tracking-wide">Style:</span>
          <span className="ml-2 text-purple-200">{outfitStyleLabel(outfit.tags)}</span>
        </div>

        {!hasCompleteOutfit && (
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-md p-3 mb-4">
            <p className="text-yellow-200 text-sm">
              Your wardrobe is missing some key items to create a complete outfit. Consider adding more pieces!
            </p>
          </div>
        )}

        {/* Display outfit items by category */}
        <div className="space-y-4">
          {/* Tops Section */}
          {itemsByCategory.tops.length > 0 && (
            <div>
              <h5 className="text-white/90 text-sm font-medium mb-2">Tops</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {itemsByCategory.tops.map((item) => (
                  <div key={item.id} className="rounded-xl overflow-hidden border border-pink-400/10 bg-gradient-to-br from-white/5 to-purple-700/20 shadow-md flex flex-col items-center justify-between py-2 px-2">
                    <img
                      src={item.imageUrl || item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-20 object-cover rounded-md mb-1"
                      style={{ maxHeight: 80 }}
                    />
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-pink-400" />
                      <span className="text-pink-200 text-xs font-medium">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottoms Section */}
          {itemsByCategory.bottoms.length > 0 && (
            <div>
              <h5 className="text-white/90 text-sm font-medium mb-2">Bottoms</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {itemsByCategory.bottoms.map((item) => (
                  <div key={item.id} className="rounded-xl overflow-hidden border border-pink-400/10 bg-gradient-to-br from-white/5 to-purple-700/20 shadow-md flex flex-col items-center justify-between py-2 px-2">
                    <img
                      src={item.imageUrl || item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-20 object-cover rounded-md mb-1"
                      style={{ maxHeight: 80 }}
                    />
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-pink-400" />
                      <span className="text-pink-200 text-xs font-medium">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footwear Section */}
          {itemsByCategory.footwear.length > 0 && (
            <div>
              <h5 className="text-white/90 text-sm font-medium mb-2">Footwear</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {itemsByCategory.footwear.map((item) => (
                  <div key={item.id} className="rounded-xl overflow-hidden border border-pink-400/10 bg-gradient-to-br from-white/5 to-purple-700/20 shadow-md flex flex-col items-center justify-between py-2 px-2">
                    <img
                      src={item.imageUrl || item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-20 object-cover rounded-md mb-1"
                      style={{ maxHeight: 80 }}
                    />
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-pink-400" />
                      <span className="text-pink-200 text-xs font-medium">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accessories Section */}
          {itemsByCategory.accessories.length > 0 && (
            <div>
              <h5 className="text-white/90 text-sm font-medium mb-2">Accessories</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {itemsByCategory.accessories.map((item) => (
                  <div key={item.id} className="rounded-xl overflow-hidden border border-pink-400/10 bg-gradient-to-br from-white/5 to-purple-700/20 shadow-md flex flex-col items-center justify-between py-2 px-2">
                    <img
                      src={item.imageUrl || item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-20 object-cover rounded-md mb-1"
                      style={{ maxHeight: 80 }}
                    />
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-pink-400" />
                      <span className="text-pink-200 text-xs font-medium">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Items Section */}
          {itemsByCategory.other.length > 0 && (
            <div>
              <h5 className="text-white/90 text-sm font-medium mb-2">Other Items</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {itemsByCategory.other.map((item) => (
                  <div key={item.id} className="rounded-xl overflow-hidden border border-pink-400/10 bg-gradient-to-br from-white/5 to-purple-700/20 shadow-md flex flex-col items-center justify-between py-2 px-2">
                    <img
                      src={item.imageUrl || item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-20 object-cover rounded-md mb-1"
                      style={{ maxHeight: 80 }}
                    />
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-pink-400" />
                      <span className="text-pink-200 text-xs font-medium">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <span className="text-white/90 font-medium">Enjoy your day, styled by Olivia! 🌸</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OliviaRecommendationAfterQuiz;
