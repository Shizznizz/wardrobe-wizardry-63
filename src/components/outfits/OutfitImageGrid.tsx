
import { ClothingItem } from '@/lib/types';
import OptimizedImage from '@/components/ui/optimized-image';
import { Shirt } from 'lucide-react';

interface OutfitImageGridProps {
  itemIds: string[];
  getClothingItemById: (id: string) => ClothingItem | undefined;
  clothingItems?: ClothingItem[]; // Optional prop for direct access to clothing items
}

const OutfitImageGrid = ({ itemIds, getClothingItemById, clothingItems }: OutfitImageGridProps) => {
  // Make sure itemIds is an array and it exists
  const safeItemIds = Array.isArray(itemIds) ? itemIds : [];
  
  // Determine grid layout based on number of items
  const getGridLayout = (count: number) => {
    if (count === 1) return "grid-cols-1 grid-rows-1";
    if (count === 2) return "grid-cols-2 grid-rows-1";
    if (count === 3) return "grid-cols-2 grid-rows-2";
    if (count === 4) return "grid-cols-2 grid-rows-2";
    if (count > 4) return "grid-cols-3 grid-rows-2";
    return "grid-cols-2 grid-rows-2"; // Default
  };
  
  // Get direct item finder function if clothingItems is provided
  const findItem = (itemId: string): ClothingItem | undefined => {
    if (clothingItems) {
      return clothingItems.find(item => item.id === itemId);
    }
    return getClothingItemById(itemId);
  };
  
  // Limit to max 6 items for display
  const displayItemIds = safeItemIds.slice(0, 6);
  const gridLayout = getGridLayout(displayItemIds.length);
  
  if (displayItemIds.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white/40 flex flex-col items-center">
          <Shirt className="h-10 w-10 mb-2" />
          <p className="text-sm">No items</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`absolute inset-0 grid ${gridLayout} gap-1 p-2`}>
      {displayItemIds.map((itemId, index) => {
        const item = findItem(itemId);
        
        // Calculate spans for first item in some layouts
        const isFirstItem = index === 0;
        const shouldSpanWide = displayItemIds.length === 3 && isFirstItem;
        const shouldSpanFull = displayItemIds.length === 1 && isFirstItem;
        
        const spanClasses = shouldSpanFull 
          ? "col-span-2 row-span-2" 
          : shouldSpanWide 
            ? "col-span-2" 
            : "";
        
        return (
          <div 
            key={`${itemId}-${index}`} 
            className={`overflow-hidden ${spanClasses}`}
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
                <div className="text-gray-400 text-xs flex flex-col items-center justify-center h-full">
                  <Shirt className="h-5 w-5 mb-1" />
                  <span>{item?.name || 'Item'}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OutfitImageGrid;
