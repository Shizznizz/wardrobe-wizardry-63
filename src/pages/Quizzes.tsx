
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Sparkles } from 'lucide-react';
import PersonalizedStyleQuiz from '@/components/quizzes/PersonalizedStyleQuiz';
import OliviaMoodMatcher from '@/components/quizzes/OliviaMoodMatcher';
import HeroSection from '@/components/shared/HeroSection';

const Quizzes = () => {
  const [activeTab, setActiveTab] = useState('personalized');
  const [showQuiz, setShowQuiz] = useState<string | null>(null);
  
  const handleStartQuiz = (quizType: string) => {
    setShowQuiz(quizType);
  };
  
  const handleCloseQuiz = () => {
    setShowQuiz(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      {!showQuiz ? (
        <>
          <HeroSection
            title="Discover Your Unique Style"
            subtitle="Take one of my quizzes to get personalized styling recommendations just for you."
            image={{
              src: "/lovable-uploads/e1aaa230-1623-42c4-ab9f-eb7c5f103ebe.png",
              alt: "Olivia your AI Fashion Assistant"
            }}
            buttons={[
              {
                label: "Find Your Style",
                onClick: () => handleStartQuiz('personalized'),
                variant: "secondary",
                className: "bg-black text-white hover:bg-gray-800"
              },
              {
                label: "Mood Matcher",
                onClick: () => handleStartQuiz('mood'),
                variant: "secondary",
                className: "bg-gray-700 text-white hover:bg-gray-600"
              }
            ]}
          />
          
          <main className="container mx-auto px-4 py-10">
            <Tabs 
              defaultValue="personalized" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-2 w-full max-w-md">
                  <TabsTrigger value="personalized" className="px-8 py-3">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    <span>Find Your Style</span>
                  </TabsTrigger>
                  <TabsTrigger value="mood" className="px-8 py-3">
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>Mood Matcher</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="mt-4 md:mt-6">
                <TabsContent value="personalized" className="mt-0">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900">
                      <CardTitle>Find Your Style</CardTitle>
                      <CardDescription className="text-slate-300">
                        Discover your unique style identity with a comprehensive assessment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-2">What you'll discover:</h3>
                        <ul className="space-y-2 list-disc list-inside text-slate-300">
                          <li>Your dominant style preferences and clothing categories</li>
                          <li>Recommendations based on your body type and proportions</li>
                          <li>Color palettes that complement your personal style</li>
                          <li>Outfit combinations for different occasions</li>
                        </ul>
                      </div>
                      <div className="flex justify-center">
                        <Button 
                          onClick={() => handleStartQuiz('personalized')}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10"
                          size="lg"
                        >
                          See My Style
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="mood" className="mt-0">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-purple-800 to-pink-800">
                      <CardTitle>What's Your Mood Today?</CardTitle>
                      <CardDescription className="text-pink-200">
                        Fun, quick quiz to match your current mood with the perfect outfit
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-2">How it works:</h3>
                        <ul className="space-y-2 list-disc list-inside text-slate-300">
                          <li>Answer a few fun questions about your current mood 🎭</li>
                          <li>Let Olivia analyze your vibe for today ✨</li>
                          <li>Get an instant outfit recommendation that matches your mood 👗</li>
                          <li>Perfect for when you need quick inspiration! 💫</li>
                        </ul>
                      </div>
                      <div className="flex justify-center">
                        <Button 
                          onClick={() => handleStartQuiz('mood')}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-10"
                          size="lg"
                        >
                          Let's Get Stylin'!
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </main>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {showQuiz === 'personalized' ? (
            <PersonalizedStyleQuiz onClose={handleCloseQuiz} />
          ) : (
            <OliviaMoodMatcher onClose={handleCloseQuiz} />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Quizzes;
