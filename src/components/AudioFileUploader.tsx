
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Headphones, Upload, X, Play, Pause, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

interface AudioFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

const AudioFileUploader: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.5);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newAudioFiles: AudioFile[] = [];

    Array.from(files).forEach(file => {
      // Check if it's an audio file
      if (!file.type.startsWith('audio/')) {
        toast.error(`${file.name} is not an audio file`);
        return;
      }

      // Create a URL for the audio file
      const audioUrl = URL.createObjectURL(file);
      newAudioFiles.push({
        id: `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        url: audioUrl,
        type: file.type,
        size: file.size
      });
    });

    if (newAudioFiles.length > 0) {
      setAudioFiles(prev => [...prev, ...newAudioFiles]);
      toast.success(`${newAudioFiles.length} audio file(s) uploaded successfully`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePlayPause = (audioId: string) => {
    const audioElement = audioRefs.current[audioId];
    if (!audioElement) return;

    if (currentlyPlaying === audioId) {
      // Pause the current audio
      audioElement.pause();
      setCurrentlyPlaying(null);
    } else {
      // Pause any currently playing audio
      if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
        audioRefs.current[currentlyPlaying]?.pause();
      }
      
      // Play the new audio
      audioElement.volume = volume;
      audioElement.play().catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Failed to play audio file");
      });
      setCurrentlyPlaying(audioId);
    }
  };

  const handleRemoveAudio = (audioId: string) => {
    // Stop playing if removing the currently playing audio
    if (currentlyPlaying === audioId && audioRefs.current[audioId]) {
      audioRefs.current[audioId]?.pause();
      setCurrentlyPlaying(null);
    }

    // Find the audio file to revoke its URL
    const audioToRemove = audioFiles.find(file => file.id === audioId);
    if (audioToRemove) {
      URL.revokeObjectURL(audioToRemove.url);
    }

    // Remove the audio from the state
    setAudioFiles(prev => prev.filter(file => file.id !== audioId));
    toast.success("Audio file removed");
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    // Update volume of currently playing audio
    if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
      audioRefs.current[currentlyPlaying]!.volume = newVolume;
    }
  };

  // Format file size to readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-indigo-400" />
          Audio File Management
        </CardTitle>
        <CardDescription>
          Upload and manage audio files for the Intent Universe Framework explanations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="volume" className="w-auto">Volume</Label>
            <Slider
              id="volume"
              min={0}
              max={1}
              step={0.01}
              value={[volume]}
              onValueChange={handleVolumeChange}
              className="w-32"
            />
          </div>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload Audio Files
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            multiple
          />
        </div>

        {audioFiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No audio files uploaded yet. Click the button above to add files.
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            {audioFiles.map(file => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-gray-900/60 border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => handlePlayPause(file.id)}
                  >
                    {currentlyPlaying === file.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm truncate max-w-md">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                    </span>
                  </div>
                  <audio 
                    ref={el => audioRefs.current[file.id] = el} 
                    src={file.url}
                    onEnded={() => setCurrentlyPlaying(null)}
                    onError={() => {
                      toast.error(`Error loading audio: ${file.name}`);
                      setCurrentlyPlaying(prev => prev === file.id ? null : prev);
                    }}
                  />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveAudio(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioFileUploader;
