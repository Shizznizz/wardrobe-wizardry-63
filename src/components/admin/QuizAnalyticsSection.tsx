
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, RefreshCw, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminService, QuizAnalytics } from '@/services/AdminService';
import { toast } from 'sonner';

const QuizAnalyticsSection = () => {
  const [quizAnalytics, setQuizAnalytics] = useState<QuizAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadQuizAnalytics = async () => {
    try {
      setHasError(false);
      setIsLoading(true);
      const data = await adminService.getQuizAnalytics();
      if (data) {
        setQuizAnalytics(data);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error('Error loading quiz analytics:', error);
      setHasError(true);
      toast.error('Failed to load quiz analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuizAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Quiz Results Summary</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardHeader>
              <Skeleton className="h-4 w-32 bg-slate-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 bg-slate-700" />
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardHeader>
              <Skeleton className="h-4 w-48 bg-slate-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full bg-slate-700" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Quiz Results Summary</h2>
        <Card className="bg-slate-900/50 border-red-500/30">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Failed to load quiz analytics</h3>
            <p className="text-red-300 mb-4 text-center">Unable to retrieve quiz data.</p>
            <Button onClick={loadQuizAnalytics} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizAnalytics) return null;

  const quizChartData = Object.entries(quizAnalytics.quiz_breakdown).map(([type, count]) => ({
    name: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count
  }));

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-purple-300">Quiz Results Summary</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Completed Quizzes</CardTitle>
            <Award className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{quizAnalytics.total_quizzes}</div>
            <p className="text-xs text-white/60">All quiz completions</p>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
};

export default QuizAnalyticsSection;
