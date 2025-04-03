
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Mail, Shield } from 'lucide-react';

interface LegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LegalModal = ({ open, onOpenChange }: LegalModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] bg-slate-950 border-purple-800/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-300">
            <Shield className="w-5 h-5" />
            License & Legal Information
          </DialogTitle>
          <DialogDescription>
            Copyright and license information for Wardrobe Wizardry
          </DialogDescription>
        </DialogHeader>
        <Separator className="bg-purple-800/30" />
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 pb-4">
            <section>
              <h3 className="font-semibold text-lg text-purple-300 mb-2">Proprietary License</h3>
              <div className="text-sm space-y-4 text-slate-300">
                <p>
                  <strong>Copyright (c) 2023-2025 Daniel Deurloo (Shizznizz). All Rights Reserved.</strong>
                </p>
                <p>
                  <strong className="text-purple-300">NOT OPEN SOURCE</strong><br />
                  This project is <strong>not</strong> open source software. This project is proprietary and confidential.
                </p>
                
                <h4 className="font-medium text-md text-purple-200 mt-4">TERMS AND CONDITIONS</h4>
                <ol className="space-y-2 list-decimal list-outside ml-5">
                  <li>
                    <strong>No Permission:</strong> No use, copying, modification, merging, publishing, distribution, sublicensing, and/or selling of this software is allowed without explicit written permission from Daniel Deurloo.
                  </li>
                  <li>
                    <strong>Intellectual Property:</strong> All intellectual property rights in the software are owned by Daniel Deurloo (Shizznizz) and are protected by copyright laws and international treaty provisions.
                  </li>
                  <li>
                    <strong>Confidentiality:</strong> The content, code, design, and concepts within this project represent confidential and proprietary information and trade secrets.
                  </li>
                  <li>
                    <strong>No Warranty:</strong> The software is provided "AS IS", without warranty of any kind, express or implied.
                  </li>
                  <li>
                    <strong>No Liability:</strong> In no event shall Daniel Deurloo be liable for any claim, damages or other liability arising from the use or distribution of this software.
                  </li>
                </ol>
              </div>
            </section>

            <Separator className="bg-purple-800/20" />

            <section>
              <h3 className="font-semibold text-lg text-purple-300 mb-2">What Does "Proprietary License" Mean?</h3>
              <p className="text-sm text-slate-300">
                A proprietary license means that the software and related assets are privately owned and protected by copyright law. 
                Unlike open-source licenses, it restricts the rights to use, modify, and distribute the software. 
                All rights are reserved exclusively to the copyright holder, and any use outside the terms specified in the license 
                agreement requires explicit permission from the owner.
              </p>
            </section>

            <Separator className="bg-purple-800/20" />

            <section>
              <h3 className="font-semibold text-lg text-purple-300 mb-2">Contact for Licensing Inquiries</h3>
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <Mail className="h-4 w-4" />
                <a 
                  href="mailto:danieldeurloo@hotmail.com" 
                  className="hover:text-purple-300 transition-colors"
                >
                  danieldeurloo@hotmail.com
                </a>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                For licensing inquiries or permissions, please contact Daniel Deurloo with the subject line "Wardrobe Wizardry Licensing Inquiry"
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LegalModal;
