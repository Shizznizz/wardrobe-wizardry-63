
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { adminService, AdminAnalytics } from '@/services/AdminService';
import { Users, Activity, Shirt, Award, TrendingUp, Calendar, Download, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useNavigate();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToolsOpen, setAdminToolsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated || !user) {
        toast.error('Access denied: admin only');
        navigate('/');
        return;
      }

      // Check if user email is the admin email
      if (user.email !== 'danieldeurloo@hotmail.com') {
        toast.error('Access denied: admin only');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      
      // Load analytics data
      const data = await adminService.getAnalytics();
      setAnalytics(data);
      setIsLoading(false);
    };

    checkAccess();
  }, [isAuthenticated, user, navigate]);

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

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      const data = await adminService.getAnalytics();
      setAnalytics(data);
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Failed to load analytics</h2>
          <p className="text-white/70">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const quizChartData = Object.entries(analytics.quiz_breakdown).map(([type, count]) => ({
    name: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count
  }));

  const averageQuizzesPerUser = analytics.total_users > 0 
    ? (analytics.total_quizzes / analytics.total_users).toFixed(1)
    : '0';

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

          {/* User Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">User Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">Total Users Registered</CardTitle>
                  <Users className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.total_users}</div>
                  <p className="text-xs text-white/60">All registered accounts</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.active_users}</div>
                  <p className="text-xs text-white/60">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quiz Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Quiz Stats</h2>
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Total Completed Quizzes</CardTitle>
                <Award className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.total_quizzes}</div>
                <p className="text-xs text-white/60">Avg: {averageQuizzesPerUser} per user</p>
              </CardContent>
            </Card>
          </div>

          {/* Wardrobe Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Wardrobe Stats</h2>
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Total Outfits Saved</CardTitle>
                <Shirt className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.total_outfits}</div>
                <p className="text-xs text-white/60">Created by all users</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Quiz Breakdown Chart */}
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Quiz Completion Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {quizChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={quizChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }} 
                      />
                      <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-white/60">
                    No quiz data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Popular Style Tags & Colors</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.popular_tags.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.popular_tags.map((tag, index) => (
                      <div key={tag.tag} className="flex items-center justify-between">
                        <Badge variant="outline" className="text-purple-300 border-purple-500/50">
                          {tag.tag}
                        </Badge>
                        <span className="text-white/80 font-medium">{tag.count} uses</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-white/60">
                    No tag data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="bg-slate-900/50 border-purple-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Signups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.recent_signups.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-white/80">Name</TableHead>
                      <TableHead className="text-white/80">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.recent_signups.map((signup, index) => (
                      <TableRow key={index} className="border-slate-700">
                        <TableCell className="text-white">
                          {signup.first_name} {signup.last_name}
                        </TableCell>
                        <TableCell className="text-white/60">
                          {new Date(signup.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-white/60 py-8">
                  No recent signups available
                </div>
              )}
            </CardContent>
          </Card>

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

                    <Button
                      onClick={handleRefreshData}
                      disabled={isRefreshing}
                      variant="outline"
                      className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
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
