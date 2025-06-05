
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Sparkles, Crown, Zap } from 'lucide-react';

interface PremiumFeaturesTeaserProps {
  onUpgrade: () => void;
  isPremiumUser: boolean;
}

const PremiumFeaturesTeaser = ({ onUpgrade, isPremiumUser }: PremiumFeaturesTeaserProps) => {
  const features = [
    {
      name: 'Virtual Try-On',
      free: 'Limited daily tries',
      premium: 'Unlimited try-ons',
      icon: Zap
    },
    {
      name: 'AI Style Recommendations',
      free: 'Basic suggestions',
      premium: 'Personalized AI styling',
      icon: Sparkles
    },
    {
      name: 'Wardrobe Integration',
      free: false,
      premium: true,
      icon: Crown
    },
    {
      name: 'Weather-Based Outfits',
      free: 'Daily outfit',
      premium: 'Multiple daily options',
      icon: Sparkles
    },
    {
      name: 'Shopping Recommendations',
      free: 'General suggestions',
      premium: 'Personalized to your style',
      icon: Crown
    }
  ];

  if (isPremiumUser) {
    return null; // Don't show teaser to premium users
  }

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock Your Full Style Potential</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Get unlimited access to Olivia's AI styling powers and transform your fashion experience
          </p>
        </motion.div>

        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30 backdrop-blur-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Free Column */}
              <div className="p-6 bg-white/5">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
                  <p className="text-white/60">Get started with basic features</p>
                </div>
                
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">{feature.name}</span>
                      <div className="flex items-center">
                        {typeof feature.free === 'string' ? (
                          <span className="text-white/60 text-xs">{feature.free}</span>
                        ) : feature.free ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Column */}
              <div className="lg:col-span-2 p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Premium Experience</h3>
                  <p className="text-white/80">Unlock Olivia's full AI styling potential</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <feature.icon className="h-5 w-5 text-purple-300 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium text-sm">{feature.name}</div>
                        <div className="text-white/70 text-xs">
                          {typeof feature.premium === 'string' ? feature.premium : feature.premium ? 'Included' : 'Not available'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={onUpgrade}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold py-6"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Upgrade for More AI Power
                </Button>
                
                <p className="text-center text-white/60 text-xs mt-4">
                  Cancel anytime • 7-day free trial
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
};

export default PremiumFeaturesTeaser;
