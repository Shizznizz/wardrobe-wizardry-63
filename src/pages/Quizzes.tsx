
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import QuizModal from '@/components/quizzes/QuizModal';
import FindYourStyleQuiz from '@/components/quizzes/FindYourStyleQuiz';
import LifestyleLensQuiz from '@/components/quizzes/LifestyleLensQuiz';
import VibeCheckQuiz from '@/components/quizzes/VibeCheckQuiz';
import FashionTimeMachineQuiz from '@/components/quizzes/FashionTimeMachineQuiz';
import { getCompletedQuizIds } from '@/services/QuizService';

interface Quiz {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  getQuizData: () => any;
}

const Quizzes = () => {
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [hoveredQuiz, setHoveredQuiz] = useState<string | null>(null);
  const [modalQuizId, setModalQuizId] = useState<string | null>(null);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Load completed quizzes
  useEffect(() => {
    const loadCompletedQuizzes = async () => {
      setIsLoadingCompleted(true);
      
      // First try to load from localStorage for immediate display
      const savedCompletedQuizzes = localStorage.getItem('completedQuizzes');
      if (savedCompletedQuizzes) {
        setCompletedQuizzes(JSON.parse(savedCompletedQuizzes));
      }
      
      // Then, if user is authenticated, get the completed quizzes from Supabase
      if (user) {
        try {
          const completedQuizIds = await getCompletedQuizIds();
          if (completedQuizIds.length > 0) {
            const allCompletedQuizzes = [
              ...new Set([
                ...(savedCompletedQuizzes ? JSON.parse(savedCompletedQuizzes) : []),
                ...completedQuizIds
              ])
            ];
            setCompletedQuizzes(allCompletedQuizzes);
            localStorage.setItem('completedQuizzes', JSON.stringify(allCompletedQuizzes));
          }
        } catch (error) {
          console.error("Error loading completed quizzes:", error);
        }
      }
      
      setIsLoadingCompleted(false);
    };
    
    loadCompletedQuizzes();
  }, [user]);
  
  // Helper to mark a quiz as completed
  const markQuizCompleted = (quizId: string) => {
    const updatedCompletedQuizzes = [...new Set([...completedQuizzes, quizId])];
    setCompletedQuizzes(updatedCompletedQuizzes);
    localStorage.setItem('completedQuizzes', JSON.stringify(updatedCompletedQuizzes));
  };

  // Quiz data
  const quizzes: Quiz[] = [
    {
      id: 'find-your-style',
      title: 'Find Your Style',
      description: 'Discover fashion styles that complement your unique personality and preferences.',
      icon: <Star className="h-6 w-6" />,
      color: 'from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30',
      getQuizData: FindYourStyleQuiz
    },
    {
      id: 'lifestyle-lens',
      title: 'Lifestyle Lens',
      description: 'See how your daily activities and lifestyle influence your ideal wardrobe.',
      icon: <Star className="h-6 w-6" />,
      color: 'from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30',
      getQuizData: LifestyleLensQuiz
    },
    {
      id: 'vibe-check',
      title: 'Vibe Check',
      description: 'Identify the energy and aesthetic your outfits communicate to others.',
      icon: <Star className="h-6 w-6" />,
      color: 'from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30',
      getQuizData: VibeCheckQuiz
    },
    {
      id: 'fashion-time-machine',
      title: 'Fashion Time Machine',
      description: 'Explore which fashion eras resonate with your personal style.',
      icon: <Star className="h-6 w-6" />,
      color: 'from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30',
      getQuizData: FashionTimeMachineQuiz
    }
  ];
  
  // Handle quiz selection
  const handleQuizSelect = (quizId: string) => {
    if (!user && !loading) {
      // Redirect to auth if not logged in
      navigate('/auth', { 
        state: { 
          returnTo: '/quizzes',
          message: 'Please log in to take quizzes and save your style profile.' 
        } 
      });
      return;
    }
    
    setModalQuizId(quizId);
  };
  
  // Handle hover on quiz card
  const handleQuizHover = (quizId: string | null) => {
    setHoveredQuiz(quizId);
  };
  
  // Get completion progress
  const completionProgress = completedQuizzes.length;
  const totalQuizzes = quizzes.length;
  const progressPercentage = (completionProgress / totalQuizzes) * 100;
  const allQuizzesCompleted = completionProgress === totalQuizzes;

  // Currently active quiz data for modal
  const activeQuizData = modalQuizId 
    ? quizzes.find(q => q.id === modalQuizId)?.getQuizData() 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      {/* Hero Section */}
      <EnhancedHeroSection
        title="Ready to Unlock Your Fashion Personality?"
        subtitle="Take fun, fast quizzes and help Olivia uncover your unique style DNA. The more she knows, the better she styles you."
        image={{
          src: `/lovable-uploads/${hoveredQuiz ? 'f1154816-6766-4478-ba89-6342580bc85b.png' : 'f0afcad3-9696-4e23-a118-04525585d72a.png'}`,
          alt: "Olivia headshot with ponytail and pink blouse",
          variant: "portrait"
        }}
      >
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-purple-500/20 max-w-xl mx-auto md:mx-0">
          <p className="text-white/90 text-sm">
            Every answer helps Olivia craft more personalized fashion advice – think smarter recommendations, better outfits, and a wardrobe that feels like <span className="font-bold text-coral-400">you</span>.
          </p>
        </div>
      </EnhancedHeroSection>
      
      <div className="container mx-auto px-4 pt-10">
        {/* Quiz Progress Tracker */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <p className="text-xl text-purple-200 font-medium">
              Your Style Journey: {completionProgress} of {totalQuizzes} Quizzes Completed
            </p>
            {allQuizzesCompleted && (
              <Button 
                onClick={() => navigate('/quiz-results')} 
                className="bg-gradient-to-r from-coral-500 to-purple-600 hover:from-coral-600 hover:to-purple-700 text-white"
              >
                See My Results <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="w-full bg-purple-900/30 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-coral-500 to-purple-500 h-2.5 rounded-full transition-all duration-700 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {allQuizzesCompleted && (
            <p className="text-center text-coral-300 text-sm mt-2 font-medium">
              🎉 All quizzes completed! Check out your personalized style summary.
            </p>
          )}
        </div>

        {/* Quiz Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
          {quizzes.map((quiz) => {
            const isCompleted = completedQuizzes.includes(quiz.id);
            return (
              <motion.div 
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onMouseEnter={() => handleQuizHover(quiz.id)}
                onMouseLeave={() => handleQuizHover(null)}
              >
                <Card 
                  className={cn(
                    "cursor-pointer bg-gradient-to-br border-purple-500/20 shadow-lg backdrop-blur-sm overflow-hidden h-full",
                    quiz.color,
                    isCompleted ? "ring-2 ring-coral-400/50" : ""
                  )}
                  onClick={() => handleQuizSelect(quiz.id)}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-full bg-white/10">
                        {quiz.icon}
                      </div>
                      {isCompleted && (
                        <div className="flex items-center gap-1 bg-coral-500/20 px-2 py-1 rounded-full">
                          <Check className="h-4 w-4 text-coral-400" />
                          <span className="text-xs font-medium text-coral-300">Completed</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{quiz.title}</h3>
                    <p className="text-white/70 text-sm flex-grow">{quiz.description}</p>
                    <div className="mt-4">
                      <Button
                        variant="ghost" 
                        className="text-white/90 hover:bg-white/10 hover:text-white w-full justify-between"
                      >
                        {isCompleted ? 'Retake Quiz' : 'Start Quiz'} <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        {/* Quiz Modal */}
        {activeQuizData && (
          <QuizModal
            quiz={activeQuizData}
            isOpen={!!modalQuizId}
            onClose={() => setModalQuizId(null)}
            onComplete={() => {
              if (modalQuizId) {
                markQuizCompleted(modalQuizId);
              }
              setModalQuizId(null);
            }}
          />
        )}
        
        {/* Results Section */}
        {completedQuizzes.length > 0 && (
          <div className="mt-12 pt-8 border-t border-purple-500/20">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-purple-200 mb-2">Your Style Journey So Far</h3>
              <p className="text-white/70">
                Based on your quiz results, Olivia is learning more about your personal style.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {completedQuizzes.map((quizId) => {
                const quiz = quizzes.find(q => q.id === quizId);
                return quiz ? (
                  <Card key={quizId} className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-1.5 rounded-full bg-white/10">
                          {quiz.icon}
                        </div>
                        <h4 className="font-medium text-white">{quiz.title}</h4>
                      </div>
                      <p className="text-white/60 text-sm">
                        You've completed this quiz! Olivia is using these insights to enhance your style recommendations.
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-3 text-xs text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 w-full"
                        onClick={() => handleQuizSelect(quizId)}
                      >
                        Retake Quiz <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
