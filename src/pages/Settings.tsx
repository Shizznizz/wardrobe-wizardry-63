import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import PreferencesModal from '@/components/PreferencesModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UserPreferences } from '@/lib/types';
import { sampleUserPreferences } from '@/lib/wardrobeData';
import { toast } from 'sonner';
import { Bell, Palette, CloudSun, ArrowDownToLine } from 'lucide-react';

const Settings = () => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(sampleUserPreferences);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataExportEmail, setDataExportEmail] = useState('');
  
  const handleUpdatePreferences = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
  };
  
  const handleToggleNotifications = (checked: boolean) => {
    setNotificationsEnabled(checked);
    
    const message = checked 
      ? 'Notifications have been enabled' 
      : 'Notifications have been disabled';
    
    toast.success(message);
  };
  
  const handleExportData = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataExportEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    toast.success('Export request received', {
      description: `We'll send your wardrobe data to ${dataExportEmail} shortly.`
    });
    
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
          className="max-w-4xl mx-auto space-y-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold mb-8">Settings</h1>
          </motion.div>
          
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-semibold">Preferences</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <span>Style Preferences</span>
                </CardTitle>
                <CardDescription>
                  Manage your color, style, and seasonal preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Favorite Colors</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {userPreferences.favoriteColors.length > 0 
                        ? userPreferences.favoriteColors.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')
                        : 'No favorite colors selected'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Favorite Styles</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {userPreferences.favoriteStyles.length > 0 
                        ? userPreferences.favoriteStyles.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
                        : 'No favorite styles selected'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Outfit Reminders</h3>
                    <p className="text-sm text-muted-foreground">
                      {userPreferences.outfitReminders
                        ? `Daily at ${userPreferences.reminderTime}`
                        : 'Disabled'}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <PreferencesModal 
                  preferences={userPreferences}
                  onSave={handleUpdatePreferences}
                />
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CloudSun className="h-5 w-5 text-primary" />
                  <span>Weather Preferences</span>
                </CardTitle>
                <CardDescription>
                  Customize how weather affects your outfit suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(userPreferences.seasonalPreferences)
                    .filter(([season]) => season !== 'all')
                    .map(([season, prefs]) => (
                      <div key={season} className="flex flex-wrap justify-between items-center gap-2">
                        <div>
                          <h3 className="font-medium capitalize">{season}</h3>
                          <p className="text-sm text-muted-foreground">
                            {prefs.enabled
                              ? `${prefs.temperatureRange[0]}°C to ${prefs.temperatureRange[1]}°C`
                              : 'Disabled'}
                          </p>
                        </div>
                        <div className="w-12 h-6 flex items-center">
                          <div className={`w-3 h-3 rounded-full ${prefs.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <PreferencesModal 
                  preferences={userPreferences}
                  onSave={handleUpdatePreferences}
                />
              </CardFooter>
            </Card>
          </motion.section>
          
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-semibold">Notifications</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <span>Notification Settings</span>
                </CardTitle>
                <CardDescription>
                  Control how and when the app notifies you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications-toggle" className="flex flex-col">
                      <span className="text-base">Enable Notifications</span>
                      <span className="text-sm text-muted-foreground">
                        Receive outfit suggestions and reminders
                      </span>
                    </Label>
                    <Switch
                      id="notifications-toggle"
                      checked={notificationsEnabled}
                      onCheckedChange={handleToggleNotifications}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
          
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-semibold">Data & Privacy</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowDownToLine className="h-5 w-5 text-primary" />
                  <span>Export Your Data</span>
                </CardTitle>
                <CardDescription>
                  Download a copy of your wardrobe data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExportData} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="export-email">Email Address</Label>
                    <Input
                      id="export-email"
                      type="email"
                      placeholder="Enter your email"
                      value={dataExportEmail}
                      onChange={(e) => setDataExportEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll send you an email with your wardrobe data.
                    </p>
                  </div>
                  <Button type="submit">Export Data</Button>
                </form>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
