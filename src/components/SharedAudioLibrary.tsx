
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Headphones, Play, Pause, Info, Tag, ExternalLink, FileDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Predefined audio files that will be bundled with the application
const PREDEFINED_AUDIO_FILES = [
  {
    id: 'intro-intent-theory',
    name: 'Introduction to Intent Theory',
    description: 'Overview of the fundamental concepts behind intent field theory',
    category: 'Lectures',
    duration: '45:12', 
    url: '/audio/introduction-to-intent-theory.mp3'
  },
  {
    id: 'particle-interaction',
    name: 'Particle Interaction Dynamics',
    description: 'Technical explanation of how particles interact based on their charge and intent',
    category: 'Technical',
    duration: '32:05',
    url: '/audio/particle-interaction-dynamics.mp3'
  },
  {
    id: 'complexity-patterns',
    name: 'Emergent Complexity Patterns',
    description: 'Analysis of observed patterns emerging from intent field simulations',
    category: 'Research',
    duration: '28:47',
    url: '/audio/emergent-complexity-patterns.mp3'
  },
  {
    id: 'charge-implications',
    name: 'Charge and Knowledge Transfer',
    description: 'How particle charge affects information exchange in the model',
    category: 'Lectures',
    duration: '39:18',
    url: '/audio/charge-knowledge-transfer.mp3'
  },
  {
    id: 'simulation-parameters',
    name: 'Simulation Parameters Explained',
    description: 'Guide to understanding and tuning simulation parameters for different outcomes',
    category: 'Technical',
    duration: '22:35',
    url: '/audio/simulation-parameters-explained.mp3'
  }
];

const SharedAudioLibrary: React.FC = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.7);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [audioAvailability, setAudioAvailability] = useState<{[key: string]: boolean}>({});
  const audioRefs = React.useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // Check if audio files actually exist
  useEffect(() => {
    const checkAudioAvailability = async () => {
      const availabilityResults: {[key: string]: boolean} = {};
      
      for (const file of PREDEFINED_AUDIO_FILES) {
        try {
          const response = await fetch(file.url, { method: 'HEAD' });
          availabilityResults[file.id] = response.ok;
        } catch (error) {
          availabilityResults[file.id] = false;
        }
      }
      
      setAudioAvailability(availabilityResults);
    };
    
    checkAudioAvailability();
  }, []);
  
  // Get unique categories
  const categories = Array.from(new Set(PREDEFINED_AUDIO_FILES.map(file => file.category)));
  
  // Filter audio files by category
  const filteredAudioFiles = selectedCategory
    ? PREDEFINED_AUDIO_FILES.filter(file => file.category === selectedCategory)
    : PREDEFINED_AUDIO_FILES;

  const handlePlayPause = (audioId: string) => {
    // Check if the audio file is available
    if (!audioAvailability[audioId]) {
      toast.error("This audio file is not available yet");
      return;
    }
    
    const audioElement = audioRefs.current[audioId];
    if (!audioElement) {
      toast.error("Audio file not available");
      return;
    }

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
        toast.error("This audio file is not yet available. Check back later.");
      });
      setCurrentlyPlaying(audioId);
    }
  };

  const downloadSampleAudio = (audioId: string) => {
    const file = PREDEFINED_AUDIO_FILES.find(f => f.id === audioId);
    if (!file) return;
    
    // Create a link to download the file
    const link = document.createElement('a');
    link.href = file.url;
    link.download = `${file.name.toLowerCase().replace(/ /g, '-')}.mp3`;
    link.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-indigo-400" />
          Audio Library
        </CardTitle>
        <CardDescription>
          Listen to explanations and lectures about the Intent Universe Framework
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredAudioFiles.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No audio files found in this category.
            </div>
          ) : (
            filteredAudioFiles.map(file => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-gray-900/60 border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`h-8 w-8 p-0 rounded-full ${!audioAvailability[file.id] ? 'opacity-50' : ''}`}
                          onClick={() => handlePlayPause(file.id)}
                        >
                          {currentlyPlaying === file.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {audioAvailability[file.id] ? 'Play audio' : 'Audio file not available yet'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex flex-col max-w-xs md:max-w-md">
                    <span className="font-medium text-sm truncate">{file.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {file.duration}
                      </span>
                      <Badge variant="outline" className="text-xs py-0">
                        {file.category}
                      </Badge>
                    </div>
                    {file.description && (
                      <span className="text-xs text-muted-foreground truncate mt-1">
                        {file.description}
                      </span>
                    )}
                  </div>
                  <audio 
                    ref={el => audioRefs.current[file.id] = el} 
                    src={file.url}
                    onEnded={() => setCurrentlyPlaying(null)}
                    onError={() => {
                      setCurrentlyPlaying(prev => prev === file.id ? null : prev);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                    onClick={() => toast.info(file.description || "No description available")}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                    onClick={() => downloadSampleAudio(file.id)}
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-8 bg-indigo-950/30 rounded-md p-4 border border-indigo-800">
          <h3 className="text-lg font-medium flex items-center mb-2">
            <ExternalLink className="mr-2 h-5 w-5 text-indigo-400" />
            Adding Your Own Audio
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            To add these audio files to your site, place them in the <code className="bg-gray-800 px-1 py-0.5 rounded">public/audio/</code> directory with the following filenames:
          </p>
          <ul className="text-sm text-gray-300 space-y-1.5 ml-6 list-disc">
            {PREDEFINED_AUDIO_FILES.map(file => (
              <li key={file.id}>
                <code className="bg-gray-800 px-1 py-0.5 rounded">{file.url.split('/').pop()}</code> - {file.name}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/documentation'}
              className="text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/30"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Media Documentation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SharedAudioLibrary;
