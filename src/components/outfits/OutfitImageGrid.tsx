
import { ClothingItem } from '@/lib/types';

interface OutfitImageGridProps {
  itemIds: string[];
  getClothingItemById: (id: string) => ClothingItem | undefined;
}

const OutfitImageGrid = ({ itemIds, getClothingItemById }: OutfitImageGridProps) => {
  return (
    <div className="absolute inset-0 flex flex-wrap justify-center items-center p-2 gap-1">
      {itemIds.slice(0, 4).map((itemId, index) => {
        const item = getClothingItemById(itemId);
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
