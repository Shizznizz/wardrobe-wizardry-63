
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { AlertTriangle, Download, Mail, Trash2, RotateCcw, Sliders, Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/components/ThemeProvider';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [dataExportEmail, setDataExportEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  const handleToggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast.success(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="space-y-10 max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Settings</h1>
            
            <div className="space-y-6">
              <div className="grid gap-6">
                <motion.div 
                  variants={itemVariants}
                  className="glass-dark rounded-xl border border-white/10 p-6 space-y-4"
                >
                  <h2 className="text-xl font-medium text-blue-200">Appearance</h2>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode" className="font-medium text-white">Dark Mode</Label>
                      <p className="text-sm text-blue-100/80">
                        Enable dark mode for a darker UI theme
                      </p>
                    </div>
                    <Switch 
                      id="dark-mode" 
                      checked={theme === 'dark'} 
                      onCheckedChange={handleToggleDarkMode} 
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="glass-dark rounded-xl border border-white/10 p-6 space-y-4"
                >
                  <h2 className="text-xl font-medium text-blue-200">Notifications</h2>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications" className="font-medium text-white">Push Notifications</Label>
                      <p className="text-sm text-blue-100/80">
                        Receive notifications about weather and outfit suggestions
                      </p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={notifications} 
                      onCheckedChange={handleToggleNotifications} 
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="glass-dark rounded-xl border border-white/10 p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-medium text-blue-200">Fashion Preferences</h2>
                      <p className="text-sm text-blue-100/80">
                        Manage your style preferences, colors, and outfit settings
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-white/20 text-white hover:bg-white/10"
                      asChild
                    >
                      <Link to="/preferences">
                        <Sliders className="h-4 w-4 mr-2" />
                        <span>Preferences</span>
                      </Link>
                    </Button>
                  </div>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="glass-dark rounded-xl border border-white/10 p-6 space-y-4"
                >
                  <h2 className="text-xl font-medium text-blue-200 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    Legal Information
                  </h2>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="license" className="border-white/10">
                      <AccordionTrigger className="text-white hover:text-purple-300 hover:no-underline">
                        License Summary
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 text-sm">
                        <p className="mb-2">Wardrobe Wizardry is protected under a proprietary license:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>All rights reserved by Daniel Deurloo (Shizznizz)</li>
                          <li>Not open source - private and confidential</li>
                          <li>Unauthorized use, copying, or distribution prohibited</li>
                          <li>Permission required for any use</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="copyright" className="border-white/10">
                      <AccordionTrigger className="text-white hover:text-purple-300 hover:no-underline">
                        Copyright Notice
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 text-sm">
                        <p>© 2023-2025 Daniel Deurloo (Shizznizz). All Rights Reserved.</p>
                        <p className="mt-2">This application, its code, design, and content are original works protected by copyright law.</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="proprietary" className="border-white/10">
                      <AccordionTrigger className="text-white hover:text-purple-300 hover:no-underline">
                        What is Proprietary Software?
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 text-sm">
                        <p>Proprietary software is owned by an individual or company (the "publisher" or creator). The use, redistribution, and modification of the software are prohibited or restricted.</p>
                        <p className="mt-2">Unlike open-source software, proprietary products require explicit permission for any use outside the original license terms.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="pt-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-400" />
                    <p className="text-sm text-white/80">
                      Licensing inquiries: <a 
                        href="mailto:danieldeurloo@hotmail.com" 
                        className="text-purple-300 hover:text-purple-200 transition-colors"
                      >
                        danieldeurloo@hotmail.com
                      </a>
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="glass-dark rounded-xl border border-white/10 p-6 space-y-4"
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
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
