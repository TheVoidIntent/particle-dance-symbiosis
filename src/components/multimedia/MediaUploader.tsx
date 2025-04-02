
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Image, FileAudio, FileVideo, Upload, X, Check, AlertCircle } from 'lucide-react';
import { MediaProcessingResult } from '@/utils/mediaProcessing';

interface MediaUploaderProps {
  onMediaProcessed: (result: MediaProcessingResult) => void;
  allowedTypes?: ('image' | 'audio' | 'video')[];
  maxSizeMB?: number;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onMediaProcessed,
  allowedTypes = ['image', 'audio', 'video'],
  maxSizeMB = 50
}) => {
  const [activeTab, setActiveTab] = useState<string>(allowedTypes[0] || 'image');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    await processFile(file);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    // Check if the file type matches the active tab
    if (activeTab === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please drop an image file');
      return;
    }
    
    if (activeTab === 'audio' && !file.type.startsWith('audio/')) {
      toast.error('Please drop an audio file');
      return;
    }
    
    if (activeTab === 'video' && !file.type.startsWith('video/')) {
      toast.error('Please drop a video file');
      return;
    }
    
    await processFile(file);
  };
  
  const processFile = async (file: File) => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB`);
      return;
    }
    
    setIsProcessing(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);
      
      // Import the necessary processing function dynamically
      const { processImageInput, processAudioInput, processVideoInput } = await import('@/utils/mediaProcessing');
      
      let result: MediaProcessingResult;
      
      if (file.type.startsWith('image/')) {
        result = await processImageInput(file);
      } else if (file.type.startsWith('audio/')) {
        result = await processAudioInput(file);
      } else if (file.type.startsWith('video/')) {
        result = await processVideoInput(file);
      } else {
        throw new Error('Unsupported file type');
      }
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Notify success
      toast.success(`${capitalizeFirst(result.type)} processed successfully`, {
        description: `${result.metadata.insights?.length || 0} insights extracted`
      });
      
      // Pass the result to the parent component
      onMediaProcessed(result);
      
      // Reset the form after a short delay
      setTimeout(() => {
        setUploadProgress(0);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file');
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };
  
  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  const triggerFileInput = (type: 'image' | 'audio' | 'video') => {
    if (type === 'image' && imageInputRef.current) {
      imageInputRef.current.click();
    } else if (type === 'audio' && audioInputRef.current) {
      audioInputRef.current.click();
    } else if (type === 'video' && videoInputRef.current) {
      videoInputRef.current.click();
    }
  };
  
  // Configure the file types based on the active tab
  const getAcceptTypes = (type: string): string => {
    switch (type) {
      case 'image':
        return 'image/jpeg,image/png,image/gif,image/webp';
      case 'audio':
        return 'audio/mpeg,audio/wav,audio/ogg,audio/mp3';
      case 'video':
        return 'video/mp4,video/webm,video/ogg';
      default:
        return '';
    }
  };
  
  const getTabIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4 mr-2" />;
      case 'audio':
        return <FileAudio className="h-4 w-4 mr-2" />;
      case 'video':
        return <FileVideo className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${allowedTypes.length}, 1fr)` }}>
            {allowedTypes.includes('image') && (
              <TabsTrigger value="image" className="flex items-center justify-center">
                <Image className="h-4 w-4 mr-2" />
                <span>Image</span>
              </TabsTrigger>
            )}
            {allowedTypes.includes('audio') && (
              <TabsTrigger value="audio" className="flex items-center justify-center">
                <FileAudio className="h-4 w-4 mr-2" />
                <span>Audio</span>
              </TabsTrigger>
            )}
            {allowedTypes.includes('video') && (
              <TabsTrigger value="video" className="flex items-center justify-center">
                <FileVideo className="h-4 w-4 mr-2" />
                <span>Video</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          {allowedTypes.map((type) => (
            <TabsContent key={type} value={type} className="mt-4">
              <div
                className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => triggerFileInput(type as 'image' | 'audio' | 'video')}
              >
                {isProcessing ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Processing {type}... {Math.round(uploadProgress)}%
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center space-y-4">
                      {getTabIcon(type)}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Drop your {type} here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Supports {type === 'image' ? 'JPG, PNG, GIF, WebP' : type === 'audio' ? 'MP3, WAV, OGG' : 'MP4, WebM, OGG'} (Max {maxSizeMB}MB)
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerFileInput(type as 'image' | 'audio' | 'video');
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Select {capitalizeFirst(type)}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Hidden file inputs */}
        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          accept={getAcceptTypes('image')}
          onChange={handleFileSelect}
        />
        <input
          type="file"
          ref={audioInputRef}
          className="hidden"
          accept={getAcceptTypes('audio')}
          onChange={handleFileSelect}
        />
        <input
          type="file"
          ref={videoInputRef}
          className="hidden"
          accept={getAcceptTypes('video')}
          onChange={handleFileSelect}
        />
      </CardContent>
    </Card>
  );
};

export default MediaUploader;
