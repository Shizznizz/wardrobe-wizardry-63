
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { AlertTriangle, Download, Mail, Trash2, RotateCcw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dataExportEmail, setDataExportEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`${!darkMode ? 'Dark' : 'Light'} mode enabled`);
  };
  
  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    toast.success(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
  };
  
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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-10 max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold mb-8">Settings</h1>
            
            <div className="space-y-6">
              <div className="grid gap-6">
                <div className="border rounded-lg p-4 space-y-4">
                  <h2 className="text-xl font-medium">Appearance</h2>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable dark mode for a darker UI theme
                      </p>
                    </div>
                    <Switch 
                      id="dark-mode" 
                      checked={darkMode} 
                      onCheckedChange={handleToggleDarkMode} 
                    />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <h2 className="text-xl font-medium">Notifications</h2>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications" className="font-medium">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about weather and outfit suggestions
                      </p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={notifications} 
                      onCheckedChange={handleToggleNotifications} 
                    />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 space-y-4">
                  <h2 className="text-xl font-medium">Data Management</h2>
                  
                  <form onSubmit={handleExportData} className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="export-email">Export Wardrobe Data</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        We'll send your wardrobe data to the email address you provide.
                      </p>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="export-email" 
                          type="email" 
                          placeholder="your@email.com" 
                          value={dataExportEmail}
                          onChange={(e) => setDataExportEmail(e.target.value)}
                        />
                        <Button type="submit" className="shrink-0" disabled={isSubmitting}>
                          <Download className="h-4 w-4 mr-2" />
                          <span>Export</span>
                        </Button>
                      </div>
                    </div>
                  </form>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="reset-data">Reset All Data</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Clear all your wardrobe data and start fresh. This action cannot be undone.
                    </p>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      <span>Reset Data</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="delete-account" className="text-destructive">Delete Account</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Permanently delete your account and all associated data.
                    </p>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Delete Account</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
