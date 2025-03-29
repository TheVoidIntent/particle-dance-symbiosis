
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import NotebookLmEntries from '@/components/NotebookLmEntries';
import SharedAudioLibrary from '@/components/SharedAudioLibrary';
import AudioFileUploader from '@/components/AudioFileUploader';
import DiscordIntegration from '@/components/DiscordIntegration';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileAudio, InfoIcon, Upload, BookOpen, BookText, ArrowRight, Brain, Share2, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

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
        <title>IntentSim | Universe Intent Simulation</title>
        <meta name="description" content="Explore universe creation through intent field fluctuations - a theoretical laboratory for emergent complexity" />
      </Helmet>
      
      {/* Hero section */}
      <section className="relative pt-20 md:pt-36 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <img src="/logo.svg" alt="IntentSim Logo" className="h-40 w-auto mx-auto" />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Universe Through Intent
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-10">
            A theoretical laboratory exploring universe creation through intent field fluctuations. 
            Watch as particles emerge from quantum fields, develop intent, and build complexity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link to="/simulation">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-6 h-auto">
                Launch Simulation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/analysis">
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-6 h-auto">
                View Data Analysis
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Cosmic Universe Image */}
        <div className="flex justify-center my-16 animate-float">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative">
              <img 
                src="/lovable-uploads/be1b6633-26f7-4b05-83a6-6a1c4d0b90ad.png" 
                alt="Cosmic Universe Diagram" 
                className="rounded-2xl shadow-2xl max-w-full md:max-w-xl mx-auto transform transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 rounded-2xl bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-lg font-medium px-6 text-center">
                  Universe Intent Model: The fundamental structure of particle creation from intent field fluctuations
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-8 py-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transform transition-all hover:scale-105 hover:bg-gray-800/70">
            <div className="w-12 h-12 mb-4 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Brain className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Intent Field Fluctuations</h3>
            <p className="text-gray-400">Watch as random quantum fluctuations in the intent field give rise to particles with varying charges and behaviors.</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transform transition-all hover:scale-105 hover:bg-gray-800/70">
            <div className="w-12 h-12 mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Share2 className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Emergent Complexity</h3>
            <p className="text-gray-400">Observe how simple particles with intent develop complex behaviors through interactions and knowledge sharing.</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transform transition-all hover:scale-105 hover:bg-gray-800/70">
            <div className="w-12 h-12 mb-4 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Universal Evolution</h3>
            <p className="text-gray-400">Study how charge, color, and intent affect particle behavior and drive universe evolution over time.</p>
          </div>
        </div>
      </section>
      
      {/* Notebook Integration Banner */}
      <section className="py-8 px-4 bg-gradient-to-r from-indigo-900/40 to-purple-900/40">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-900/50 px-3 py-1 rounded-full text-sm text-indigo-200 mb-4">
            <BookOpen className="h-4 w-4" />
            <span>New Feature</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Interactive Intent Notebook
          </h2>
          <p className="text-indigo-200 max-w-2xl mx-auto mb-6">
            Explore our research notes with audio annotations. Learn about intent field theory through guided discussions and simulations.
          </p>
          <Link to="/notebook">
            <Button variant="default" size="lg" className="bg-indigo-600 hover:bg-indigo-700 font-medium">
              Open Notebook
              <BookOpen className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
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
      <section className="py-12 px-4 bg-gradient-to-b from-gray-950 to-gray-900">
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
      
      <Footer />
    </div>
  );
};

export default Index;
