
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Home, Shirt, Palette, Smartphone, Image, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import BackToTop from './BackToTop';
import LegalModal from './LegalModal';

const Footer = () => {
  const isMobile = useIsMobile();
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  
  return (
    <footer className="w-full bg-gradient-to-r from-slate-950 to-purple-950 border-t border-white/10">
      <BackToTop />
      <div className="container mx-auto px-4 py-6">
        {/* Copyright notice - positioned above main footer content */}
        <div className="text-center mb-4">
          <p className="text-xs text-white/70">
            © 2023–2025 Daniel Deurloo (Shizznizz) — Wardrobe Wizardry. All rights reserved. This application is protected by a proprietary license. Unauthorized use or reproduction is prohibited.
          </p>
        </div>

        <div className={`flex ${isMobile ? 'flex-col space-y-6' : 'flex-row justify-between items-center'}`}>
          {/* Left Side */}
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
          
          {/* Center - Navigation Links */}
          <nav className={`${isMobile ? 'py-2' : ''}`}>
            <ul className={`flex ${isMobile ? 'justify-start space-x-3' : 'space-x-5'} text-xs`}>
              <li>
                <Link to="/" className="text-slate-300 hover:text-white flex items-center space-x-1 opacity-80 hover:opacity-100 transition-all">
                  <Home className="h-3 w-3" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/wardrobe" className="text-slate-300 hover:text-white flex items-center space-x-1 opacity-80 hover:opacity-100 transition-all">
                  <Shirt className="h-3 w-3" />
                  <span>Wardrobe</span>
                </Link>
              </li>
              <li>
                <Link to="/outfits" className="text-slate-300 hover:text-white flex items-center space-x-1 opacity-80 hover:opacity-100 transition-all">
                  <Palette className="h-3 w-3" />
                  <span>Outfits</span>
                </Link>
              </li>
              <li>
                <Link to="/virtual-try-on" className="text-slate-300 hover:text-white flex items-center space-x-1 opacity-80 hover:opacity-100 transition-all">
                  <Smartphone className="h-3 w-3" />
                  <span>Try-On</span>
                </Link>
              </li>
              <li>
                <Link to="/showroom" className="text-slate-300 hover:text-white flex items-center space-x-1 opacity-80 hover:opacity-100 transition-all">
                  <Image className="h-3 w-3" />
                  <span>Showroom</span>
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
          
          {/* Right Side - Credits & Quote */}
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
        
        {/* Bottom Separator and designer signature */}
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

      {/* Legal Modal */}
      <LegalModal open={legalModalOpen} onOpenChange={setLegalModalOpen} />
    </footer>
  );
};

export default Footer;
