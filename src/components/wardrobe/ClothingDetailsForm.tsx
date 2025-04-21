
import { ClothingType, ClothingColor, ClothingMaterial, ClothingSeason } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
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

      <div className="grid grid-cols-2 gap-4">
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
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <ScrollArea className="h-[200px]">
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
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <ScrollArea className="h-[200px]">
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="navy">Navy</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="brown">Brown</SelectItem>
                <SelectItem value="beige">Beige</SelectItem>
                <SelectItem value="cream">Cream</SelectItem>
                <SelectItem value="burgundy">Burgundy</SelectItem>
                <SelectItem value="coral">Coral</SelectItem>
                <SelectItem value="rose">Rose</SelectItem>
                <SelectItem value="multicolor">Multicolor</SelectItem>
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
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <ScrollArea className="h-[200px]">
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
