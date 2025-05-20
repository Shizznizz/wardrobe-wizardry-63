
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const LegalInformationSettings = () => {
  // Array of legal pages for easier maintenance and extension
  const legalPages = [
    { title: "Terms of Service", path: "/terms" },
    { title: "Privacy Policy", path: "/privacy" },
    { title: "Cookie Policy", path: "/cookies" },
    { title: "GDPR Compliance", path: "/gdpr" },
    { title: "Accessibility Statement", path: "/accessibility" }
  ];
  
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
            {legalPages.map((page) => (
              <li key={page.title}>
                <Link 
                  to={page.path}
                  className="flex items-center justify-between text-white hover:text-purple-300 transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <span>{page.title}</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalInformationSettings;
