
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Upload, Camera, User, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SeeItOnYouSectionProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  finalImage: string | null;
  isProcessing: boolean;
  onUserPhotoUpload: (file: File) => void;
  onUseOliviaImage: () => void;
  onTryOn: () => void;
  onClearPhotos: () => void;
  showCompatibleOnly: boolean;
  onToggleCompatibleOnly: (checked: boolean) => void;
}

const SeeItOnYouSection = ({
  userPhoto,
  isUsingOliviaImage,
  finalImage,
  isProcessing,
  onUserPhotoUpload,
  onUseOliviaImage,
  onTryOn,
  onClearPhotos,
  showCompatibleOnly,
  onToggleCompatibleOnly
}: SeeItOnYouSectionProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUserPhotoUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onUserPhotoUpload(file);
    }
  };

  return (
    <section id="see-it-on-you" className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-purple-950/30 to-slate-950/50 pointer-events-none"></div>
      
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See It On You</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Upload your photo or use Olivia as your model to preview how outfits look
          </p>
          
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-sm text-white/70">Only show try-on compatible outfits</span>
            <Switch 
              checked={showCompatibleOnly}
              onCheckedChange={onToggleCompatibleOnly}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photo Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full bg-gradient-to-br from-slate-900/80 to-purple-950/20 border-white/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-purple-400" />
                  Choose Your Model
                </h3>
                
                <div className="space-y-4">
                  {/* Upload Your Photo Option */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOver 
                        ? 'border-purple-400 bg-purple-400/10' 
                        : 'border-white/20 hover:border-purple-400/50'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-white/40 mx-auto mb-3" />
                    <h4 className="font-medium text-white mb-2">Upload Your Photo</h4>
                    <p className="text-white/60 text-sm mb-4">
                      Drag & drop or click to upload a full-body photo
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white" asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                  </div>

                  {/* Or Divider */}
                  <div className="flex items-center">
                    <div className="flex-1 h-px bg-white/20"></div>
                    <span className="px-4 text-white/60 text-sm">or</span>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>

                  {/* Use Olivia Option */}
                  <Button
                    variant="outline"
                    className="w-full border-white/20 hover:bg-white/10 text-white h-auto p-4"
                    onClick={onUseOliviaImage}
                  >
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-3 text-purple-400" />
                      <div className="text-left">
                        <div className="font-medium">Use Olivia as Model</div>
                        <div className="text-sm text-white/60">Preview on our AI fashion model</div>
                      </div>
                    </div>
                  </Button>

                  {/* Current Photo Status */}
                  {(userPhoto || isUsingOliviaImage) && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          <span className="text-white text-sm">
                            {isUsingOliviaImage ? 'Using Olivia as model' : 'Your photo uploaded'}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={onClearPhotos}
                          className="text-white/60 hover:text-white"
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full bg-gradient-to-br from-slate-900/80 to-purple-950/20 border-white/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Virtual Try-On Preview
                </h3>
                
                <div className="space-y-4">
                  <div className="aspect-[3/4] bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    {isProcessing ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-white/70">Processing your try-on...</p>
                        </div>
                      </div>
                    ) : finalImage ? (
                      <img 
                        src={finalImage} 
                        alt="Try-on result" 
                        className="w-full h-full object-cover"
                      />
                    ) : userPhoto || isUsingOliviaImage ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                          <p className="text-white/70 mb-2">Ready to try on outfits!</p>
                          <p className="text-white/50 text-sm">Select an outfit from above to see how it looks</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <AlertCircle className="h-12 w-12 text-white/40 mx-auto mb-4" />
                          <p className="text-white/60">Upload a photo or use Olivia to get started</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {(userPhoto || isUsingOliviaImage) && !finalImage && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-blue-400 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-white/80 text-sm font-medium mb-1">How it works:</p>
                          <p className="text-white/60 text-sm">
                            Click on any outfit from the sections above to instantly see how it looks on you!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default SeeItOnYouSection;
