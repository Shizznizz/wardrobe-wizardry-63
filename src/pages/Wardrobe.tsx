import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import WardrobeGrid from '@/components/WardrobeGrid';
import OliviaBloomAdvisor from '@/components/OliviaBloomAdvisor';
import OliviaBloomAssistant from '@/components/OliviaBloomAssistant';
import OliviaTips from '@/components/OliviaTips';
import UploadModal from '@/components/UploadModal';
import { ClothingItem, ClothingType, Outfit, OutfitLog } from '@/lib/types';
import { sampleClothingItems, sampleOutfits, sampleUserPreferences } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { Confetti } from '@/components/ui/confetti';
import { cn } from "@/lib/utils";
import { 
  ArrowUpDown, 
  Info, 
  Shirt, 
  Sparkles, 
  LayoutGrid, 
  X, 
  ChevronDown, 
  AlertCircle, 
  Trash2, 
  Check,
  Grid3X3,
  List,
  Clock,
  CloudSun,
  Layers,
  Puzzle
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import OutfitMatchModal from '@/components/OutfitMatchModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ClothingItemDetail from '@/components/wardrobe/ClothingItemDetail';

const Wardrobe = () => {
  // ... keep existing code (the rest of the file)
};
