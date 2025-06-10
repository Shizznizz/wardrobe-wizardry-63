
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
    <footer className="py-12 border-t border-white/10">
      <Container>
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Share the Style Revolution</h3>
            <p className="text-white/70 max-w-2xl mx-auto">
              Help your friends discover their perfect style with Olivia. Fashion is better when shared!
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 hover:bg-white/10 text-white"
              onClick={() => handleShare('instagram')}
            >
              <Instagram className="h-5 w-5 mr-2" />
              Instagram
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 hover:bg-white/10 text-white"
              onClick={() => handleShare('tiktok')}
            >
              <Video className="h-5 w-5 mr-2" />
              TikTok
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 hover:bg-white/10 text-white"
              onClick={() => handleShare('generic')}
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>

          {/* Floating share your first AI look button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              className="border-coral-400/30 text-coral-300 hover:bg-coral-500/20 hover:text-coral-100 hover:border-coral-500/50 transition-colors"
              onClick={handleShareFirstLook}
            >
              🎉 Share your first AI look
            </Button>
          </motion.div>
          
          <div className="pt-8 border-t border-white/10 space-y-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <a href="/style-planner" className="hover:text-coral-300 transition-colors">Style Planner</a>
              <a href="/my-wardrobe" className="hover:text-coral-300 transition-colors">My Wardrobe</a>
              <a href="/mix-and-match" className="hover:text-coral-300 transition-colors">Mix & Match</a>
              <a href="/shop-and-try" className="hover:text-coral-300 transition-colors">Shop & Try</a>
              <a href="/fitting-room" className="hover:text-coral-300 transition-colors">Fitting Room</a>
            </div>
            
            <div className="space-y-2">
              <p className="text-white/60 text-sm">
                Contact: <a href="mailto:info@aiwardrobeassistant.com" className="text-coral-300 hover:text-coral-200 transition-colors">info@aiwardrobeassistant.com</a>
              </p>
              <p className="text-white/60 text-sm">
                © 2024 Olivia Bloom AI – All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
};

export default SocialFooter;
