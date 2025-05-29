import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import MyWardrobe from '@/pages/MyWardrobe';
import MixAndMatch from '@/pages/MixAndMatch';
import StylePlanner from '@/pages/StylePlanner';
import FittingRoom from '@/pages/FittingRoom';
import ShopAndTry from '@/pages/ShopAndTry';
import Quizzes from '@/pages/Quizzes';
import Profile from '@/pages/Profile';
import Auth from '@/pages/Auth';
import Header from '@/components/Header';
import { AuthProvider } from '@/hooks/useAuth';
import StyleQuizPage from '@/pages/StyleQuiz';
import OutfitDetailsPage from '@/pages/OutfitDetailsPage';
import OutfitLogPage from '@/pages/OutfitLogPage';
import QuizResults from '@/pages/QuizResults';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950">
          <Header />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-wardrobe" element={<MyWardrobe />} />
              <Route path="/mix-and-match" element={<MixAndMatch />} />
              <Route path="/style-planner" element={<StylePlanner />} />
              <Route path="/fitting-room" element={<FittingRoom />} />
              <Route path="/shop-and-try" element={<ShopAndTry />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/style-quiz" element={<StyleQuizPage />} />
              <Route path="/outfit/:id" element={<OutfitDetailsPage />} />
              <Route path="/outfit-log/:id?" element={<OutfitLogPage />} />
              <Route path="/quiz-results" element={<QuizResults />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
