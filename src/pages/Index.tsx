
import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import NotebookLmEntries from '@/components/NotebookLmEntries';
import SharedAudioLibrary from '@/components/SharedAudioLibrary';
import DiscordIntegration from '@/components/DiscordIntegration';
import { toast } from 'sonner';

const Index = () => {
  const handleDiscordConnect = (discordId: string) => {
    toast.success(`Connected to Discord as @${discordId}`, {
      description: "You'll now receive simulation events in Discord."
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Helmet>
        <title>intentSim.org - Universe Simulation Through Intent Field Fluctuations</title>
        <meta name="description" content="Explore intent field fluctuations and emergent particle creation in a theoretical universe simulation lab" />
      </Helmet>
      
      <Hero />
      
      {/* Add Discord Integration section */}
      <section className="py-12 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
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
      
      {/* Add Shared Audio Library component */}
      <section className="py-12 px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Audio Resources
          </h2>
          <SharedAudioLibrary />
        </div>
      </section>
      
      <Features />
      <Testimonials />
      <ContactSection />
    </div>
  );
};

export default Index;
