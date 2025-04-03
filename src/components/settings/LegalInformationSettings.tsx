
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const LegalInformationSettings = () => {
  return (
    <motion.div 
      className="glass-dark rounded-xl border border-white/10 p-6 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <h2 className="text-xl font-medium text-blue-200 flex items-center gap-2">
        <Shield className="h-5 w-5 text-purple-400" />
        Legal Information
      </h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="license" className="border-white/10">
          <AccordionTrigger className="text-white hover:text-purple-300 hover:no-underline">
            License Summary
          </AccordionTrigger>
          <AccordionContent className="text-white/80 text-sm">
            <p className="mb-2">Wardrobe Wizardry is protected under a proprietary license:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>All rights reserved by Daniel Deurloo (Shizznizz)</li>
              <li>Not open source - private and confidential</li>
              <li>Unauthorized use, copying, or distribution prohibited</li>
              <li>Permission required for any use</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="copyright" className="border-white/10">
          <AccordionTrigger className="text-white hover:text-purple-300 hover:no-underline">
            Copyright Notice
          </AccordionTrigger>
          <AccordionContent className="text-white/80 text-sm">
            <p>© 2023-2025 Daniel Deurloo (Shizznizz). All Rights Reserved.</p>
            <p className="mt-2">This application, its code, design, and content are original works protected by copyright law.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="proprietary" className="border-white/10">
          <AccordionTrigger className="text-white hover:text-purple-300 hover:no-underline">
            What is Proprietary Software?
          </AccordionTrigger>
          <AccordionContent className="text-white/80 text-sm">
            <p>Proprietary software is owned by an individual or company (the "publisher" or creator). The use, redistribution, and modification of the software are prohibited or restricted.</p>
            <p className="mt-2">Unlike open-source software, proprietary products require explicit permission for any use outside the original license terms.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-2 flex items-center gap-2">
        <Mail className="h-4 w-4 text-purple-400" />
        <p className="text-sm text-white/80">
          Licensing inquiries: <a 
            href="mailto:danieldeurloo@hotmail.com" 
            className="text-purple-300 hover:text-purple-200 transition-colors"
          >
            danieldeurloo@hotmail.com
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default LegalInformationSettings;
