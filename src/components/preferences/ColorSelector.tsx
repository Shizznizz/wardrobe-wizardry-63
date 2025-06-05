
import React from 'react';
import { ClothingColor } from '@/lib/types';
import { Check } from 'lucide-react';

interface ColorOption {
  label: string;
  value: ClothingColor;
}

interface ColorSelectorProps {
  selected: string[];
  options: ColorOption[];
  onChange: (colors: string[]) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selected, options, onChange }) => {
  const toggleColor = (color: string) => {
    if (selected.includes(color)) {
      onChange(selected.filter(c => c !== color));
    } else {
      onChange([...selected, color]);
    }
  };

  const getColorClass = (color: ClothingColor): string => {
    const colorMap: Record<ClothingColor, string> = {
      black: 'bg-black',
      white: 'bg-white border border-gray-300',
      gray: 'bg-gray-500',
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-400',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      orange: 'bg-orange-500',
      brown: 'bg-amber-800',
      navy: 'bg-blue-900',
      beige: 'bg-amber-100 border border-gray-300',
      cream: 'bg-amber-50 border border-gray-300',
      coral: 'bg-coral-500',
      burgundy: 'bg-red-900',
      multicolor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500',
      rose: 'bg-rose-400',
      gold: 'bg-amber-500',
      silver: 'bg-gray-300',
      maroon: 'bg-red-800',
      teal: 'bg-teal-500',
      lavender: 'bg-purple-300',
      mint: 'bg-green-300',
      peach: 'bg-orange-300',
      olive: 'bg-green-700',
      turquoise: 'bg-cyan-500',
      'light blue': 'bg-sky-300'
    };
    
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => toggleColor(option.value)}
          className={`relative w-10 h-10 rounded-full overflow-hidden transition-all duration-200 ${
            selected.includes(option.value) ? 'ring-2 ring-offset-2 ring-purple-500' : ''
          }`}
          title={option.label}
        >
          <div className={`absolute inset-0 ${getColorClass(option.value)}`} />
          {selected.includes(option.value) && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Check className={`h-4 w-4 ${option.value === 'white' || option.value === 'beige' || option.value === 'cream' || option.value === 'silver' || option.value === 'lavender' || option.value === 'mint' || option.value === 'peach' ? 'text-black' : 'text-white'}`} />
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ColorSelector;
