
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, AlertTriangle, Trash } from 'lucide-react';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";

const DataManagementSettings = () => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearConfirmation, setClearConfirmation] = useState("");
  
  // Function to get user data from Supabase
  const getUserData = async () => {
    if (!user) {
      toast.error("You must be logged in to export data");
      return null;
    }
    
    try {
      // Fetch user preferences
      const { data: preferences, error: prefError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (prefError && prefError.code !== 'PGRST116') {
        console.error("Error fetching user preferences:", prefError);
        toast.error("Failed to fetch user preferences");
        return null;
      }
      
      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile:", profileError);
        toast.error("Failed to fetch profile data");
        return null;
      }
      
      // Fetch wardrobe items
      const { data: wardrobe, error: wardrobeError } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', user.id);
      
      if (wardrobeError) {
        console.error("Error fetching wardrobe:", wardrobeError);
        toast.error("Failed to fetch wardrobe items");
        return null;
      }
      
      // Fetch outfits
      const { data: outfits, error: outfitsError } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', user.id);
      
      if (outfitsError) {
        console.error("Error fetching outfits:", outfitsError);
        toast.error("Failed to fetch outfits");
        return null;
      }
      
      // Fetch outfit logs
      const { data: outfitLogs, error: logsError } = await supabase
        .from('outfit_logs')
        .select('*')
        .eq('user_id', user.id);
      
      if (logsError) {
        console.error("Error fetching outfit logs:", logsError);
        toast.error("Failed to fetch outfit logs");
        return null;
      }
      
      return {
        profile,
        preferences,
        wardrobe: wardrobe || [],
        outfits: outfits || [],
        outfitLogs: outfitLogs || [],
        exportDate: new Date().toISOString(),
        userId: user.id
      };
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("An unexpected error occurred while exporting data");
      return null;
    }
  };
  
  // Export user data as JSON file
  const handleExportData = async () => {
    if (!user) {
      toast.error("You must be logged in to export data");
      return;
    }
    
    setIsExporting(true);
    
    try {
      const userData = await getUserData();
      
      if (!userData) {
        setIsExporting(false);
        return;
      }
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `olivia-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Your data has been exported successfully");
    } catch (error) {
      console.error("Error during export:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };
  
  // Import user data from JSON file
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error("You must be logged in to import data");
      return;
    }
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    try {
      const fileContent = await file.text();
      const importedData = JSON.parse(fileContent);
      
      // Basic validation
      if (!importedData || typeof importedData !== 'object') {
        toast.error("Invalid data format");
        setIsImporting(false);
        return;
      }
      
      // Check if import is for the current user
      if (importedData.userId && importedData.userId !== user.id) {
        toast.warning("This data export belongs to a different user account");
      }
      
      // Import preferences
      if (importedData.preferences) {
        const { error: prefError } = await supabase
          .from('user_preferences')
          .upsert({
            ...importedData.preferences,
            user_id: user.id
          }, { onConflict: 'user_id' });
        
        if (prefError) {
          console.error("Error importing preferences:", prefError);
          toast.error("Failed to import preferences");
        }
      }
      
      // Import wardrobe items
      if (importedData.wardrobe && Array.isArray(importedData.wardrobe)) {
        // First delete existing items
        await supabase
          .from('wardrobe_items')
          .delete()
          .eq('user_id', user.id);
        
        // Insert new items if there are any
        if (importedData.wardrobe.length > 0) {
          const { error: wardrobeError } = await supabase
            .from('wardrobe_items')
            .insert(
              importedData.wardrobe.map((item: any) => ({
                ...item,
                user_id: user.id,
                id: undefined // Let the database generate new IDs
              }))
            );
          
          if (wardrobeError) {
            console.error("Error importing wardrobe:", wardrobeError);
            toast.error("Failed to import wardrobe items");
          }
        }
      }
      
      // Import outfits
      if (importedData.outfits && Array.isArray(importedData.outfits)) {
        // First delete existing outfits
        await supabase
          .from('outfits')
          .delete()
          .eq('user_id', user.id);
        
        // Insert new outfits if there are any
        if (importedData.outfits.length > 0) {
          const { error: outfitsError } = await supabase
            .from('outfits')
            .insert(
              importedData.outfits.map((outfit: any) => ({
                ...outfit,
                user_id: user.id,
                id: undefined // Let the database generate new IDs
              }))
            );
          
          if (outfitsError) {
            console.error("Error importing outfits:", outfitsError);
            toast.error("Failed to import outfits");
          }
        }
      }
      
      toast.success("Your data has been imported successfully");
      
      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error("Error during import:", error);
      toast.error("Failed to import data. Make sure the file is a valid export from Olivia.");
    } finally {
      setIsImporting(false);
      e.target.value = ''; // Reset the file input
    }
  };
  
  // Clear browser data (localStorage and sessionStorage)
  const handleClearBrowserData = () => {
    try {
      // Clear localStorage except for auth-related items
      const authToken = localStorage.getItem('supabase.auth.token');
      const authExpiry = localStorage.getItem('supabase.auth.expires_at');
      
      localStorage.clear();
      
      // Restore auth items if they existed
      if (authToken) localStorage.setItem('supabase.auth.token', authToken);
      if (authExpiry) localStorage.setItem('supabase.auth.expires_at', authExpiry);
      
      // Clear sessionStorage except for auth-related items
      const sessionAuthToken = sessionStorage.getItem('supabase.auth.token');
      const sessionAuthExpiry = sessionStorage.getItem('supabase.auth.expires_at');
      
      sessionStorage.clear();
      
      // Restore auth items if they existed
      if (sessionAuthToken) sessionStorage.setItem('supabase.auth.token', sessionAuthToken);
      if (sessionAuthExpiry) sessionStorage.setItem('supabase.auth.expires_at', sessionAuthExpiry);
      
      setClearDialogOpen(false);
      setClearConfirmation("");
      toast.success("Browser data cleared successfully");
      
      // Reload the page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error clearing browser data:", error);
      toast.error("Failed to clear browser data");
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
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                className="bg-transparent border-white/20 hover:bg-white/10 text-white"
                disabled={isImporting || !user}
                onClick={() => {
                  document.getElementById('file-upload')?.click();
                }}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Select File
                  </>
                )}
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="text-xs text-white/50">
                {isImporting ? "Processing..." : "JSON files only"}
              </span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/10 space-y-3">
            <p className="font-medium">Clear Data</p>
            <p className="text-sm text-white/70 mb-3">
              Remove all local data stored in your browser (does not affect your account)
            </p>
            <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  className="bg-red-700 hover:bg-red-800"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Clear Browser Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-900 border-red-900/50">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center text-red-400">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Clear All Browser Data?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-white/70">
                    <p className="mb-4">
                      This will clear all locally stored data including:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>Cached preferences</li>
                      <li>Locally stored settings</li>
                      <li>Temporary data</li>
                      <li>Recent searches</li>
                    </ul>
                    <p className="font-medium">
                      Your account and cloud-saved data will not be affected.
                    </p>
                    
                    <div className="mt-6">
                      <p className="mb-2">Type "CLEAR" to confirm:</p>
                      <Input
                        type="text"
                        value={clearConfirmation}
                        onChange={(e) => setClearConfirmation(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-red-700/30 text-white"
                        placeholder="CLEAR"
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={clearConfirmation !== "CLEAR"}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClearBrowserData();
                    }}
                    className="bg-red-700 hover:bg-red-800 text-white"
                  >
                    Clear Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagementSettings;
