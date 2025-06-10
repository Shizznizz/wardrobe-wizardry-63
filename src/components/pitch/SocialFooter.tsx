
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Instagram, Video, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const SocialFooter = () => {
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = "Check out this amazing AI fashion stylist! 💫";
    
    let shareUrl = '';
    
    switch (platform) {
      case 'instagram':
        toast.info('Instagram sharing will open in a new tab');
        window.open('https://www.instagram.com/', '_blank');
        break;
      case 'tiktok':
        toast.info('TikTok sharing will open in a new tab');
        window.open('https://www.tiktok.com/', '_blank');
        break;
      case 'generic':
        if (navigator.share) {
          navigator.share({
            title: 'AI Wardrobe Assistant',
            text: text,
            url: url,
          });
        } else {
          navigator.clipboard.writeText(`${text} ${url}`);
          toast.success('Link copied to clipboard!');
        }
        break;
    }
  };

  const handleShareFirstLook = () => {
    const text = "🎉 Share your first AI look! ✨";
    if (navigator.share) {
      navigator.share({
        title: 'My AI Style Journey',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      toast.success('Link copied to clipboard! 🎉');
    }
  };

  return (
    <>
      {/* Share the Style Revolution Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-slate-950/60 to-purple-900/50"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-coral-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-16 w-16 h-16 bg-purple-400/20 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-coral-300/15 rounded-full blur-md animate-pulse delay-500"></div>
        </div>
        
        <Container>
          <motion.div
            className="text-center space-y-8 px-4 md:px-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Enhanced Typography */}
            <div className="space-y-6">
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Share the{' '}
                <span className="bg-gradient-to-r from-coral-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Style Revolution
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Help your friends discover their perfect style with Olivia.{' '}
                <span className="text-coral-300 font-medium">Fashion is better when shared!</span>
              </motion.p>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/20 hover:bg-white/10 text-white hover:border-coral-400/50 transition-all duration-300 py-4"
                  onClick={() => handleShare('instagram')}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Instagram className="h-5 w-5 mr-2" />
                  </motion.div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Instagram</span>
                    <span className="text-xs text-white/60">Follow Olivia</span>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/20 hover:bg-white/10 text-white hover:border-purple-400/50 transition-all duration-300 py-4"
                  onClick={() => handleShare('tiktok')}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Video className="h-5 w-5 mr-2" />
                  </motion.div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">TikTok</span>
                    <span className="text-xs text-white/60">Watch Reels</span>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/20 hover:bg-white/10 text-white hover:border-pink-400/50 transition-all duration-300 py-4"
                  onClick={() => handleShare('generic')}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                  </motion.div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Share</span>
                    <span className="text-xs text-white/60">Send to Friends</span>
                  </div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Floating share your first AI look button */}
            <motion.div
              className="flex justify-center pt-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="border-coral-400/30 text-coral-300 hover:bg-coral-500/20 hover:text-coral-100 hover:border-coral-500/50 transition-all duration-300 px-6 py-3"
                  onClick={handleShareFirstLook}
                >
                  🎉 Share your first AI look ✨
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Footer Section - Clearly Separated */}
      <footer className="py-12 border-t border-white/10 bg-gradient-to-b from-transparent to-purple-950/20">
        <Container>
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Navigation Links */}
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
                <a href="/style-planner" className="hover:text-coral-300 transition-colors">Style Planner</a>
                <a href="/my-wardrobe" className="hover:text-coral-300 transition-colors">My Wardrobe</a>
                <a href="/mix-and-match" className="hover:text-coral-300 transition-colors">Mix & Match</a>
                <a href="/shop-and-try" className="hover:text-coral-300 transition-colors">Shop & Try</a>
                <a href="/fitting-room" className="hover:text-coral-300 transition-colors">Fitting Room</a>
              </div>
            </div>
            
            {/* Contact & Copyright */}
            <div className="text-center space-y-2 border-t border-white/5 pt-6">
              <p className="text-white/60 text-sm">
                Contact: <a href="mailto:info@aiwardrobeassistant.com" className="text-coral-300 hover:text-coral-200 transition-colors">info@aiwardrobeassistant.com</a>
              </p>
              <p className="text-white/60 text-sm">
                © 2024 Olivia Bloom AI – All rights reserved.
              </p>
            </div>
          </motion.div>
        </Container>
      </footer>
    </>
  );
};

export default SocialFooter;
