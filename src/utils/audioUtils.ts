
import { toast } from "sonner";

/**
 * Utility functions for audio file handling and diagnostics
 */

// Simple function to check if a file exists by making a HEAD request
export const checkAudioFileExists = async (path: string): Promise<{
  exists: boolean;
  contentType?: string;
  size?: string;
  status?: number;
  error?: string;
}> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    
    if (response.ok) {
      // File exists, get some info about it
      const contentType = response.headers.get('Content-Type');
      const contentLength = response.headers.get('Content-Length');
      
      return {
        exists: true,
        contentType: contentType || undefined,
        size: contentLength ? `${(parseInt(contentLength) / 1024).toFixed(2)} KB` : undefined,
        status: response.status
      };
    } else {
      // File doesn't exist
      return {
        exists: false,
        status: response.status,
        error: `File not found (HTTP ${response.status})`
      };
    }
  } catch (err) {
    // Error checking file
    return {
      exists: false,
      error: `Error checking file: ${err instanceof Error ? err.message : String(err)}`
    };
  }
};

// Play an audio file with error handling
export const playAudioWithErrorHandling = (audioUrl: string): {
  play: () => void;
  stop: () => void;
  isPlaying: boolean;
} => {
  let audioElement: HTMLAudioElement | null = null;
  let playing = false;
  
  const play = () => {
    if (audioElement) {
      // Stop existing playback
      audioElement.pause();
      audioElement = null;
    }
    
    audioElement = new Audio(audioUrl);
    
    audioElement.addEventListener('error', (e) => {
      const errorCode = audioElement?.error?.code;
      let errorMessage = 'Unknown audio error';
      
      switch (errorCode) {
        case 1:
          errorMessage = 'Fetching process aborted by user';
          break;
        case 2:
          errorMessage = 'Network error while loading audio';
          break;
        case 3:
          errorMessage = 'Error decoding audio file - file may be corrupted';
          break;
        case 4:
          errorMessage = 'Audio format not supported by your browser';
          break;
      }
      
      toast.error(`Audio playback error: ${errorMessage}`);
      playing = false;
    });
    
    audioElement.addEventListener('ended', () => {
      playing = false;
    });
    
    // Try to play the audio
    audioElement.play()
      .then(() => {
        playing = true;
      })
      .catch(err => {
        toast.error(`Failed to play audio: ${err instanceof Error ? err.message : String(err)}`);
        playing = false;
      });
  };
  
  const stop = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
      playing = false;
    }
  };
  
  return {
    play,
    stop,
    get isPlaying() { return playing; }
  };
};

// Get common audio issues based on diagnosis
export const getDiagnosticHelp = (
  path: string, 
  exists: boolean, 
  contentType?: string, 
  error?: string
): string[] => {
  const suggestions: string[] = [];
  
  if (!path.trim()) {
    suggestions.push("Audio path is empty. Provide a valid path to an audio file.");
    return suggestions;
  }
  
  // Basic path formatting issues
  if (!path.startsWith('/')) {
    suggestions.push("Audio path should start with '/' (e.g., '/audio/file.mp3')");
  }
  
  // Check file extension
  const extension = path.split('.').pop()?.toLowerCase();
  if (!extension) {
    suggestions.push("No file extension detected. Audio files should have extensions like .mp3, .wav, etc.");
  } else if (!['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(extension)) {
    suggestions.push(`File extension '${extension}' may not be a common audio format. Try using .mp3, .wav, or .ogg.`);
  }
  
  // File existence issues
  if (!exists) {
    suggestions.push("File not found at the specified path. Check if the file exists in the correct directory.");
    
    // GitHub size limit
    if (path.includes('/audio/categories/')) {
      suggestions.push("Files larger than 25MB cannot be stored on GitHub. Consider using an external storage solution.");
    }
    
    // Check for common path errors
    if (path.includes('src/')) {
      suggestions.push("Files in 'src/' directory are not accessible at runtime. Move files to 'public/' directory.");
    }
  } else if (contentType && !contentType.startsWith('audio/')) {
    suggestions.push(`File exists but doesn't have an audio MIME type (${contentType}). File may be corrupted or not an audio file.`);
  }
  
  // Error-specific suggestions
  if (error) {
    if (error.includes('NetworkError')) {
      suggestions.push("Network error while loading audio. Check your internet connection.");
    } else if (error.includes('MEDIA_ERR_DECODE')) {
      suggestions.push("Browser couldn't decode the audio. The file might be corrupted or in an unsupported format.");
    } else if (error.includes('MEDIA_ERR_SRC_NOT_SUPPORTED')) {
      suggestions.push("Audio format not supported by your browser. Try converting to MP3 or WAV format.");
    }
  }
  
  // General suggestions
  if (suggestions.length === 0) {
    suggestions.push("Audio file format is likely not supported by your browser. Try a different format.");
    suggestions.push("Check browser console for additional error details.");
  }
  
  // Always add these helpful suggestions
  suggestions.push("Try using the sample audio file (/audio/sample-placeholder.mp3) to test if your audio player works correctly.");
  
  return suggestions;
};

// Generate a list of folders to check for audio files
export const getAudioFolderPaths = (): string[] => {
  const categories = [
    'lectures',
    'technical',
    'research',
    'interviews',
    'ambient',
    'uncategorized'
  ];
  
  return [
    '/audio',
    ...categories.map(category => `/audio/categories/${category}`)
  ];
};
