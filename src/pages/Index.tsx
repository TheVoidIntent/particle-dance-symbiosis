
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SimulationPreview from "@/components/SimulationPreview";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">IntentSim</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            A universe born from intent to know itself. Watch particles emerge from intent field fluctuations,
            interact based on charge, and evolve in complexity.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/universe-simulator">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Explore Simulation
              </Button>
            </Link>
          </div>
        </div>

        {/* Simulation Preview */}
        <div className="mb-16">
          <SimulationPreview />
        </div>

        {/* Social Links */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-6">Connect with Us</h2>
          <div className="flex justify-center gap-6">
            <a href="https://facebook.com/intentsim" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://instagram.com/intentsim" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://threads.net/intentsim" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-at-sign">
                <circle cx="12" cy="12" r="4" />
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
              </svg>
              <span className="sr-only">Threads</span>
            </a>
            <a href="https://discord.gg/intentsim" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="12" r="1" />
                <circle cx="15" cy="12" r="1" />
                <path d="M7.5 7.2a15 15 0 0 1 9 0" />
                <path d="M7.5 16.8a15 15 0 0 0 9 0" />
                <path d="M20 6v12c0 1-1 2-2 2H6c-1 0-2-1-2-2V6c0-1 1-2 2-2h12c1 0 2 1 2 2Z" />
              </svg>
              <span className="sr-only">Discord</span>
            </a>
            <a href="https://github.com/intentsim/simulation" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>

        {/* About Section */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">About IntentSim</h2>
          <p className="mb-4">
            IntentSim is a continuous simulation of a universe governed by information and intent. 
            Watch as particles emerge from field fluctuations, interact based on their charge properties, 
            and evolve in complexity. Positive charges seek interaction, negative charges avoid it, and 
            neutral particles follow their own path.
          </p>
          <p>
            Our simulation runs continuously, collecting data that is stored in daily exports. 
            Researchers and enthusiasts can analyze these data files to discover emerging patterns, 
            complexity growth, and the evolution of order from chaos.
          </p>
        </div>
      </div>
    </div>
  );
}
