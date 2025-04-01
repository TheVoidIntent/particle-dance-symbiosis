
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Headphones, Play, Pause, Info, Tag, ExternalLink, FileDown, FolderOpen, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { checkAudioFileExists } from "@/utils/audioUtils";

// Define categories structure
const AUDIO_CATEGORIES = [
  { id: 'lectures', name: 'Lectures', description: 'Educational presentations on intent theory' },
  { id: 'technical', name: 'Technical', description: 'Detailed explanations of simulation mechanics' },
  { id: 'research', name: 'Research', description: 'Research findings and analysis' },
  { id: 'interviews', name: 'Interviews', description: 'Discussions with researchers and contributors' },
  { id: 'ambient', name: 'Ambient', description: 'Background and simulation ambient sounds' }
];

// Audio file for demo purposes (this one always works)
const SAMPLE_AUDIO_URL = '/audio/sample-placeholder.mp3';

// Predefined audio files that will be bundled with the application
const PREDEFINED_AUDIO_FILES = [
  {
    id: 'intro-intent-theory',
    name: 'Introduction to Intent Theory',
    description: 'Overview of the fundamental concepts behind intent field theory',
    category: 'lectures',
    duration: '45:12', 
    url: '/audio/categories/lectures/introduction-to-intent-theory.mp3'
  },
  {
    id: 'particle-interaction',
    name: 'Particle Interaction Dynamics',
    description: 'Technical explanation of how particles interact based on their charge and intent',
    category: 'technical',
    duration: '32:05',
    url: '/audio/categories/technical/particle-interaction-dynamics.mp3'
  },
  {
    id: 'complexity-patterns',
    name: 'Emergent Complexity Patterns',
    description: 'Analysis of observed patterns emerging from intent field simulations',
    category: 'research',
    duration: '28:47',
    url: '/audio/categories/research/emergent-complexity-patterns.mp3'
  },
  {
    id: 'charge-implications',
    name: 'Charge and Knowledge Transfer',
    description: 'How particle charge affects information exchange in the model',
    category: 'lectures',
    duration: '39:18',
    url: '/audio/categories/lectures/charge-knowledge-transfer.mp3'
  },
  {
    id: 'simulation-parameters',
    name: 'Simulation Parameters Explained',
    description: 'Guide to understanding and tuning simulation parameters for different outcomes',
    category: 'technical',
    duration: '22:35',
    url: '/audio/categories/technical/simulation-parameters-explained.mp3'
  },
  {
    id: 'researcher-interview-1',
    name: 'Interview with Dr. Samantha Chen',
    description: 'Discussion about intent field fluctuations and their implications',
    category: 'interviews',
    duration: '48:22',
    url: '/audio/categories/interviews/dr-samantha-chen-interview.mp3'
  },
  {
    id: 'field-fluctuation-ambient',
    name: 'Field Fluctuation Sonification',
    description: 'Ambient audio based on intent field fluctuation data',
    category: 'ambient',
    duration: '15:34',
    url: '/audio/categories/ambient/field-fluctuation-sonification.mp3'
  },
  {
    id: 'sample-audio',
    name: 'Sample Audio (Always Works)',
    description: 'A sample audio file that always works for testing',
    category: 'technical',
    duration: '0:30',
    url: SAMPLE_AUDIO_URL
  }
];

