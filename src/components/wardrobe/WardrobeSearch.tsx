
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WardrobeSearchProps {
  onSearch: (query: string) => void;
}

const WardrobeSearch = ({ onSearch }: WardrobeSearchProps) => {
  const [query, setQuery] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };
  
  return (
    <div className="relative">
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
  );
};

export default WardrobeSearch;
