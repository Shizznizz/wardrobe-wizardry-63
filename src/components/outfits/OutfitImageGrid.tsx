
import { ClothingItem, Outfit } from '@/lib/types';

interface OutfitImageGridProps {
  itemIds?: string[];
  outfit?: Outfit;
  clothingItems: ClothingItem[];
  getClothingItemById?: (id: string) => ClothingItem | undefined;
  className?: string;
}

const OutfitImageGrid = ({ 
  itemIds, 
  outfit, 
  clothingItems, 
  getClothingItemById,
  className = "" 
}: OutfitImageGridProps) => {
  // Handle case where outfit is provided instead of itemIds
  const displayItemIds = itemIds || (outfit?.items || []);
  
  // If getClothingItemById is not provided, create a default function
  const getItem = getClothingItemById || ((id: string) => {
    return clothingItems.find(item => item && item.id === id);
  });
  
  if (!displayItemIds || displayItemIds.length === 0) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
        <p className="text-sm text-white/50">No items to display</p>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 flex flex-wrap justify-center items-center p-2 gap-1 ${className}`}>
      {displayItemIds.slice(0, 4).map((itemId, index) => {
        const item = getItem(itemId);
        return (
          <div 
            key={index} 
            className="w-1/2 h-1/2 p-1.5 overflow-hidden"
          >
            <div className="bg-slate-800 rounded-md h-full w-full overflow-hidden flex items-center justify-center">
              {item?.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <div className="text-gray-400 text-xs">{item?.name || 'Unknown Item'}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OutfitImageGrid;
