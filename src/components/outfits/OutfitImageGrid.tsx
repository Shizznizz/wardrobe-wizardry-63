
import { ClothingItem } from '@/lib/types';
import OptimizedImage from '@/components/ui/optimized-image';

interface OutfitImageGridProps {
  itemIds: string[];
  getClothingItemById: (id: string) => ClothingItem | undefined;
  clothingItems?: ClothingItem[]; // Optional prop for direct access to clothing items
}

const OutfitImageGrid = ({ itemIds, getClothingItemById, clothingItems }: OutfitImageGridProps) => {
  // Make sure itemIds is an array and it exists
  const safeItemIds = Array.isArray(itemIds) ? itemIds : [];
  
  return (
    <div className="absolute inset-0 flex flex-wrap justify-center items-center p-2 gap-1">
      {safeItemIds.slice(0, 4).map((itemId, index) => {
        const item = getClothingItemById(itemId);
        return (
          <div 
            key={index} 
            className="w-1/2 h-1/2 p-1.5 overflow-hidden"
          >
            <div className="bg-slate-800 rounded-md h-full w-full overflow-hidden flex items-center justify-center">
              {item?.imageUrl ? (
                <OptimizedImage 
                  src={item.imageUrl} 
                  alt={item.name || 'Clothing item'} 
                  className="h-full w-full object-cover rounded-md"
                  showSkeleton={true}
                  fallbackSrc="/placeholder.svg"
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
