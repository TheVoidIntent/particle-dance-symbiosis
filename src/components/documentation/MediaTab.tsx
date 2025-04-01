import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Headphones, BookOpen, FileText, Download, Upload, Music, ExternalLink } from "lucide-react";
import AudioFileUploader from "@/components/AudioFileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MediaTab: React.FC = () => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Audio/Visual Resources</CardTitle>
        <CardDescription className="text-gray-300">
          Multimedia resources explaining the Intent Universe Framework
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="audio">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="audio" className="flex-1">
              <Headphones className="mr-2 h-4 w-4" />
              Audio Resources
            </TabsTrigger>
            <TabsTrigger value="video" className="flex-1">
              <Video className="mr-2 h-4 w-4" />
              Video Resources
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex-1">
              <BookOpen className="mr-2 h-4 w-4" />
              Documentation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="audio" className="space-y-6">
            <Alert className="bg-indigo-950/30 border-indigo-800">
              <Music className="h-5 w-5 text-indigo-400" />
              <AlertTitle>Organized Audio File Storage</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  Audio files are now organized by categories in the 
                  <code className="bg-gray-800 px-1 py-0.5 rounded mx-1">public/audio/categories/</code> 
                  directory structure:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><code className="bg-gray-800 px-1 py-0.5 rounded">/categories/lectures/</code> - Educational presentations</li>
                  <li><code className="bg-gray-800 px-1 py-0.5 rounded">/categories/technical/</code> - Technical explanations</li>
                  <li><code className="bg-gray-800 px-1 py-0.5 rounded">/categories/research/</code> - Research findings</li>
                  <li><code className="bg-gray-800 px-1 py-0.5 rounded">/categories/interviews/</code> - Discussions and interviews</li>
                  <li><code className="bg-gray-800 px-1 py-0.5 rounded">/categories/ambient/</code> - Background sounds</li>
                </ul>
                <p className="mt-2">
                  Each category contains a README.md with specific guidelines for that type of audio.
                </p>
              </AlertDescription>
            </Alert>
            
            <h3 className="text-xl font-semibold flex items-center">
              <Headphones className="mr-2 h-5 w-5 text-indigo-400" />
              Audio Management
            </h3>
            
            <AudioFileUploader />
            
            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold flex items-center">
                <Headphones className="mr-2 h-5 w-5 text-indigo-400" />
                Featured Audio Resources
              </h3>
              
              <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center">
                  <div className="bg-indigo-600 rounded-full p-2 mr-3">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Introduction to Intent Theory</h4>
                    <p className="text-sm text-gray-400">45:12 • Conceptual overview</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-gray-600 hover:bg-gray-700"
                    onClick={() => window.location.href = "/"}
                  >
                    Listen
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center">
                  <div className="bg-indigo-600 rounded-full p-2 mr-3">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Particle Interaction Dynamics</h4>
                    <p className="text-sm text-gray-400">32:05 • Technical explanation</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-gray-600 hover:bg-gray-700"
                    onClick={() => window.location.href = "/"}
                  >
                    Listen
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center">
                  <div className="bg-indigo-600 rounded-full p-2 mr-3">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Emergent Complexity Patterns</h4>
                    <p className="text-sm text-gray-400">28:47 • Research findings</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-gray-600 hover:bg-gray-700"
                    onClick={() => window.location.href = "/"}
                  >
                    Listen
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="video" className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center">
              <Video className="mr-2 h-5 w-5 text-indigo-400" />
              Video Explanations
            </h3>
            
            <div className="bg-gray-900/60 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <div className="flex items-center justify-center h-full bg-gray-800 border border-gray-700">
                  <div className="text-center p-4">
                    <Video className="h-10 w-10 mx-auto text-indigo-400 mb-3" />
                    <p className="text-gray-300">Intent Universe Visualization</p>
                    <p className="text-sm text-gray-400 mt-1">Simulation of particle emergence and interaction</p>
                    <Button size="sm" className="mt-3 bg-indigo-600 hover:bg-indigo-700">
                      Watch Video
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                <div className="aspect-w-16 aspect-h-9">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-300 text-sm">Field Fluctuations</p>
                      <Button size="sm" variant="ghost" className="mt-2 text-indigo-400 hover:text-indigo-300">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700">
                <div className="aspect-w-16 aspect-h-9">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-300 text-sm">Inflation Events</p>
                      <Button size="sm" variant="ghost" className="mt-2 text-indigo-400 hover:text-indigo-300">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="docs" className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-indigo-400" />
              Documentation
            </h3>
            
            <div className="bg-gray-900/60 rounded-lg p-6 border border-gray-700">
              <h4 className="text-xl font-medium mb-2">Research Papers & Documentation</h4>
              <p className="text-gray-300 mb-4">Download technical documentation and research papers explaining the Intent Universe Framework in detail.</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                    <span className="text-gray-300">Intent Framework Whitepaper</span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-indigo-400">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                    <span className="text-gray-300">Technical Implementation Guide</span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-indigo-400">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                    <span className="text-gray-300">Research Findings Summary</span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-indigo-400">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MediaTab;
