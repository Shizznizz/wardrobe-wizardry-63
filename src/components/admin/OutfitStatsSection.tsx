
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shirt, RefreshCw, AlertTriangle } from 'lucide-react';
import { adminService, OutfitSummary } from '@/services/AdminService';
import { toast } from 'sonner';

const OutfitStatsSection = () => {
  const [outfitSummary, setOutfitSummary] = useState<OutfitSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadOutfitSummary = async () => {
    try {
      setHasError(false);
      setIsLoading(true);
      const data = await adminService.getOutfitSummary();
      if (data) {
        setOutfitSummary(data);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error('Error loading outfit summary:', error);
      setHasError(true);
      toast.error('Failed to load outfit data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOutfitSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Outfit & Wardrobe Stats</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardHeader>
              <Skeleton className="h-4 w-32 bg-slate-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 bg-slate-700" />
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardHeader>
              <Skeleton className="h-4 w-48 bg-slate-700" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full bg-slate-700" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Outfit & Wardrobe Stats</h2>
        <Card className="bg-slate-900/50 border-red-500/30">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Failed to load outfit data</h3>
            <p className="text-red-300 mb-4 text-center">Unable to retrieve outfit statistics.</p>
            <Button onClick={loadOutfitSummary} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!outfitSummary) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-purple-300">Outfit & Wardrobe Stats</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Outfits Saved</CardTitle>
            <Shirt className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{outfitSummary.total_outfits}</div>
            <p className="text-xs text-white/60">Created by all users</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Popular Style Tags & Colors</CardTitle>
          </CardHeader>
          <CardContent>
            {outfitSummary.popular_tags.length > 0 ? (
              <div className="space-y-4">
                {outfitSummary.popular_tags.map((tag, index) => (
                  <div key={tag.tag} className="flex items-center justify-between">
                    <Badge variant="outline" className="text-purple-300 border-purple-500/50">
                      {tag.tag}
                    </Badge>
                    <span className="text-white/80 font-medium">{tag.count} uses</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-white/60">
                No tag data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OutfitStatsSection;
