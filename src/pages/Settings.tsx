
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PreferenceSettings from '@/components/settings/PreferenceSettings';
import LegalInformationSettings from '@/components/settings/LegalInformationSettings';
import DataManagementSettings from '@/components/settings/DataManagementSettings';
import PageHeader from '@/components/shared/PageHeader';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Settings = () => {
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  useEffect(() => {
    // Handle initial settings load
    const hasSettingsChanged = localStorage.getItem('settingsChanged');
    if (hasSettingsChanged === 'true') {
      setShowSaveSuccess(true);
      toast.success('Olivia saved your settings successfully!', {
        icon: <Sparkles className="h-4 w-4 text-pink-300" />
      });
      localStorage.removeItem('settingsChanged');
      
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000);
    }
  }, []);

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

  const handleSettingsSaved = () => {
    setShowSaveSuccess(true);
    toast.success('Olivia saved your settings successfully!', {
      icon: <Sparkles className="h-4 w-4 text-pink-300" />
    });
    localStorage.setItem('settingsChanged', 'true');
    
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#12002f] to-[#1b013c] text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <PageHeader
          title="Settings & Preferences"
          subtitle="Customize your vibe, reminders, and preferences here with me."
          showAvatar={false}
          imageVariant="neutral"
          imagePosition="right"
          showSparkles={true}
        />
        
        <motion.div 
          className="space-y-10 max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <div className="space-y-6">
              <div className="grid gap-6">
                <AppearanceSettings />
                <NotificationSettings onSave={handleSettingsSaved} />
                <PreferenceSettings onSave={handleSettingsSaved} />
                <LegalInformationSettings />
                <DataManagementSettings />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
