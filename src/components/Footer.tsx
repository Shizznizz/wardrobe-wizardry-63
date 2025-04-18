import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Calendar, Shirt, Palette, Smartphone, Image, FileText, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import BackToTop from './BackToTop';
import LegalModal from './LegalModal';

const Footer = () => {
  const isMobile = useIsMobile();
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  
  if (isMobile) {
    return (
      <footer className="w-full bg-gradient-to-r from-slate-950 to-purple-950">
        <div className="flex flex-col">
          <nav className="px-2 py-3 border-t border-white/10 bg-black/20 backdrop-blur-lg sticky bottom-0 z-30">
            <ul className="flex justify-between items-center px-2">
              <li>
                <Link to="/style-planner" className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-400/10">
                    <Calendar className="h-4 w-4 text-blue-300 transition-all hover:text-blue-200" />
                  </div>
                  <span className="text-[10px] text-blue-300/70">Style Planner</span>
                </Link>
              </li>
              <li>
                <Link to="/my-wardrobe" className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-400/10">
                    <Shirt className="h-4 w-4 text-pink-300 transition-all hover:text-pink-200" />
                  </div>
                  <span className="text-[10px] text-pink-300/70">My Wardrobe</span>
                </Link>
              </li>
              <li>
                <Link to="/mix-and-match" className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-400/10">
                    <Palette className="h-4 w-4 text-purple-300 transition-all hover:text-purple-200" />
                  </div>
                  <span className="text-[10px] text-purple-300/70">Mix & Match</span>
                </Link>
              </li>
              <li>
                <Link to="/shop-and-try" className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-400/10">
                    <Smartphone className="h-4 w-4 text-emerald-300 transition-all hover:text-emerald-200" />
                  </div>
                  <span className="text-[10px] text-emerald-300/70">Shop & Try</span>
                </Link>
              </li>
              <li>
                <Link to="/fitting-room" className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-400/10">
                    <Image className="h-4 w-4 text-violet-300 transition-all hover:text-violet-200" />
                  </div>
                  <span className="text-[10px] text-violet-300/70">Fitting Room</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Adding a subtle divider between navigation and footer content */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-2"></div>

          <div className="px-4 py-5 space-y-3">
            <div className="flex justify-center mt-1 mb-3">
              <a 
                href="mailto:danieldeurloo@hotmail.com" 
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white/90 transition-all group"
              >
                <Mail className="h-3 w-3 text-purple-400 group-hover:text-purple-300" />
                <span className="relative">
                  <span className="absolute inset-0 blur-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative">danieldeurloo@hotmail.com</span>
                </span>
              </a>
            </div>
            
            <div className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            
            <div className="text-center">
              <p className="text-[10px] text-white/50">
                ©2025 D-Design – AI Wardrobe Assistant
              </p>
            </div>
            
            <div className="flex justify-center space-x-1.5 text-[9px]">
              <span className="text-white/40">Powered by</span>
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Lovable</span>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Supabase</span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">OpenAI</span>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setLegalModalOpen(true)}
                className="text-[10px] text-white/30 hover:text-white/60 transition-colors py-1"
              >
                License & Legal Information
              </button>
            </div>
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            
            <div className="mt-3 text-center">
              <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent text-[10px]">
                Designed by Olivia Bloom
              </span>
            </div>
          </div>
        </div>
        
        <LegalModal open={legalModalOpen} onOpenChange={setLegalModalOpen} />
      </footer>
    );
  }
  
  return (
    <footer className="w-full bg-gradient-to-r from-slate-950 to-purple-950 border-t border-white/10">
      <BackToTop />
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-4">
          <p className="text-xs text-white/70">
            © 2023–2025 Daniel Deurloo (Shizznizz) — Wardrobe Wizardry. All rights reserved. This application is protected by a proprietary license. Unauthorized use or reproduction is prohibited.
          </p>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-300">
              © 2025 Daniel Deurloo – AI Wardrobe Assistant
            </div>
            <div className="flex items-center space-x-1.5">
              <Mail className="h-3.5 w-3.5 text-purple-400" />
              <a 
                href="mailto:danieldeurloo@hotmail.com" 
                className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
              >
                danieldeurloo@hotmail.com
              </a>
            </div>
          </div>
          
          <nav>
            <ul className="flex space-x-5 text-xs">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white flex items-center space-x-1 opacity-80 hover:opacity-100 transition-all">
                  <Home className="h-3 w-3" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/my-wardrobe" className="text-slate-300 hover:text-white flex items-center space-x-1 opacity-80 hover:opacity-100 transition-all">
                  <Shirt className="h-3 w-3" />
                  <span>My Wardrobe</span>
                </Link>
              </li>
              <li>
                <Link to="/mix-and-match" className="text-slate-300 hover:text-white flex items-center space-x-1 opacity-80 hover:opacity-100 transition-all">
                  <Palette className="h-3 w-3" />
                  <span>Mix & Match</span>
                </Link>
              </li>
              <li>
                <Link to="/shop-and-try" className="text-slate-300 hover:text-white flex items-center space-x-1 opacity-80 hover:opacity-100 transition-all">
                  <Smartphone className="h-3 w-3" />
                  <span>Shop & Try</span>
                </Link>
              </li>
              <li>
                <Link to="/fitting-room" className="text-slate-300 hover:text-white flex items-center space-x-1 opacity-80 hover:opacity-100 transition-all">
                  <Image className="h-3 w-3" />
                  <span>Fitting Room</span>
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => setLegalModalOpen(true)}
                  className="text-slate-300 hover:text-white flex items-center space-x-1 opacity-80 hover:opacity-100 transition-all"
                >
                  <FileText className="h-3 w-3" />
                  <span>License & Legal</span>
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="space-y-2 text-right">
            <div className="text-xs text-slate-400">
              Powered by <span className="text-pink-400">Lovable</span>, <span className="text-emerald-400">Supabase</span>, <span className="text-blue-400">OpenAI</span>
            </div>
            <div>
              <p className="text-[10px] italic text-slate-400">
                "Style is a way to say who you are without speaking."
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-5 pt-2">
          <Separator className="bg-white/5" />
          <div className="flex justify-center mt-3">
            <div className="text-[10px] text-slate-500">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Designed by Olivia Bloom
              </span>
            </div>
          </div>
        </div>
      </div>

      <LegalModal open={legalModalOpen} onOpenChange={setLegalModalOpen} />
    </footer>
  );
};

export default Footer;
