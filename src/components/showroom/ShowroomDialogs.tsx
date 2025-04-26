
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, CreditCard, Badge } from 'lucide-react';
import OliviaImageGallery from '@/components/outfits/OliviaImageGallery';
import { toast } from 'sonner';

interface ShowroomDialogsProps {
  showStatusBar: boolean;
  userPhoto: string | null;
  selectedOutfit: any | null;
  oliviaSuggestion: string;
  finalImage: string | null;
  isMobile: boolean;
  showOliviaImageGallery: boolean;
  showSubscriptionPopup: boolean;
  showTips: boolean;
  onResetSelection: () => void;
  onPreviewNow: () => void;
  onCloseOliviaImageGallery: () => void;
  onCloseSubscriptionPopup: () => void;
  onSelectOliviaImage: (imageSrc: string) => void;
  onUpgradeToPremium: () => void;
}

const ShowroomDialogs = ({
  showStatusBar,
  userPhoto,
  selectedOutfit,
  oliviaSuggestion,
  finalImage,
  isMobile,
  showOliviaImageGallery,
  showSubscriptionPopup,
  showTips,
  onResetSelection,
  onPreviewNow,
  onCloseOliviaImageGallery,
  onCloseSubscriptionPopup,
  onSelectOliviaImage,
  onUpgradeToPremium
}: ShowroomDialogsProps) => {
  return (
    <>
      {/* Olivia Image Gallery Dialog */}
      <Dialog open={showOliviaImageGallery} onOpenChange={onCloseOliviaImageGallery}>
        <DialogContent className="sm:max-w-[900px] p-0 bg-black/90 border-white/10 overflow-hidden">
          <div className="p-1">
            <OliviaImageGallery onSelectImage={onSelectOliviaImage} />
          </div>
          <Button 
            className="absolute top-4 right-4 rounded-full w-8 h-8 p-0 bg-black/40"
            onClick={onCloseOliviaImageGallery}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>

      {/* Subscription Popup Dialog */}
      <Dialog open={showSubscriptionPopup} onOpenChange={onCloseSubscriptionPopup}>
        <DialogContent className="sm:max-w-[500px] p-6 bg-slate-900 border-purple-500/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <Badge className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Upgrade to Premium
            </h2>
            <p className="text-white/70 mb-6">
              Save unlimited looks, get advanced editing features, and exclusive styling recommendations.
            </p>
            
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={onUpgradeToPremium} 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white p-6"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Upgrade Now
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onCloseSubscriptionPopup}
                className="w-full border-white/10 text-white/70 hover:text-white hover:bg-white/5"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Bar for in-progress styling */}
      {showStatusBar && userPhoto && selectedOutfit && !finalImage && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-4 shadow-lg z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse flex items-center justify-center">
                <span className="text-white text-xs font-medium">OB</span>
              </div>
              
              <div className="text-sm">
                <p className="text-white font-medium">Olivia is styling your look...</p>
                <p className="text-white/70 text-xs">{oliviaSuggestion || "Finding the perfect style for you"}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onResetSelection}
                className="text-white/70 hover:text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              
              <Button 
                size="sm"
                onClick={onPreviewNow}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Preview Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tips toast for new users */}
      {showTips && userPhoto && !finalImage && (
        <div className="hidden">
          {toast(
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-xs">OB</span>
              </div>
              <p>Tap an outfit to try it on your photo!</p>
            </div>,
            {
              duration: 5000,
              position: 'bottom-center'
            }
          )}
        </div>
      )}
    </>
  );
};

export default ShowroomDialogs;
