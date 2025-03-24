
import { ClothingType, ClothingColor, ClothingMaterial, ClothingSeason } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="White T-Shirt"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as ClothingType)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shirt">Shirt</SelectItem>
              <SelectItem value="jeans">Jeans</SelectItem>
              <SelectItem value="pants">Pants</SelectItem>
              <SelectItem value="shorts">Shorts</SelectItem>
              <SelectItem value="sweater">Sweater</SelectItem>
              <SelectItem value="hoodie">Hoodie</SelectItem>
              <SelectItem value="jacket">Jacket</SelectItem>
              <SelectItem value="dress">Dress</SelectItem>
              <SelectItem value="skirt">Skirt</SelectItem>
              <SelectItem value="shoes">Shoes</SelectItem>
              <SelectItem value="sneakers">Sneakers</SelectItem>
              <SelectItem value="boots">Boots</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Select
            value={color}
            onValueChange={(value) => setColor(value as ClothingColor)}
          >
            <SelectTrigger id="color">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="black">Black</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="gray">Gray</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="yellow">Yellow</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="pink">Pink</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="brown">Brown</SelectItem>
              <SelectItem value="multicolor">Multicolor</SelectItem>
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
          <SelectTrigger id="material">
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cotton">Cotton</SelectItem>
            <SelectItem value="wool">Wool</SelectItem>
            <SelectItem value="silk">Silk</SelectItem>
            <SelectItem value="polyester">Polyester</SelectItem>
            <SelectItem value="leather">Leather</SelectItem>
            <SelectItem value="denim">Denim</SelectItem>
            <SelectItem value="linen">Linen</SelectItem>
            <SelectItem value="other">Other</SelectItem>
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
        />
        <Label htmlFor="favorite" className="cursor-pointer">
          Mark as favorite
        </Label>
      </div>
    </div>
  );
};

export default ClothingDetailsForm;
