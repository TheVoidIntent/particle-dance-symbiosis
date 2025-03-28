
import React, { useRef, useEffect } from 'react';
import { Pause, Play, ThumbsUp, ThumbsDown, Share, MoreVertical } from 'lucide-react';
import { formatTime } from '@/utils/formatUtils';

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
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback error:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
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
          <div className="relative w-full h-1.5 bg-gray-700 rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" 
              style={{ width: `${(progress / duration) * 100}%` }}
            ></div>
            <div 
              className="absolute top-0 h-3.5 w-3.5 bg-blue-300 rounded-full -mt-1 cursor-pointer" 
              style={{ left: `${(progress / duration) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
};

export default AudioNotePlayer;
