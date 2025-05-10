
import React, { useState } from 'react';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';
import StyleDiscoveryQuiz from '@/components/StyleDiscoveryQuiz';
import FindYourStyleQuiz from '@/components/FindYourStyleQuiz';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Quizzes = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleFindYourStyle = () => {
    setActiveSection('style-quiz');
    const styleQuizSection = document.getElementById('style-quiz');
    if (styleQuizSection) {
      styleQuizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleMoodMatcher = () => {
    setActiveSection('mood-matcher');
    const moodMatcherSection = document.getElementById('mood-matcher');
    if (moodMatcherSection) {
      moodMatcherSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      <EnhancedHeroSection
        title="Discover Your Unique Style"
        subtitle="Take a quick quiz to reveal your personal style identity and receive curated outfit ideas."
        image={{
          src: "/lovable-uploads/f0afcad3-9696-4e23-a118-04525585d72a.png",
          alt: "Olivia headshot with ponytail and pink blouse",
          variant: "headshot"
        }}
        buttons={[
          {
            label: "Find Your Style",
            onClick: handleFindYourStyle,
            variant: "black"
          },
          {
            label: "Mood Matcher",
            onClick: handleMoodMatcher,
            variant: "secondary"
          }
        ]}
      />
      
      <div className="container mx-auto px-4 pt-10">
        <div id="style-quiz" className="pt-10 pb-8">
          {activeSection === 'style-quiz' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <Card className="bg-gradient-to-br from-slate-900/70 to-indigo-900/40 border-purple-500/20 shadow-xl backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0 sm:p-6">
                  <FindYourStyleQuiz standalone />
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="text-center my-12">
              <p className="text-xl text-purple-200 mb-4">
                Discover the fashion styles that complement your taste and personality
              </p>
              <p className="text-purple-300/80 mb-6 max-w-2xl mx-auto">
                Take our detailed style assessment to learn which fashion aesthetics match your unique preferences. Get personalized recommendations tailored to your body type and lifestyle.
              </p>
            </div>
          )}
        </div>
        
        <div id="mood-matcher" className="pt-8 pb-20">
          {activeSection === 'mood-matcher' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <Card className="bg-gradient-to-br from-slate-900/70 to-pink-900/30 border-purple-500/20 shadow-xl backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0 sm:p-6">
                  <StyleDiscoveryQuiz />
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="text-center my-12">
              <p className="text-xl text-purple-200 mb-4">
                Let your mood guide your style choices
              </p>
              <p className="text-purple-300/80 mb-6 max-w-2xl mx-auto">
                How you feel impacts what you want to wear. Our Mood Matcher quiz creates outfit suggestions based on your current emotions, the weather, and your plans for the day.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
