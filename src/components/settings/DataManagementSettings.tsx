
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { RefreshCw, Trash2 } from 'lucide-react';

const DataManagementSettings = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExportData = () => {
    setIsExporting(true);
    
    // Simulate export data process
    setTimeout(() => {
      const dummyData = {
        wardrobe: [
          { id: '1', name: 'Blue Shirt', type: 'shirt', color: 'blue' },
          { id: '2', name: 'Black Jeans', type: 'jeans', color: 'black' }
        ],
        outfits: [
          { id: '1', name: 'Casual Day', items: ['1', '2'] }
        ],
        preferences: {
          favoriteColors: ['blue', 'black'],
          favoriteStyles: ['casual', 'minimalist']
        }
      };
      
      // Create a download link for the data
      const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-wardrobe-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
      toast.success('Your data has been exported successfully');
    }, 1500);
  };
  
  const handleResetData = () => {
    // In a real app, this would clear all user data
    toast.success('All data has been reset successfully');
  };
  
  const handleDeleteAccount = () => {
    // In a real app, this would delete the user's account
    toast.success('Your account has been deleted');
  };
  
  return (
    <Card className="bg-slate-800/40 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Data Management</CardTitle>
        <CardDescription className="text-slate-400">
          Manage your account data and privacy
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-white mb-1">Export Your Data</h4>
          <p className="text-sm text-slate-400 mb-2">
            Download a copy of all your wardrobe and preferences data in JSON format
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportData}
            disabled={isExporting}
            className="border-white/20 text-white hover:text-white hover:bg-white/10"
          >
            {isExporting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              'Export Data'
            )}
          </Button>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-white mb-1">Reset All Data</h4>
          <p className="text-sm text-slate-400 mb-2">
            Clear all your wardrobe items, outfits, and preferences. This cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-500/30 text-red-500 hover:text-white hover:bg-red-500/20"
              >
                Reset All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This will remove all your wardrobe items, outfits, and preferences.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleResetData}
                >
                  Reset All Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-white mb-1">Delete Account</h4>
          <p className="text-sm text-slate-400 mb-2">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-500/30 text-red-500 hover:text-white hover:bg-red-500/20"
              >
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This will permanently delete your account and remove all of your data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManagementSettings;
