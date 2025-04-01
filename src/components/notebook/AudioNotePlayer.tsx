
import React, { useRef, useEffect, useState } from 'react';
import { Pause, Play, ThumbsUp, ThumbsDown, Share, MoreVertical, Volume2 } from 'lucide-react';
import { formatTime } from '@/utils/formatUtils';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface AudioNotePlayerProps {
  title: string;
  progress: number;
  duration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  audioUrl: string;
}

const AudioNotePlayer: React.FC<AudioNotePlayerProps> = ({
  title,
  progress,
  duration,
  isPlaying,
  onTogglePlay,
  audioUrl
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(0.7);
  const [localProgress, setLocalProgress] = useState<number>(progress);
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);
  
  // Update progress when prop changes
  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);
  
  // Initialize audio element
  useEffect(() => {
    // Create a new audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.volume = volume;
      
      console.log("Audio element created with URL:", audioUrl);
    }
    
    return () => {
      // Clean up audio element when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      console.log("Volume set to:", volume);
    }
  }, [volume]);
  
  // Setup audio element and event listeners
  useEffect(() => {
    if (audioRef.current) {
      // Handle playback state
      if (isPlaying) {
        console.log("Attempting to play audio");
        audioRef.current.play().catch(error => {
          console.error("Audio playback error:", error);
          toast.error("Failed to play audio. Please check the audio file.");
          onTogglePlay(); // Toggle to non-playing state
        });
      } else {
        audioRef.current.pause();
      }
      
      // Try to set current time if needed
      if (Math.abs(audioRef.current.currentTime - localProgress) > 1) {
        audioRef.current.currentTime = localProgress;
      }
      
      // Setup event listeners
      const handleTimeUpdate = () => {
        if (audioRef.current) {
          setLocalProgress(audioRef.current.currentTime);
        }
      };
      
      const handleLoadedMetadata = () => {
        setAudioLoaded(true);
        console.log("Audio loaded successfully! Duration:", audioRef.current?.duration);
      };
      
      const handleError = (e: Event) => {
        console.error("Audio error:", e, audioRef.current?.error);
        setAudioLoaded(false);
        toast.error("Error loading audio file");
      };
      
      const handleEnded = () => {
        console.log("Audio playback ended");
        onTogglePlay(); // Reset playing state when audio ends
      };
      
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('error', handleError);
      audioRef.current.addEventListener('ended', handleEnded);
      
      // Cleanup function
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [isPlaying, localProgress, onTogglePlay]);
  
  // Handle seeking
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setLocalProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  return (
    <div className="relative rounded-lg border border-gray-700/50 bg-gray-800/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          <ThumbsUp className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          <ThumbsDown className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          <Share className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          <MoreVertical className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={onTogglePlay}
          className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        
        <div className="flex-1">
          <div className="w-full mb-2">
            <Slider
              value={[localProgress]}
              min={0}
              max={duration || 30}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(localProgress)}</span>
            <span>{formatTime(duration || 30)}</span>
          </div>
        </div>
      </div>
      
      {/* Volume control */}
      <div className="flex items-center space-x-2 mt-3">
        <Volume2 className="h-4 w-4 text-gray-400" />
        <Slider
          value={[volume * 100]}
          max={100}
          step={1}
          className="w-24"
          onValueChange={(value) => {
            const newVolume = value[0] / 100;
            setVolume(newVolume);
            console.log("Volume slider changed to:", newVolume);
          }}
        />
        <span className="text-xs text-gray-400">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
};

export default AudioNotePlayer;
