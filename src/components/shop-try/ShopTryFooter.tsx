
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ShopTryFooterProps {
  userCountry: string;
  onCountryChange: (country: string) => void;
}

const ShopTryFooter = ({ userCountry, onCountryChange }: ShopTryFooterProps) => {
  // List of countries for the selector
  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Japan',
    'South Korea'
  ];

  return (
    <footer className="py-12 border-t border-white/10 bg-slate-950">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h3 className="text-lg font-semibold mb-2 text-gradient-primary">Shop & Try</h3>
            <p className="text-white/60 text-sm">Your virtual fashion assistant</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-xs"
          >
            <p className="text-sm text-white/60 mb-2">Show products available in:</p>
            <Select value={userCountry} onValueChange={onCountryChange}>
              <SelectTrigger className="bg-slate-900 border-white/10 text-white">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectGroup>
                  {countries.map(country => (
                    <SelectItem key={country} value={country} className="text-white hover:bg-slate-800">
                      {country}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="border-t border-white/10 pt-6 text-sm text-white/40 text-center">
            <p className="mb-2">
              Affiliate Disclosure: Some links on this page are affiliate links. We may earn a commission if you make a purchase through these links.
            </p>
            <p>
              © {new Date().getFullYear()} Virtual Fashion Assistant. All rights reserved.
            </p>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
};

export default ShopTryFooter;
