
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import NotebookLmEntries from '@/components/NotebookLmEntries';
import SharedAudioLibrary from '@/components/SharedAudioLibrary';
import AudioFileUploader from '@/components/AudioFileUploader';
import DiscordIntegration from '@/components/DiscordIntegration';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileAudio, InfoIcon, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const Index = () => {
  const handleDiscordConnect = (discordId: string) => {
    toast.success(`Connected to Discord as @${discordId}`, {
      description: "You'll now receive simulation events in Discord."
    });
  };

  const handleGoToUploader = () => {
    // Find the tab trigger element and cast it to HTMLElement to use click()
    const uploadTab = document.querySelector('[data-state="inactive"][value="upload"]') as HTMLElement | null;
    if (uploadTab) {
      uploadTab.click();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Helmet>
        <title>intentSim.org - Universe Simulation Through Intent Field Fluctuations</title>
        <meta name="description" content="Explore intent field fluctuations and emergent particle creation in a theoretical universe simulation lab" />
      </Helmet>
      
      <Hero />
      
      {/* Audio Resource Management Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Audio Resource Management
          </h2>
          
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upload" className="text-md">Upload Audio Files</TabsTrigger>
              <TabsTrigger value="instructions" className="text-md">How To Add Files</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <AudioFileUploader />
            </TabsContent>
            
            <TabsContent value="instructions">
              <Card className="border border-indigo-800/50 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileAudio className="h-5 w-5 text-indigo-400" />
                    Adding Audio Files for Visitors
                  </CardTitle>
                  <CardDescription>
                    There are two ways to add audio files to the IntentSim platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-white">Option 1: Upload Through Browser</h3>
                    <p className="text-gray-300 mb-4">
                      Use the uploader in the "Upload Audio Files" tab to directly add MP3 files through your browser.
                      This is the easiest method and allows you to manage all files through this interface.
                    </p>
                    <Button onClick={handleGoToUploader}>
                      <Upload className="mr-2 h-4 w-4" />
                      Go to File Uploader
                    </Button>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium mb-2 text-white">Option 2: Place Files in Public Directory</h3>
                    <p className="text-gray-300 mb-2">
                      Place the following MP3 files in the <code className="bg-gray-900 px-1 py-0.5 rounded">public/audio/</code> directory:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-300">
                      <li><code className="bg-gray-900 px-1 py-0.5 rounded">introduction-to-intent-theory.mp3</code></li>
                      <li><code className="bg-gray-900 px-1 py-0.5 rounded">particle-interaction-dynamics.mp3</code></li>
                      <li><code className="bg-gray-900 px-1 py-0.5 rounded">emergent-complexity-patterns.mp3</code></li>
                      <li><code className="bg-gray-900 px-1 py-0.5 rounded">charge-knowledge-transfer.mp3</code></li>
                      <li><code className="bg-gray-900 px-1 py-0.5 rounded">simulation-parameters-explained.mp3</code></li>
                    </ul>
                    <p className="text-gray-300 mt-4">
                      These files will automatically be served to visitors through the Audio Library component.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Add Discord Integration section */}
      <section className="py-12 px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Connect & Share
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <DiscordIntegration onConnect={handleDiscordConnect} />
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Why Connect?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-indigo-900/40 text-indigo-400 rounded-full h-6 w-6 mr-3 text-xs mt-0.5">1</span>
                  <div>
                    <span className="block font-medium text-white mb-1">Real-time Notifications</span>
                    <span className="text-sm text-gray-400">Receive alerts about inflation events, anomalies, and discoveries directly in Discord.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-indigo-900/40 text-indigo-400 rounded-full h-6 w-6 mr-3 text-xs mt-0.5">2</span>
                  <div>
                    <span className="block font-medium text-white mb-1">Share Discoveries</span>
                    <span className="text-sm text-gray-400">Export your simulation findings and share them with the IntentSim community.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-indigo-900/40 text-indigo-400 rounded-full h-6 w-6 mr-3 text-xs mt-0.5">3</span>
                  <div>
                    <span className="block font-medium text-white mb-1">Join The Conversation</span>
                    <span className="text-sm text-gray-400">Participate in discussions about intent theory and quantum mechanics with like-minded researchers.</span>
                  </div>
                </li>
              </ul>
              <div className="mt-6 p-3 bg-black/30 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 italic">
                  "Breaking the Quantum!" — Join our community of over 500 researchers exploring the Information-Intent Nexus theory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add Notebook LM Entries component */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <NotebookLmEntries />
        </div>
      </section>
      
      <Features />
      <Testimonials />
      <ContactSection />
      
      {/* Footer with copyright - no navigation links that send back to top */}
      <footer className="py-6 px-4 bg-gray-900 text-center text-gray-400 text-sm">
        <p>© 2025 TheVoidIntent LLC. All rights reserved.</p>
        <p>Licensed for research purposes only.</p>
      </footer>
    </div>
  );
};

export default Index;
