
import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import NotebookLmEntries from '@/components/NotebookLmEntries';
import SharedAudioLibrary from '@/components/SharedAudioLibrary';

const Index = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Helmet>
        <title>intentSim.org - Universe Simulation Through Intent Field Fluctuations</title>
        <meta name="description" content="Explore intent field fluctuations and emergent particle creation in a theoretical universe simulation lab" />
      </Helmet>
      
      <Hero />
      
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
