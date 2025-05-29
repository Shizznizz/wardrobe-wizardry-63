
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/hooks/useAuth';
import { adminService } from '@/services/AdminService';
import { TrendingUp, Database, Download, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import UserStatsSection from '@/components/admin/UserStatsSection';
import QuizAnalyticsSection from '@/components/admin/QuizAnalyticsSection';
import OutfitStatsSection from '@/components/admin/OutfitStatsSection';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [adminToolsOpen, setAdminToolsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Check if user is admin
  const isAdmin = isAuthenticated && user?.email === 'danieldeurloo@hotmail.com';

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await adminService.exportAllUserData();
      toast.success('User data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export user data');
    } finally {
      setIsExporting(false);
    }
  };

  // Show unauthorized message if not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/80 mb-6">
            ⚠️ You are not authorized to view this page.
          </p>
          <p className="text-white/60 text-sm">
            This admin dashboard is restricted to authorized personnel only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-white/70">AI Wardrobe Assistant Analytics - Secure Admin Zone</p>
            </div>
          </div>

          {/* User Overview Section */}
          <UserStatsSection />

          {/* Quiz Results Summary */}
          <QuizAnalyticsSection />

          {/* Outfit & Wardrobe Stats */}
          <OutfitStatsSection />

          {/* Admin Tools Section */}
          <Card className="bg-slate-900/50 border-red-500/30">
            <Collapsible open={adminToolsOpen} onOpenChange={setAdminToolsOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-slate-800/30 transition-colors">
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-red-400" />
                      Admin Tools
                    </span>
                    {adminToolsOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={handleExportData}
                      disabled={isExporting}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isExporting ? 'Exporting...' : 'Export All User Data (CSV)'}
                    </Button>
                  </div>
                  
                  <div className="text-sm text-white/60 bg-red-900/20 p-3 rounded-lg border border-red-500/30">
                    <strong className="text-red-400">Admin Zone:</strong> These tools provide access to all user data. Use responsibly and in compliance with privacy policies.
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