const SharedAudioLibrary: React.FC = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.7);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [audioAvailability, setAudioAvailability] = useState<{[key: string]: boolean}>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize audio elements
  useEffect(() => {
    PREDEFINED_AUDIO_FILES.forEach(file => {
      if (!audioRefs.current[file.id]) {
        const audio = new Audio(file.url);
        audio.volume = volume;
        
        // Handle playback ended
        audio.addEventListener('ended', () => {
          setCurrentlyPlaying(null);
        });
        
        audioRefs.current[file.id] = audio;
      }
    });
    
    // Cleanup function
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  // Check if audio files actually exist
  useEffect(() => {
    const checkAudioAvailability = async () => {
      setIsLoading(true);
      const availabilityResults: {[key: string]: boolean} = {};
      
      // First, make sure our sample audio works
      const sampleResult = await checkAudioFileExists(SAMPLE_AUDIO_URL);
      availabilityResults['sample-audio'] = sampleResult.exists;
      
      // Then check other files
      for (const file of PREDEFINED_AUDIO_FILES) {
        if (file.id === 'sample-audio') continue; // Already checked
        
        try {
          const result = await checkAudioFileExists(file.url);
          availabilityResults[file.id] = result.exists;
        } catch (error) {
          availabilityResults[file.id] = false;
        }
      }
      
      setAudioAvailability(availabilityResults);
      setIsLoading(false);
      
      // If sample audio is available, show a success message
      if (availabilityResults['sample-audio']) {
        toast.success("Audio player is working! Try the sample audio.");
      } else {
        toast.error("Audio player may not work properly in this environment.");
      }
    };
    
    checkAudioAvailability();
  }, []);
  
  // Update volume when it changes
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = volume;
      }
    });
  }, [volume]);
  
  // Filter audio files by category
  const filteredAudioFiles = selectedCategory
    ? PREDEFINED_AUDIO_FILES.filter(file => file.category === selectedCategory)
    : PREDEFINED_AUDIO_FILES;

  const handlePlayPause = (audioId: string) => {
    const audioElement = audioRefs.current[audioId];
    if (!audioElement) {
      toast.error("Audio element not initialized");
      return;
    }

    // First, check if the file is available
    const fileExists = audioAvailability[audioId];
    if (!fileExists && audioId !== 'sample-audio') {
      // If the file doesn't exist and it's not our sample, try playing the sample instead
      toast.warning("This audio file is not available. Playing sample audio instead.");
      handlePlayPause('sample-audio');
      return;
    }

    if (currentlyPlaying === audioId) {
      // Pause the current audio
      audioElement.pause();
      setCurrentlyPlaying(null);
      toast.info("Audio paused");
    } else {
      // Pause any currently playing audio
      if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
        audioRefs.current[currentlyPlaying]?.pause();
      }
      
      // Play the new audio
      audioElement.volume = volume;
      audioElement.currentTime = 0; // Start from beginning
      
      audioElement.play()
        .then(() => {
          setCurrentlyPlaying(audioId);
          toast.success(`Now playing: ${PREDEFINED_AUDIO_FILES.find(f => f.id === audioId)?.name}`);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Failed to play audio. Trying sample audio...");
          
          // If playing fails, try the sample audio as a fallback
          if (audioId !== 'sample-audio') {
            handlePlayPause('sample-audio');
          }
        });
    }
  };

  const downloadSampleAudio = (audioId: string) => {
    const file = PREDEFINED_AUDIO_FILES.find(f => f.id === audioId);
    if (!file) return;
    
    // Create a link to download the file
    const link = document.createElement('a');
    link.href = file.url;
    link.download = `${file.name.toLowerCase().replace(/ /g, '-')}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloading: ${file.name}`);
  };

  const openCategoryFolder = (category: string) => {
    toast.info(`Category folder structure: /audio/categories/${category}/`);
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
      <CardContent>
        {/* Volume control */}
        <div className="mb-6 flex items-center gap-4">
          <Volume2 className="h-5 w-5 text-gray-500" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            className="w-full"
            onValueChange={(value) => setVolume(value[0] / 100)}
          />
          <span className="min-w-[40px] text-sm text-gray-500">{Math.round(volume * 100)}%</span>
        </div>
        
        {/* Category filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge 
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {AUDIO_CATEGORIES.map(category => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
        
        {isLoading ? (
          <div className="py-10 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Checking audio availability...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAudioFiles.map(file => (
              <div key={file.id} className="border rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{file.name}</h3>
                    <p className="text-sm text-gray-500">{file.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {file.duration}
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => openCategoryFolder(file.category)}>
                            <FolderOpen className="h-4 w-4 text-gray-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open category folder</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm"
                    variant={currentlyPlaying === file.id ? "default" : "outline"}
                    onClick={() => handlePlayPause(file.id)}
                    className="flex-1"
                  >
                    {currentlyPlaying === file.id ? (
                      <><Pause className="h-4 w-4 mr-2" /> Pause</>
                    ) : (
                      <><Play className="h-4 w-4 mr-2" /> Play</>
                    )}
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => downloadSampleAudio(file.id)}
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`h-2 w-2 rounded-full ${audioAvailability[file.id] ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{audioAvailability[file.id] ? 'Audio available' : 'Audio unavailable'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
            
            {filteredAudioFiles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No audio files found in this category</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SharedAudioLibrary;
