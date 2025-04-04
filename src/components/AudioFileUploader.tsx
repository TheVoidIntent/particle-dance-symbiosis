import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Headphones, Upload, X, Play, Pause, Volume2, Search, Info, Tag, Download } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface AudioFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  category?: string;
  description?: string;
  dateAdded: string;
}

const AudioFileUploader: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.5);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFileDetails, setShowFileDetails] = useState<string | null>(null);
  const [fileDescription, setFileDescription] = useState<string>('');
  const [fileCategory, setFileCategory] = useState<string>('');
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions = [
    { id: 'lectures', name: 'Lectures' },
    { id: 'technical', name: 'Technical' },
    { id: 'research', name: 'Research' },
    { id: 'interviews', name: 'Interviews' },
    { id: 'ambient', name: 'Ambient' },
    { id: 'uncategorized', name: 'Uncategorized' }
  ];

  useEffect(() => {
    loadAudioFiles();
  }, []);

  const loadAudioFiles = () => {
    try {
      const savedFiles = localStorage.getItem('intentSimAudioFiles');
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        
        const restoredFiles = parsedFiles.map((file: AudioFile) => {
          return {
            ...file,
            url: file.url.startsWith('blob:') ? '' : file.url,
            needsRedownload: file.url.startsWith('blob:')
          };
        });
        
        setAudioFiles(restoredFiles);
        toast.success(`Loaded ${restoredFiles.length} saved audio files`);
      }
    } catch (error) {
      console.error('Error loading saved audio files:', error);
      toast.error('Failed to load saved audio files');
    }
  };

  const saveAudioFiles = (files: AudioFile[]) => {
    try {
      localStorage.setItem('intentSimAudioFiles', JSON.stringify(files));
    } catch (error) {
      console.error('Error saving audio files:', error);
      toast.error('Failed to save audio files');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newAudioFiles: AudioFile[] = [];

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('audio/')) {
        toast.error(`${file.name} is not an audio file`);
        return;
      }

      const audioUrl = URL.createObjectURL(file);
      const effectiveCategory = fileCategory || 'uncategorized';
      
      newAudioFiles.push({
        id: `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        url: audioUrl,
        type: file.type,
        size: file.size,
        category: effectiveCategory,
        description: fileDescription || '',
        dateAdded: new Date().toISOString()
      });
      
      toast.info(
        `Storage recommendation:`, 
        { 
          description: `Save "${file.name}" to /audio/categories/${effectiveCategory}/`,
          duration: 5000
        }
      );
    });

    if (newAudioFiles.length > 0) {
      const updatedFiles = [...audioFiles, ...newAudioFiles];
      setAudioFiles(updatedFiles);
      saveAudioFiles(updatedFiles);
      toast.success(`${newAudioFiles.length} audio file(s) uploaded successfully`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFileDescription('');
      setFileCategory('');
    }
  };

  const handlePlayPause = (audioId: string) => {
    const audioElement = audioRefs.current[audioId];
    if (!audioElement) return;

    if (currentlyPlaying === audioId) {
      audioElement.pause();
      setCurrentlyPlaying(null);
    } else {
      if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
        audioRefs.current[currentlyPlaying]?.pause();
      }
      
      audioElement.volume = volume;
      audioElement.play().catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Failed to play audio file");
      });
      setCurrentlyPlaying(audioId);
    }
  };

  const handleRemoveAudio = (audioId: string) => {
    if (currentlyPlaying === audioId && audioRefs.current[audioId]) {
      audioRefs.current[audioId]?.pause();
      setCurrentlyPlaying(null);
    }

    const audioToRemove = audioFiles.find(file => file.id === audioId);
    if (audioToRemove && audioToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(audioToRemove.url);
    }

    const updatedFiles = audioFiles.filter(file => file.id !== audioId);
    setAudioFiles(updatedFiles);
    saveAudioFiles(updatedFiles);
    toast.success("Audio file removed");
  };

  const handleUpdateAudioDetails = (audioId: string) => {
    const updatedFiles = audioFiles.map(file => {
      if (file.id === audioId) {
        return {
          ...file,
          description: fileDescription,
          category: fileCategory
        };
      }
      return file;
    });
    
    setAudioFiles(updatedFiles);
    saveAudioFiles(updatedFiles);
    setShowFileDetails(null);
    toast.success("Audio file details updated");
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
      audioRefs.current[currentlyPlaying]!.volume = newVolume;
    }
  };

  const handleExportAudioList = () => {
    const exportData = audioFiles.map(file => ({
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.size,
      category: file.category,
      description: file.description,
      dateAdded: file.dateAdded
    }));
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `intent-sim-audio-catalog-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast.success("Audio catalog exported successfully");
  };

  const handleShowFileDetails = (audioId: string) => {
    const file = audioFiles.find(file => file.id === audioId);
    if (file) {
      setFileDescription(file.description || '');
      setFileCategory(file.category || '');
      setShowFileDetails(audioId);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categories = Array.from(new Set(audioFiles.map(file => file.category || 'Uncategorized')));

  const filteredAudioFiles = audioFiles.filter(file => {
    const matchesSearch = searchQuery === '' || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || file.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 items-center gap-2">
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
          
          <div className="flex gap-2">
            <Button onClick={() => document.getElementById('file-description-category')?.click()} variant="outline">
              <Tag className="mr-1 h-4 w-4" />
              Add Details
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Audio Files
            </Button>
            <input
              id="file-description-category"
              type="button"
              className="hidden"
              onClick={() => {
                setShowFileDetails('new');
                setFileDescription('');
                setFileCategory('');
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audio files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="whitespace-nowrap"
            onClick={handleExportAudioList}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Catalog
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500 dark:text-gray-400">Category Structure:</label>
          <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700 text-sm">
            <p className="mb-2 font-medium">Audio files are organized in these categories:</p>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map(category => (
                <div key={category.id} className="flex items-center">
                  <span className="text-indigo-400 mr-1">•</span>
                  <code className="bg-gray-700/50 px-1 rounded">/audio/categories/{category.id}/</code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {audioFiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No audio files uploaded yet. Click the button above to add files.
          </div>
        ) : (
          <Tabs defaultValue="all" className="mt-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setSelectedCategory(null)}>
                All Files
              </TabsTrigger>
              {Array.from(new Set(audioFiles.map(file => file.category || 'uncategorized'))).map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {categoryOptions.find(c => c.id === category)?.name || category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="space-y-2">
                {filteredAudioFiles.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No matching audio files found.
                  </div>
                ) : (
                  filteredAudioFiles.map(file => (
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
                        <div className="flex flex-col max-w-xs md:max-w-md">
                          <span className="font-medium text-sm truncate">{file.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                            </span>
                            {file.category && (
                              <Badge variant="outline" className="text-xs py-0">
                                {file.category}
                              </Badge>
                            )}
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
                            toast.error(`Error loading audio: ${file.name}`);
                            setCurrentlyPlaying(prev => prev === file.id ? null : prev);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                          onClick={() => handleShowFileDetails(file.id)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveAudio(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            {categories.map(category => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="space-y-2">
                  {filteredAudioFiles.filter(file => file.category === category).length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No matching audio files in this category.
                    </div>
                  ) : (
                    filteredAudioFiles
                      .filter(file => file.category === category)
                      .map(file => (
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
                              <span className="font-medium text-sm truncate max-w-xs md:max-w-md">{file.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)} • Added {formatDate(file.dateAdded)}
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
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                              onClick={() => handleShowFileDetails(file.id)}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveAudio(file.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
        
        <Dialog open={showFileDetails !== null} onOpenChange={(open) => !open && setShowFileDetails(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {showFileDetails === 'new' ? 'Add File Details' : 'Edit File Details'}
              </DialogTitle>
              <DialogDescription>
                Add a description and category to better organize your audio files.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file-category">Category</Label>
                <Select
                  value={fileCategory}
                  onValueChange={setFileCategory}
                >
                  <SelectTrigger id="file-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Files will be recommended to store in /audio/categories/{fileCategory || "uncategorized"}/
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file-description">Description</Label>
                <Input
                  id="file-description"
                  placeholder="Brief description of the audio content"
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowFileDetails(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (showFileDetails === 'new') {
                    fileInputRef.current?.click();
                  } else {
                    handleUpdateAudioDetails(showFileDetails);
                  }
                }}
              >
                {showFileDetails === 'new' ? 'Continue to Upload' : 'Update Details'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AudioFileUploader;
