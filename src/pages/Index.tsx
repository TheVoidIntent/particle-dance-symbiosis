
import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import NotebookLmEntries from '@/components/NotebookLmEntries';

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
      
      <Features />
      <Testimonials />
      <ContactSection />
    </div>
  );
};

export default Index;
