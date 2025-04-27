import { ClothingType, ClothingColor, ClothingMaterial, ClothingSeason } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import SeasonsSelector from './SeasonsSelector';

interface ClothingDetailsFormProps {
  name: string;
  setName: (value: string) => void;
  type: ClothingType | '';
  setType: (value: ClothingType) => void;
  color: ClothingColor | '';
  setColor: (value: ClothingColor) => void;
  material: ClothingMaterial | '';
  setMaterial: (value: ClothingMaterial) => void;
  seasons: ClothingSeason[];
  toggleSeason: (season: ClothingSeason) => void;
  favorite: boolean;
  setFavorite: (value: boolean) => void;
}

const ClothingDetailsForm = ({
  name,
  setName,
  type,
  setType,
  color,
  setColor,
  material,
  setMaterial,
  seasons,
  toggleSeason,
  favorite,
  setFavorite
}: ClothingDetailsFormProps) => {
  return (
    <div className="space-y-4 bg-transparent">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="White T-Shirt"
          className="bg-slate-800 border-slate-700 text-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as ClothingType)}
          >
            <SelectTrigger
              id="type"
              className="bg-slate-800 border-slate-700 text-white"
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent
              className="bg-slate-900 border-slate-700 text-white max-h-56 sm:max-h-60 overflow-y-auto"
              style={{ maxHeight: 220, overflowY: 'auto' }}
            >
              <ScrollArea className="h-56">
                <div className="p-1">
                  <SelectItem value="shirt">Shirt</SelectItem>
                  <SelectItem value="t-shirt">T-Shirt</SelectItem>
                  <SelectItem value="sweater">Sweater</SelectItem>
                  <SelectItem value="hoodie">Hoodie</SelectItem>
                  <SelectItem value="jacket">Jacket</SelectItem>
                  <SelectItem value="coat">Coat</SelectItem>
                  <SelectItem value="dress">Dress</SelectItem>
                  <SelectItem value="skirt">Skirt</SelectItem>
                  <SelectItem value="pants">Pants</SelectItem>
                  <SelectItem value="jeans">Jeans</SelectItem>
                  <SelectItem value="shorts">Shorts</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="boots">Boots</SelectItem>
                  <SelectItem value="sneakers">Sneakers</SelectItem>
                  <SelectItem value="sandals">Sandals</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </div>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Select
            value={color}
            onValueChange={(value) => setColor(value as ClothingColor)}
          >
            <SelectTrigger
              id="color"
              className="bg-slate-800 border-slate-700 text-white"
            >
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent
              align="center"
              className="bg-slate-900 border-slate-700 text-white max-h-[300px] overflow-y-auto"
            >
              <ScrollArea className="h-[300px] w-full p-1">
                <SelectItem value="black" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-black mr-2 border border-white/20" />
                  Black
                </SelectItem>
                <SelectItem value="white" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-white mr-2 border border-slate-200" />
                  White
                </SelectItem>
                <SelectItem value="gray" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-gray-500 mr-2" />
                  Gray
                </SelectItem>
                <SelectItem value="red" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2" />
                  Red
                </SelectItem>
                <SelectItem value="blue" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2" />
                  Blue
                </SelectItem>
                <SelectItem value="navy" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-900 mr-2" />
                  Navy
                </SelectItem>
                <SelectItem value="green" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
                  Green
                </SelectItem>
                <SelectItem value="yellow" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2" />
                  Yellow
                </SelectItem>
                <SelectItem value="purple" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-500 mr-2" />
                  Purple
                </SelectItem>
                <SelectItem value="pink" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-pink-500 mr-2" />
                  Pink
                </SelectItem>
                <SelectItem value="orange" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mr-2" />
                  Orange
                </SelectItem>
                <SelectItem value="brown" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-800 mr-2" />
                  Brown
                </SelectItem>
                <SelectItem value="beige" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-100 mr-2 border border-slate-200" />
                  Beige
                </SelectItem>
                <SelectItem value="cream" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-50 mr-2 border border-slate-200" />
                  Cream
                </SelectItem>
                <SelectItem value="burgundy" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-900 mr-2" />
                  Burgundy
                </SelectItem>
                <SelectItem value="coral" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-400 mr-2" />
                  Coral
                </SelectItem>
                <SelectItem value="rose" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-rose-400 mr-2" />
                  Rose
                </SelectItem>
                <SelectItem value="multicolor" className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mr-2" />
                  Multicolor
                </SelectItem>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="material">Material</Label>
        <Select
          value={material}
          onValueChange={(value) => setMaterial(value as ClothingMaterial)}
        >
          <SelectTrigger
            id="material"
            className="bg-slate-800 border-slate-700 text-white"
          >
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent
            className="bg-slate-900 border-slate-700 text-white max-h-56 sm:max-h-60 overflow-y-auto"
            style={{ maxHeight: 220, overflowY: 'auto' }}
          >
            <ScrollArea className="h-56">
              <div className="p-1">
                <SelectItem value="cotton">Cotton</SelectItem>
                <SelectItem value="wool">Wool</SelectItem>
                <SelectItem value="silk">Silk</SelectItem>
                <SelectItem value="polyester">Polyester</SelectItem>
                <SelectItem value="leather">Leather</SelectItem>
                <SelectItem value="denim">Denim</SelectItem>
                <SelectItem value="linen">Linen</SelectItem>
                <SelectItem value="cashmere">Cashmere</SelectItem>
                <SelectItem value="nylon">Nylon</SelectItem>
                <SelectItem value="spandex">Spandex</SelectItem>
                <SelectItem value="velvet">Velvet</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </div>
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <SeasonsSelector 
        selectedSeasons={seasons} 
        onToggleSeason={toggleSeason}
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="favorite"
          checked={favorite}
          onCheckedChange={(checked) => setFavorite(!!checked)}
          className="bg-slate-800 border-slate-600"
        />
        <Label
          htmlFor="favorite"
          className="cursor-pointer"
        >
          Mark as favorite
        </Label>
      </div>
    </div>
  );
};

export default ClothingDetailsForm;
