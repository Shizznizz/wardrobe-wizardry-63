
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
import { UserPreferences } from '@/lib/types';

interface UserExportData {
  preferences: UserPreferences;
  wardrobe: any[];
  outfits: any[];
  logs: any[];
}

const DataManagementSettings = () => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleExportData = async () => {
    if (!user) {
      toast.error("You need to be logged in to export data");
      return;
    }
    
    try {
      setIsExporting(true);
      
      // Fetch user preferences
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (preferencesError && preferencesError.code !== 'PGRST116') {
        throw preferencesError;
      }
      
      // Fetch wardrobe data
      const { data: wardrobeData, error: wardrobeError } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', user.id);
        
      if (wardrobeError) {
        throw wardrobeError;
      }
      
      // Fetch outfits
      const { data: outfitsData, error: outfitsError } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', user.id);
        
      if (outfitsError) {
        throw outfitsError;
      }
      
      // Fetch outfit logs
      const { data: logsData, error: logsError } = await supabase
        .from('outfit_logs')
        .select('*')
        .eq('user_id', user.id);
        
      if (logsError) {
        throw logsError;
      }
      
      // Prepare the export data
      const exportData: UserExportData = {
        preferences: preferencesData || {},
        wardrobe: wardrobeData || [],
        outfits: outfitsData || [],
        logs: logsData || []
      };
      
      // Create and download the file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(dataBlob);
      downloadLink.download = `olivia-data-export-${new Date().toISOString().split('T')[0]}.json`;
      downloadLink.click();
      
      toast.success("Your data has been exported successfully!");
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error("Failed to export your data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImportData = () => {
    if (!user) {
      toast.error("You need to be logged in to import data");
      return;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const processImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      
      // Read the file content
      const fileContent = await file.text();
      const importData: UserExportData = JSON.parse(fileContent);
      
      // Validate the imported data has the expected structure
      if (!importData || typeof importData !== 'object') {
        throw new Error("Invalid import file format");
      }
      
      // Import preferences
      if (importData.preferences) {
        const { error: prefsError } = await supabase
          .from('user_preferences')
          .upsert({
            ...importData.preferences,
            user_id: user.id
          });
          
        if (prefsError) {
          console.error('Error importing preferences:', prefsError);
        }
      }
      
      // Import wardrobe items
      if (importData.wardrobe && importData.wardrobe.length > 0) {
        const wardrobeItems = importData.wardrobe.map(item => ({
          ...item,
          user_id: user.id,
          id: undefined // Let the database generate new IDs
        }));
        
        const { error: wardrobeError } = await supabase
          .from('wardrobe_items')
          .insert(wardrobeItems);
          
        if (wardrobeError) {
          console.error('Error importing wardrobe items:', wardrobeError);
        }
      }
      
      // Import outfits
      if (importData.outfits && importData.outfits.length > 0) {
        const outfits = importData.outfits.map(outfit => ({
          ...outfit,
          user_id: user.id,
          id: undefined // Let the database generate new IDs
        }));
        
        const { error: outfitsError } = await supabase
          .from('outfits')
          .insert(outfits);
          
        if (outfitsError) {
          console.error('Error importing outfits:', outfitsError);
        }
      }
      
      // Import outfit logs
      if (importData.logs && importData.logs.length > 0) {
        const logs = importData.logs.map(log => ({
          ...log,
          user_id: user.id,
          id: undefined // Let the database generate new IDs
        }));
        
        const { error: logsError } = await supabase
          .from('outfit_logs')
          .insert(logs);
          
        if (logsError) {
          console.error('Error importing outfit logs:', logsError);
        }
      }
      
      toast.success("Your data has been imported successfully!");
      
      // Reload the page to reflect the changes
      window.location.reload();
      
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error("Failed to import your data. Please check the file format and try again.");
    } finally {
      setIsImporting(false);
      if (event.target) {
        event.target.value = ''; // Reset the file input
      }
    }
  };
  
  const handleClearBrowserData = async () => {
    try {
      setIsClearingData(true);
      
      // Clear localStorage data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('olivia-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear sessionStorage data
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('olivia-')) {
          sessionStorage.removeItem(key);
        }
      });
      
      toast.success("Browser data cleared successfully!");
      
      // Close the dialog
      setClearDataDialogOpen(false);
      
    } catch (error) {
      console.error('Error clearing browser data:', error);
      toast.error("Failed to clear browser data. Please try again.");
    } finally {
      setIsClearingData(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Data Management</h3>
        <p className="text-white/70 text-sm">
          Export or import your data, and control how Olivia stores your information
        </p>
      </div>
      
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <p className="font-medium">Export Your Data</p>
            <p className="text-sm text-white/70 mb-3">
              Download all your wardrobe items, preferences, and settings as a JSON file
            </p>
            <Button 
              variant="outline"
              className="bg-transparent border-white/20 hover:bg-white/10 text-white"
              onClick={handleExportData}
              disabled={isExporting || !user}
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </>
              )}
            </Button>
          </div>
          
          <div className="pt-4 border-t border-white/10 space-y-3">
            <p className="font-medium">Import Data</p>
            <p className="text-sm text-white/70 mb-3">
              Upload previously exported data to restore your wardrobe and preferences
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={processImport}
              accept=".json"
              className="hidden"
            />
            <Button 
              variant="outline"
              className="bg-transparent border-white/20 hover:bg-white/10 text-white"
              onClick={handleImportData}
              disabled={isImporting || !user}
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </>
              )}
            </Button>
          </div>
          
          <div className="pt-4 border-t border-white/10 space-y-3">
            <p className="font-medium">Clear Data</p>
            <p className="text-sm text-white/70 mb-3">
              Remove all local data stored in your browser (does not affect your account)
            </p>
            <Button 
              variant="destructive"
              className="bg-red-700 hover:bg-red-800"
              onClick={() => setClearDataDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Browser Data
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={clearDataDialogOpen} onOpenChange={setClearDataDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Clear browser data?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              This will remove all cached data and preferences stored in your browser.
              Your account data stored on our servers will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleClearBrowserData();
              }}
              disabled={isClearingData}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              {isClearingData ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : "Clear Data"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DataManagementSettings;
