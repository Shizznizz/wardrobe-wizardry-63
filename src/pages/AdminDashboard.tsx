
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { adminService, AdminAnalytics } from '@/services/AdminService';
import { Users, Activity, Shirt, Award, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated || !user) {
        navigate('/');
        return;
      }

      const adminStatus = await adminService.checkAdminStatus();
      
      if (!adminStatus) {
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

  const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

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
              <p className="text-white/70">AI Wardrobe Assistant Analytics</p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Total Users</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.total_users}</div>
                <p className="text-xs text-white/60">Registered accounts</p>
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

            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Total Outfits</CardTitle>
                <Shirt className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.total_outfits}</div>
                <p className="text-xs text-white/60">Created by users</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Quizzes Completed</CardTitle>
                <Award className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.total_quizzes}</div>
                <p className="text-xs text-white/60">Avg: {averageQuizzesPerUser} per user</p>
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
                <CardTitle className="text-white">Popular Outfit Tags</CardTitle>
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

          {/* Recent Signups */}
          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Signups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.recent_signups.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recent_signups.map((signup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">
                          {signup.first_name} {signup.last_name}
                        </p>
                      </div>
                      <div className="text-sm text-white/60">
                        {new Date(signup.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/60 py-8">
                  No recent signups available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
