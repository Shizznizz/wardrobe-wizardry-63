
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import PageHeader from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import LocationSelector from '@/components/location/LocationSelector';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLocationStorage } from '@/hooks/useLocationStorage';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PreferenceSettings from '@/components/settings/PreferenceSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import AuthRequiredModal from '@/components/shared/AuthRequiredModal';

const Settings = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { savedLocation } = useLocationStorage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // If user is not authenticated and not loading, show auth modal
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [loading, isAuthenticated]);
  
  if (loading) {
    return (
      <Container className="py-10 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="h-10 w-10 animate-spin text-purple-500" />
          <p className="text-lg text-white/70">Loading your settings...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <>
      <Container className="py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account, preferences, and wardrobe settings.
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-white/10">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Style Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileSettings />
            
            <Card className="mt-6 bg-slate-800/30 border-white/10">
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>
                  Set your location for weather-based style recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70 text-sm mb-4">
                  Your location is used to provide weather-specific style recommendations 
                  across all Olivia features. This helps make outfit suggestions more relevant to your current conditions.
                </p>
                <LocationSelector className="max-w-sm" />
                {savedLocation && (
                  <p className="text-sm text-white/60">
                    Current location: {savedLocation.city}, {savedLocation.country}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <PreferenceSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </Container>
      
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => navigate('/')}
        title="Login Required"
        description="You must be logged in to access your settings."
      />
    </>
  );
};

export default Settings;
