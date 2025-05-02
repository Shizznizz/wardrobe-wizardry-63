
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import FindYourStyleQuiz from '@/components/FindYourStyleQuiz';
import { UserPreferences } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PageHeader from '@/components/shared/PageHeader';

const StyleQuizPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Check if user is already logged in
  useEffect(() => {
    // If loading is complete and no user is authenticated, redirect to auth
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);
  
  const handleQuizComplete = (preferences: UserPreferences) => {
    console.log('Quiz completed with preferences:', preferences);
    // Further handling can be done here if needed
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <PageHeader
          title="Find Your Style"
          subtitle="Let's discover your unique aesthetic together — I'll guide your style journey."
          showAvatar={true}
        />
        
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FindYourStyleQuiz 
            onComplete={handleQuizComplete} 
            standalone={true}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default StyleQuizPage;
