
import React from 'react';
import { Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const LegalDisclaimer = () => {
  return (
    <div className="w-full bg-slate-950/50 backdrop-blur-sm py-6">
      <div className="container mx-auto px-4">
        <Separator className="bg-purple-800/20 mb-5" />
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
          <p className="text-sm text-white/70 italic">
            This application contains proprietary technology and original content owned by Daniel Deurloo. 
            Reuse, redistribution or reproduction without permission is strictly prohibited under international copyright law.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;
