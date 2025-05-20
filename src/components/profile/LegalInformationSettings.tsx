
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const LegalInformationSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Legal Information</h3>
        <p className="text-white/70 text-sm">
          Review our terms of service, privacy policy, and other legal documents
        </p>
      </div>
      
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6">
          <ul className="space-y-4">
            <li>
              <Link 
                to="#" 
                className="flex items-center justify-between text-white hover:text-purple-300 transition-colors"
              >
                <span>Terms of Service</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link 
                to="#" 
                className="flex items-center justify-between text-white hover:text-purple-300 transition-colors"
              >
                <span>Privacy Policy</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link 
                to="#" 
                className="flex items-center justify-between text-white hover:text-purple-300 transition-colors"
              >
                <span>Cookie Policy</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link 
                to="#" 
                className="flex items-center justify-between text-white hover:text-purple-300 transition-colors"
              >
                <span>GDPR Compliance</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link 
                to="#" 
                className="flex items-center justify-between text-white hover:text-purple-300 transition-colors"
              >
                <span>Accessibility Statement</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalInformationSettings;
