
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Music, Pause, Play, Volume2, ListMusic, Info, Clock, Tag, User, FileDown } from "lucide-react";
import { checkAudioFileExists } from "@/utils/audioUtils";

// Audio file categories
const AUDIO_CATEGORIES = [
  { id: 'theory', name: 'Theory', description: 'Foundational concepts of intent field theory' },
  { id: 'particles', name: 'Particles', description: 'Understanding particle behavior and charge dynamics' },
  { id: 'complexity', name: 'Complexity', description: 'Emergent patterns and complexity' },
  { id: 'tutorials', name: 'Tutorials', description: 'Guided explanations of the simulation' }
];

// Sample audio tracks
const AUDIO_TRACKS = [
  {
    id: 'intro-to-intent',
    title: 'Introduction to Intent Field Theory',
    description: 'A beginner-friendly overview of the intent field concept',
    category: 'theory',
    duration: '3:45',
    author: 'Dr. Maria Chen',
    url: '/audio/sample-placeholder.mp3', // This is our known-working sample
    tags: ['beginner', 'theory']
  },
  {
    id: 'particle-charge',
    title: 'Particle Charge Dynamics',
    description: 'How positive and negative charges affect particle behavior',
    category: 'particles',
    duration: '4:20',
    author: 'Prof. James Wilson',
    url: '/audio/categories/particles/charge-dynamics.mp3',
    tags: ['intermediate', 'particles']
  },
  {
    id: 'emergent-complexity',
    title: 'Emergence of Complexity',
    description: 'Understanding how simple rules lead to complex patterns',
    category: 'complexity',
    duration: '5:15',
    author: 'Dr. Alex Rodriguez',
    url: '/audio/categories/complexity/emergent-patterns.mp3',
    tags: ['advanced', 'complexity']
  },
  {
    id: 'simulation-guide',
    title: 'Guide to Using the Simulator',
    description: 'How to get the most out of the IntentSim explorer',
    category: 'tutorials',
    duration: '2:50',
    author: 'Sarah Johnson',
    url: '/audio/categories/tutorials/simulator-guide.mp3',
    tags: ['beginner', 'tutorial']
  },
  {
    id: 'knowledge-transfer',
    title: 'Knowledge Transfer Between Particles',
    description: 'The mechanism of information exchange in the intent field',
    category: 'particles',
    duration: '4:05',
    author: 'Prof. James Wilson',
    url: '/audio/categories/particles/knowledge-transfer.mp3',
    tags: ['advanced', 'particles']
  },
  {
    id: 'sample-audio',
    title: 'Sample Audio Track',
    description: 'A reliable sample audio track for testing playback',
    category: 'theory',
    duration: '0:30',
    author: 'IntentSim Team',
    url: '/audio/sample-placeholder.mp3',
    tags: ['sample', 'test']
  }
];

