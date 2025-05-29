
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles, Star, Calendar, Clock, Palette } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import QuizModal from '@/components/quizzes/QuizModal';
import FindYourStyleQuiz from '@/components/quizzes/FindYourStyleQuiz';
import VibeCheckQuiz from '@/components/quizzes/VibeCheckQuiz';
import LifestyleLensQuiz from '@/components/quizzes/LifestyleLensQuiz';
import FashionTimeMachineQuiz from '@/components/quizzes/FashionTimeMachineQuiz';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';

const Quizzes = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { completedQuizTypes, isLoading } = useUserData();
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const quizzes = [
    {
      id: 'find-your-style',
      title: 'Find Your Style',
      subtitle: 'Discover your unique aesthetic DNA',
      description: 'Uncover the style that truly represents you through personalized questions about your preferences, lifestyle, and fashion choices.',
      icon: Palette,
      color: 'from-purple-500 to-indigo-600',
      quiz: FindYourStyleQuiz()
    },
    {
      id: 'vibe-check',
      title: 'Vibe Check',
      subtitle: 'What energy do you project?',
      description: 'Explore the mood and energy you want your outfits to convey, from confident powerhouse to dreamy romantic.',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-600',
      quiz: VibeCheckQuiz()
    },
    {
      id: 'lifestyle-lens',
      title: 'Lifestyle Lens',
      subtitle: 'Style that fits your life',
      description: 'Understand how your daily routine, work environment, and social life influence your perfect wardrobe choices.',
      icon: Calendar,
      color: 'from-emerald-500 to-teal-600',
      quiz: LifestyleLensQuiz()
    },
    {
      id: 'fashion-time-machine',
      title: 'Fashion Time Machine',
      subtitle: 'Your style through the decades',
      description: 'Journey through fashion history to discover which eras inspire your personal style and how to incorporate them today.',
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      quiz: FashionTimeMachineQuiz()
    }
  ];

  const completedCount = completedQuizTypes.length;
  const allCompleted = completedCount === quizzes.length;

  const handleQuizStart = (quiz: any) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setSelectedQuiz(quiz);
    setShowQuizModal(true);
  };

  const handleQuizComplete = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
  };

  const handleCloseModal = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
  };

  const isQuizCompleted = (quizId: string) => {
    return completedQuizTypes.includes(quizId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading your quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <main className="container mx-auto px-4 pb-20">
        <PageHeader
          title="Style Discovery Quizzes"
          subtitle="Let Olivia learn about your unique style through fun, personalized quizzes"
          showAvatar={true}
        />

        {/* Progress Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Your Progress</h3>
                <Badge className={`${allCompleted ? 'bg-green-500' : 'bg-purple-500'} text-white`}>
                  {completedCount}/{quizzes.length} Complete
                </Badge>
              </div>
              
              <div className="w-full bg-slate-800 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-coral-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / quizzes.length) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-white/80 text-sm">
                  {allCompleted 
                    ? "Amazing! You've completed all quizzes. Check out your complete style profile!"
                    : "Complete all quizzes to unlock your personalized style insights"
                  }
                </p>
                
                {allCompleted && (
                  <Button 
                    onClick={() => navigate('/quiz-results')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    See My Results
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {quizzes.map((quiz, index) => {
            const Icon = quiz.icon;
            const completed = isQuizCompleted(quiz.id);
            
            return (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden border-white/10 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 h-full">
                  {completed && (
                    <div className="absolute top-4 right-4 z-10">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                  )}
                  
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${quiz.color} flex-shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-1">{quiz.title}</h3>
                        <p className="text-purple-300 text-sm">{quiz.subtitle}</p>
                      </div>
                    </div>
                    
                    <p className="text-white/70 text-sm mb-6 flex-grow leading-relaxed">
                      {quiz.description}
                    </p>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleQuizStart(quiz)}
                        className={`flex-1 ${completed 
                          ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                          : 'bg-gradient-to-r from-coral-500 to-purple-600 hover:from-coral-600 hover:to-purple-700 text-white'
                        }`}
                      >
                        {completed ? 'Retake Quiz' : 'Start Quiz'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quiz Modal */}
        {selectedQuiz && (
          <QuizModal
            quiz={selectedQuiz.quiz}
            isOpen={showQuizModal}
            onClose={handleCloseModal}
            onComplete={handleQuizComplete}
          />
        )}
      </main>
    </div>
  );
};

export default Quizzes;
