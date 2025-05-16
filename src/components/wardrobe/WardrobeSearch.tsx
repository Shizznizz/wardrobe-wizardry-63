
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import WardrobeStats from '@/components/wardrobe/WardrobeStats';

interface WardrobeSearchProps {
  onSearch: (query: string) => void;
  className?: string;
}

const WardrobeSearch = ({ onSearch, className }: WardrobeSearchProps) => {
  const [query, setQuery] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-white/50" />
        </div>
        <Input
          type="search"
          placeholder="Search by name, color, or type..."
          value={query}
          onChange={handleSearch}
          className="pl-9 bg-slate-800/40 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-purple-500/50"
        />
      </div>
      <div className="flex-shrink-0">
        <WardrobeStats />
      </div>
    </div>
  );
};

export default WardrobeSearch;
