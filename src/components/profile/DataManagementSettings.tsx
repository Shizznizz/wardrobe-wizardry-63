
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

const DataManagementSettings = () => {
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
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
          
          <div className="pt-4 border-t border-white/10 space-y-3">
            <p className="font-medium">Import Data</p>
            <p className="text-sm text-white/70 mb-3">
              Upload previously exported data to restore your wardrobe and preferences
            </p>
            <Button 
              variant="outline"
              className="bg-transparent border-white/20 hover:bg-white/10 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Data
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
            >
              Clear Browser Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagementSettings;
