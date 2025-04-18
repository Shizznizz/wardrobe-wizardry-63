import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import PageHeader from '@/components/layout/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableFooter,
  TableRow,
} from "@/components/ui/table"

const MyWardrobe = () => {
  const { user, signOut } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully.');
    } catch (error) {
      console.error('Sign out failed:', error);
      toast.error('Failed to sign out.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-16">
        <PageHeader 
          title="Your Digital Wardrobe"
          subtitle="Browse, organize, and style your wardrobe with AI-powered insights."
        />
        <motion.div 
          className="space-y-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-md bg-white/5 p-4">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            <div className="grid gap-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  disabled
                  className="col-span-3 bg-white/10 border-white/20 cursor-not-allowed"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  disabled
                  className="col-span-3 bg-white/10 border-white/20 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
          
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default MyWardrobe;
