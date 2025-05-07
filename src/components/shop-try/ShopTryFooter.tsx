
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Globe, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShopTryFooterProps {
  userCountry: string;
  onCountryChange: (country: string) => void;
}

const ShopTryFooter = ({ userCountry, onCountryChange }: ShopTryFooterProps) => {
  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'South Korea',
    'Italy',
    'Spain'
  ];

  return (
    <footer className="py-12 border-t border-white/10">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-white/60 text-sm">
              We may earn a small commission when you buy through links on this page.
            </p>
            <p className="text-white/40 text-xs mt-2">
              © 2025 Olivia Bloom. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center">
            <div className="text-sm text-white/60 mr-3">Show items available in:</div>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-between rounded-md border border-white/20 bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none">
                <Globe className="mr-2 h-4 w-4 text-white/70" />
                {userCountry}
                <ChevronDown className="ml-2 h-4 w-4 text-white/70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900 border border-white/10">
                {countries.map((country) => (
                  <DropdownMenuItem
                    key={country}
                    className={`text-white/80 hover:bg-slate-800 hover:text-white cursor-pointer ${
                      country === userCountry ? 'bg-purple-900/50 text-white' : ''
                    }`}
                    onClick={() => onCountryChange(country)}
                  >
                    {country}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default ShopTryFooter;
