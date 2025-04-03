
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const DataManagementSettings = () => {
  const [dataExportEmail, setDataExportEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExportData = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!dataExportEmail) {
      toast.error('Please enter your email address');
      setIsSubmitting(false);
      return;
    }
    
    toast.success('Export request received', {
      description: `We'll send your wardrobe data to ${dataExportEmail} shortly.`
    });
    setIsSubmitting(false);
    setDataExportEmail('');
  };

  return (
    <motion.div 
      className="glass-dark rounded-xl border border-white/10 p-6 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <h2 className="text-xl font-medium text-blue-200">Data Management</h2>
      
      <form onSubmit={handleExportData} className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="export-email" className="text-white">Export Wardrobe Data</Label>
          <p className="text-sm text-blue-100/80 mb-2">
            We'll send your wardrobe data to the email address you provide.
          </p>
          <div className="flex items-center gap-2">
            <Input 
              id="export-email" 
              type="email" 
              placeholder="your@email.com" 
              value={dataExportEmail}
              onChange={(e) => setDataExportEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            />
            <Button 
              type="submit" 
              className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
              disabled={isSubmitting}
            >
              <Download className="h-4 w-4 mr-2" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </form>
      
      <div className="space-y-2 pt-2">
        <Label htmlFor="reset-data" className="text-white">Reset All Data</Label>
        <p className="text-sm text-blue-100/80 mb-2">
          Clear all your wardrobe data and start fresh. This action cannot be undone.
        </p>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          <span>Reset Data</span>
        </Button>
      </div>
      
      <div className="space-y-2 pt-2">
        <Label htmlFor="delete-account" className="text-pink-400">Delete Account</Label>
        <p className="text-sm text-blue-100/80 mb-2">
          Permanently delete your account and all associated data.
        </p>
        <Button 
          variant="destructive" 
          className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span>Delete Account</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default DataManagementSettings;
