
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PreferenceSettings from '@/components/settings/PreferenceSettings';
import LegalInformationSettings from '@/components/settings/LegalInformationSettings';
import DataManagementSettings from '@/components/settings/DataManagementSettings';
import PageHeader from '@/components/shared/PageHeader';

const Settings = () => {
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
        <PageHeader
          title="Settings & Preferences"
          subtitle="Customize your vibe, reminders, and preferences here with me."
          showAvatar={true}
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
                <NotificationSettings />
                <PreferenceSettings />
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
