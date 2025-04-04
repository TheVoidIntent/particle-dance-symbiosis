
import React from 'react';
import { Helmet } from 'react-helmet';
import IntentAudioWellness from '@/components/mobile/IntentAudioWellness';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const MobileWellness: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleDownload = () => {
    toast.info("To install this app on your device, please follow the prompts to add to home screen, or export the project to your GitHub and build it using Capacitor.");
    
    // This would be where we'd normally trigger a PWA install prompt
    // For Capacitor, the app should already be installed
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Intent Audio Wellness',
          text: 'Experience the wellness benefits of intent field audio',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error("Couldn't share the app");
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      toast.info("Copy the URL to share this experience");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Helmet>
        <title>Intent Audio Wellness | Mobile Experience</title>
        <meta name="description" content="Experience the wellness benefits of intent field audio on your mobile device" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#111827" />
      </Helmet>
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm p-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Intent Wellness
        </h1>
        
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDownload}
          >
            <Download className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleShare}
          >
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className={`p-4 ${isMobile ? 'pb-24' : ''}`}>
        <div className="max-w-lg mx-auto">
          <IntentAudioWellness />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Intent Audio Wellness v1.0.0
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Based on the Information-Intent Nexus framework
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobileWellness;
