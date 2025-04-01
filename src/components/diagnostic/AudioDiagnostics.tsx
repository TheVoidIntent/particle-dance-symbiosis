
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Headphones, Play, Pause, AlertTriangle, CheckCircle, FileAudio, Bug, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const AudioDiagnostics: React.FC = () => {
  const [audioPath, setAudioPath] = useState<string>('/audio/categories/lectures/introduction-to-intent-theory.mp3');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fileExists, setFileExists] = useState<boolean | null>(null);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Function to check if a file exists by making a HEAD request
  const checkFileExists = async (path: string) => {
    try {
      addLog(`Checking if file exists: ${path}`);
      const response = await fetch(path, { method: 'HEAD' });
      setFileExists(response.ok);
      
      if (response.ok) {
        addLog(`✅ File exists! Status: ${response.status}`);
        // Get content type and size from headers if available
        const contentType = response.headers.get('Content-Type');
        const contentLength = response.headers.get('Content-Length');
        
        setFileInfo({
          contentType,
          size: contentLength ? `${(parseInt(contentLength) / 1024).toFixed(2)} KB` : 'Unknown'
        });
        
        addLog(`File type: ${contentType || 'Unknown'}`);
        addLog(`File size: ${contentLength ? `${(parseInt(contentLength) / 1024).toFixed(2)} KB` : 'Unknown'}`);
      } else {
        addLog(`❌ File does not exist! Status: ${response.status}`);
        setError(`File not found (HTTP ${response.status})`);
      }
    } catch (err) {
      setFileExists(false);
      setError(`Error checking file: ${err instanceof Error ? err.message : String(err)}`);
      addLog(`❌ Error checking file: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  const playAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setError(null);
        addLog('▶️ Audio playback started');
      })
      .catch(err => {
        setIsPlaying(false);
        setError(`Playback error: ${err instanceof Error ? err.message : String(err)}`);
        addLog(`❌ Playback error: ${err instanceof Error ? err.message : String(err)}`);
      });
  };
  
  const pauseAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
    addLog('⏸️ Audio playback paused');
  };
  
  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 19)]);
  };
  
  const handleAudioPath = () => {
    // Reset states
    setFileExists(null);
    setFileInfo(null);
    setError(null);
    setIsPlaying(false);
    
    // Check if file exists
    checkFileExists(audioPath);
  };
  
  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleCanPlay = () => {
      addLog('✅ Audio can be played');
    };
    
    const handleError = (e: Event) => {
      const audioError = audio.error;
      const errorMessage = audioError ? 
        `Audio error: ${audioError.code} - ${getAudioErrorMessage(audioError.code)}` : 
        'Unknown audio error';
      
      setError(errorMessage);
      addLog(`❌ ${errorMessage}`);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      addLog('🏁 Audio playback ended');
    };
    
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioPath]);
  
  // Get human-readable error message
  const getAudioErrorMessage = (code: number): string => {
    switch (code) {
      case 1: return 'MEDIA_ERR_ABORTED - Fetching process aborted by user';
      case 2: return 'MEDIA_ERR_NETWORK - Network error while loading';
      case 3: return 'MEDIA_ERR_DECODE - Error decoding audio file';
      case 4: return 'MEDIA_ERR_SRC_NOT_SUPPORTED - Audio format not supported';
      default: return 'Unknown error';
    }
  };
  
  const checkSampleAudio = () => {
    setAudioPath('/audio/sample-placeholder.mp3');
    setTimeout(() => {
      checkFileExists('/audio/sample-placeholder.mp3');
    }, 100);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-red-500" />
          Audio File Diagnostics
        </CardTitle>
        <CardDescription>
          Troubleshoot audio playback issues in your IntentSim application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            value={audioPath}
            onChange={(e) => setAudioPath(e.target.value)}
            placeholder="Audio file path (e.g., /audio/categories/lectures/file.mp3)"
            className="flex-1"
          />
          <Button onClick={handleAudioPath}>
            Check File
          </Button>
          <Button variant="outline" onClick={checkSampleAudio}>
            <FileAudio className="h-4 w-4 mr-2" />
            Test Sample File
          </Button>
        </div>
        
        {fileExists === true && (
          <Alert className="bg-green-950/20 border-green-800 text-green-100">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>File Exists</AlertTitle>
            <AlertDescription>
              The audio file was found on the server.
              {fileInfo && (
                <div className="mt-2 text-xs">
                  <div>Type: {fileInfo.contentType || 'Unknown'}</div>
                  <div>Size: {fileInfo.size || 'Unknown'}</div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {fileExists === false && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>File Not Found</AlertTitle>
            <AlertDescription>
              {error || 'The audio file could not be located at the specified path.'}
              <div className="mt-2 text-xs">
                <strong>Possible solutions:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>Check if the file exists in the correct directory</li>
                  <li>Ensure the path is correct (it should start with '/')</li>
                  <li>Verify file name and extension</li>
                  <li>The file may be too large for GitHub ({'>'}25MB)</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-gray-900/50 rounded-md p-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center">
              <Headphones className="mr-2 h-4 w-4 text-blue-400" />
              Audio Player Test
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isPlaying ? "default" : "outline"}
                onClick={playAudio}
                disabled={!fileExists}
              >
                <Play className="h-4 w-4 mr-1" />
                Play
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={pauseAudio}
                disabled={!isPlaying}
              >
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
            </div>
          </div>
          
          <audio 
            ref={audioRef} 
            src={audioPath} 
            preload="metadata"
            className="w-full mt-2"
            controls
          />
          
          {error && (
            <div className="mt-3 text-sm text-red-400 bg-red-950/20 p-2 rounded border border-red-900/50">
              {error}
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Diagnostic Logs</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLogs([])}
              className="h-6 px-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
          <div className="bg-black/50 rounded border border-gray-800 p-2 h-48 overflow-y-auto text-xs font-mono">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="py-1 border-b border-gray-800/50 last:border-0">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic py-2 text-center">No logs yet</div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-950/20 p-3 rounded border border-blue-900/30 text-sm">
          <h4 className="font-medium mb-1 text-blue-300">Common Audio Issues:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Files larger than 25MB cannot be stored on GitHub</li>
            <li>Audio files must have the correct MIME type (usually audio/mpeg for MP3)</li>
            <li>Check that your audio files are in the correct directory structure</li>
            <li>Ensure audio files have the correct file extension (.mp3, .wav, etc.)</li>
            <li>Browser compatibility issues with certain audio formats</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioDiagnostics;