const AudioOptionsSection: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [availableTracks, setAvailableTracks] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Audio refs
  const audioRefs = useRef<{[key: string]: HTMLAudioElement | null}>({});
  
  // Initialize audio elements and check availability
  useEffect(() => {
    const checkAudioTracks = async () => {
      setIsLoading(true);
      const availability: {[key: string]: boolean} = {};
      
      // Check each track
      for (const track of AUDIO_TRACKS) {
        try {
          // Check if file exists
          const result = await checkAudioFileExists(track.url);
          availability[track.id] = result.exists;
          
          // Initialize audio element if file exists
          if (result.exists) {
            const audio = new Audio(track.url);
            audio.volume = volume;
            
            // Handle playback ended
            audio.addEventListener('ended', () => {
              if (currentTrack === track.id) {
                setIsPlaying(false);
                setCurrentTrack(null);
              }
            });
            
            audioRefs.current[track.id] = audio;
          }
        } catch (error) {
          console.error(`Error checking audio track ${track.id}:`, error);
          availability[track.id] = false;
        }
      }
      
      setAvailableTracks(availability);
      setIsLoading(false);
      
      // Make sure the sample track is available
      if (availability['sample-audio']) {
        toast.success("Audio player is ready!", { duration: 3000 });
      } else {
        toast.error("Audio playback may not work in this environment", { duration: 5000 });
      }
    };
    
    checkAudioTracks();
    
    // Cleanup on unmount
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);
  
  // Update audio volume when it changes
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = volume;
      }
    });
  }, [volume]);
  
  // Filter tracks by category
  const filteredTracks = selectedCategory 
    ? AUDIO_TRACKS.filter(track => track.category === selectedCategory)
    : AUDIO_TRACKS;
  
  // Handle play/pause
  const handlePlayPause = (trackId: string) => {
    // If this track is already playing
    if (currentTrack === trackId && isPlaying) {
      if (audioRefs.current[trackId]) {
        audioRefs.current[trackId]?.pause();
        setIsPlaying(false);
      }
      return;
    }
    
    // If another track is playing, stop it
    if (currentTrack && audioRefs.current[currentTrack]) {
      audioRefs.current[currentTrack]?.pause();
    }
    
    // Get the track
    const track = AUDIO_TRACKS.find(t => t.id === trackId);
    if (!track) return;
    
    // Check if track is available
    if (!availableTracks[trackId]) {
      // If this track isn't available, try playing the sample track
      if (trackId !== 'sample-audio' && availableTracks['sample-audio']) {
        toast.warning(`The track "${track.title}" is not available. Playing sample audio instead.`, { duration: 3000 });
        handlePlayPause('sample-audio');
        return;
      } else {
        toast.error("No audio tracks are available", { duration: 3000 });
        return;
      }
    }
    
    // Play the track
    const audio = audioRefs.current[trackId];
    if (audio) {
      audio.currentTime = 0;
      audio.play()
        .then(() => {
          setCurrentTrack(trackId);
          setIsPlaying(true);
          toast.success(`Now playing: ${track.title}`, { duration: 2000 });
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Failed to play audio. Try the sample track.", { duration: 3000 });
          setIsPlaying(false);
        });
    } else {
      // If we don't have an audio element yet, create one
      try {
        const newAudio = new Audio(track.url);
        newAudio.volume = volume;
        
        newAudio.addEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentTrack(null);
        });
        
        audioRefs.current[trackId] = newAudio;
        
        newAudio.play()
          .then(() => {
            setCurrentTrack(trackId);
            setIsPlaying(true);
            toast.success(`Now playing: ${track.title}`, { duration: 2000 });
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            toast.error("Failed to play audio. Try the sample track.", { duration: 3000 });
            setIsPlaying(false);
          });
      } catch (error) {
        console.error("Error creating audio element:", error);
        toast.error("Failed to initialize audio player", { duration: 3000 });
      }
    }
  };
  
  // Handle download (simulated)
  const handleDownload = (trackId: string) => {
    const track = AUDIO_TRACKS.find(t => t.id === trackId);
    if (!track) return;
    
    toast.success(`Downloading: ${track.title}`, { duration: 3000 });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = track.url;
    link.download = `${track.title.toLowerCase().replace(/ /g, '-')}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-indigo-400" />
          Audio Library
        </CardTitle>
        <CardDescription>
          Listen to curated audio explanations about the IntentSim universe
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
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <ListMusic className="h-4 w-4" /> Categories
          </h3>
          <div className="flex flex-wrap gap-2">
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
        </div>
        
        {/* Audio tracks list */}
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading audio library...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTracks.length > 0 ? (
              filteredTracks.map(track => (
                <div key={track.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{track.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {track.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3">{track.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {track.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User className="h-3 w-3" /> {track.author}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={currentTrack === track.id && isPlaying ? "default" : "outline"}
                        onClick={() => handlePlayPause(track.id)}
                        disabled={!availableTracks[track.id] && track.id !== 'sample-audio'}
                        className="gap-1"
                      >
                        {currentTrack === track.id && isPlaying ? (
                          <><Pause className="h-4 w-4" /> Pause</>
                        ) : (
                          <><Play className="h-4 w-4" /> Play</>
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(track.id)}
                        disabled={!availableTracks[track.id]}
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                      
                      {/* Availability indicator */}
                      <div 
                        className={`h-2 w-2 rounded-full ${availableTracks[track.id] ? 'bg-green-500' : 'bg-red-500'}`}
                        title={availableTracks[track.id] ? 'Available' : 'Unavailable'}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No audio tracks found in this category</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => toast.info("Log in as a creator to upload and manage your own audio library", { duration: 3000 })}
          >
            <Info className="h-4 w-4" />
            Become a creator to add your own audio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioOptionsSection;
