
import { Briefcase, Shirt, Sunset, Leaf, FlowerIcon, Sun } from "lucide-react";
import { OutfitItem } from "./types";

export const outfitItems: OutfitItem[] = [
  {
    id: 1,
    name: "Business Casual",
    image: "/lovable-uploads/ca91e684-af2e-416d-a94c-9adf43d54288.png",
    quote: "Effortless professionalism with comfort in mind",
    colors: ["blue", "yellow", "white"],
    season: "All year",
    gradient: "from-blue-400/70 to-gray-400/70",
    icon: Briefcase
  },
  {
    id: 2,
    name: "Winter Formal",
    image: "/lovable-uploads/1598554e-fc76-4ffa-b527-e0c5f4292f0b.png",
    quote: "Cozy layers with elegant sophistication",
    colors: ["black", "burgundy", "silver"],
    season: "Winter",
    gradient: "from-purple-800/70 to-gray-800/70",
    icon: Shirt
  },
  {
    id: 3,
    name: "Summer Breeze",
    image: "/lovable-uploads/92cf4e4f-c3fd-4d7f-9006-dc5d5f5a46b3.png",
    quote: "Light fabrics that flow with every step",
    colors: ["beige", "cream", "tan"],
    season: "Summer",
    gradient: "from-teal-400/70 to-blue-200/70",
    icon: Sunset
  },
  {
    id: 4,
    name: "Autumn Layers",
    image: "/lovable-uploads/27cd65da-fcc7-498b-90fb-f5332875e2f3.png",
    quote: "Rich textures that embrace the changing leaves",
    colors: ["green", "brown", "beige"],
    season: "Autumn",
    gradient: "from-amber-600/70 to-orange-300/70",
    icon: Leaf
  },
  {
    id: 5,
    name: "Spring Pastel",
    image: "/lovable-uploads/4a35e171-06c0-4996-ac15-61b2f7358f92.png",
    quote: "Soft hues that bloom with the season",
    colors: ["camel", "cream", "beige"],
    season: "Spring",
    gradient: "from-purple-300/70 to-green-200/70",
    icon: FlowerIcon
  },
  {
    id: 6,
    name: "June Collection",
    image: "/lovable-uploads/340ce8c6-e90a-46a2-9c66-701ec740250d.png",
    quote: "Breezy elegance for sunny beach days",
    colors: ["beige", "sand", "straw"],
    season: "Summer",
    gradient: "from-amber-300/70 to-orange-200/70",
    icon: Sun
  }
];
