
import React from "react";
import { Helmet } from "react-helmet";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import SimulationData from "../components/SimulationData";
import GitHubDataVisualization from "../components/GitHubDataVisualization";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Universe Simulation</title>
        <meta name="description" content="Explore the universe simulation with emergent complexity" />
      </Helmet>
      <Hero />
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Universe Simulation Data</h2>
        <SimulationData />
        <div className="mt-16 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Repository Analytics</h2>
          <GitHubDataVisualization />
        </div>
      </div>
      <Features />
      <Testimonials />
      <ContactSection />
      <Footer />
    </>
  );
};

export default Index;
