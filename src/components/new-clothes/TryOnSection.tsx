
import { useState, useRef } from 'react';
import { Shirt, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import ImageUploader from '@/components/wardrobe/ImageUploader';

interface TryOnSectionProps {
  userPhoto: string | null;
  clothingPhoto: string | null;
  isProcessing: boolean;
  isUsingOliviaImage: boolean;
  onUserPhotoUpload: (file: File) => void;
  onClearUserPhoto: () => void;
  onClothingPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearPhotos: () => void;
  onTryOn: () => void;
  onShowOliviaImageGallery: () => void;
}

const TryOnSection = ({
  userPhoto,
  clothingPhoto,
  isProcessing,
  isUsingOliviaImage,
  onUserPhotoUpload,
  onClearUserPhoto,
  onClothingPhotoUpload,
  onClearPhotos,
  onTryOn,
  onShowOliviaImageGallery
}: TryOnSectionProps) => {
  const [selectedTab, setSelectedTab] = useState<string>('upload');
  const clothingPhotoInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-soft bg-slate-900/40 border border-blue-500/20 backdrop-blur-lg">
        <CardContent className="p-6 space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-1 w-full bg-slate-800/50">
              <TabsTrigger value="upload" className="data-[state=active]:bg-indigo-600">Photo Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-4 space-y-6">
              <div className="space-y-3">
                <Label htmlFor="userPhoto" className="text-lg font-medium text-blue-100">Your Photo</Label>
                <ImageUploader
                  imagePreview={userPhoto}
                  onImageChange={onUserPhotoUpload}
                  onClearImage={onClearUserPhoto}
                  label="Upload a full-body photo of yourself"
                  isOliviaImage={isUsingOliviaImage}
                  showOliviaButton={true}
                  onOliviaButtonClick={onShowOliviaImageGallery}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="clothingPhoto" className="text-lg font-medium text-blue-100">Clothing Item</Label>
                <div 
                  className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg border border-purple-500/20"
                  onClick={() => clothingPhotoInputRef.current?.click()}
                >
                  {clothingPhoto ? (
                    <div className="relative">
                      <img 
                        src={clothingPhoto} 
                        alt="Clothing item" 
                        className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Button 
                        variant="secondary" 
                        className="absolute bottom-4 right-4 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Change Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-10 rounded-lg text-center">
                      <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Shirt className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-muted-foreground text-center mb-6">
                        Upload a photo of the clothing item you want to try on
                      </p>
                      <Button 
                        variant="outline"
                        className="border-purple-500/30 text-purple-300 hover:text-purple-100"
                      >
                        Select Clothing
                      </Button>
                    </div>
                  )}
                </div>
                <Input
                  ref={clothingPhotoInputRef}
                  id="clothingPhoto"
                  type="file"
                  accept="image/*"
                  onChange={onClothingPhotoUpload}
                  className="hidden"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onTryOn} 
                disabled={!userPhoto || !clothingPhoto || isProcessing}
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg font-medium shadow-md px-8 transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-lg"
              >
                {isProcessing ? 'Processing...' : 'Preview on Me'}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 text-white border-purple-400/30">
              <p>Click to place the selected clothing item on your uploaded photo and preview the look.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={onClearPhotos}
                className="w-full md:w-auto border-red-500/30 text-red-300 hover:text-red-100 h-12 text-lg font-medium transition-all duration-300 hover:border-red-500/50"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Clear Photos
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 text-white border-red-400/30">
              <p>Click to remove the photos and start over.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TryOnSection;
