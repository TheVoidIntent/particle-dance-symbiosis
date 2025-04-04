
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Share2, Zap, User, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Helmet>
        <title>IntentSim | Universe Intent Simulation</title>
        <meta name="description" content="Explore universe creation through intent field fluctuations - a theoretical laboratory for emergent complexity" />
        <meta property="og:title" content="IntentSim | Universe Intent Simulation" />
        <meta property="og:description" content="Explore a proto-universe shaped by evolving intent. Data-driven, emergent, and alive." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://intentsim.org" />
        <meta property="og:image" content="https://intentsim.org/og-image.png" />
      </Helmet>
      
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        {/* Enhanced background particles with more vibrant colors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" 
               style={{animationDuration: '15s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"
               style={{animationDuration: '20s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"
               style={{animationDuration: '12s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-cyan-700 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"
               style={{animationDuration: '18s'}}></div>
        </div>
        
        {/* Hero section */}
        <section className="relative pt-20 md:pt-36 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8">
              <img src="/logo.svg" alt="IntentSim Logo" className="h-40 w-auto mx-auto animate-float" />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-300">
              Universe Through Intent
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-10 leading-relaxed">
              A theoretical laboratory exploring universe creation through intent field fluctuations. 
              Watch as particles emerge from quantum fields, develop intent, and build complexity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link to="/visitor-simulator">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-7 h-auto rounded-xl shadow-lg shadow-indigo-700/20 transition-all hover:shadow-indigo-700/40">
                  Try the Simulation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              {isAuthenticated ? (
                <Link to="/creator">
                  <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-7 h-auto rounded-xl border-2">
                    <Lock className="mr-2 h-5 w-5" />
                    Creator Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-7 h-auto rounded-xl border-2">
                    <User className="mr-2 h-5 w-5" />
                    Creator Access
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Cosmic Universe Image with enhanced styling */}
          <div className="flex justify-center my-16 animate-float">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
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
          
          {/* Feature highlights with enhanced styling */}
          <div className="grid md:grid-cols-3 gap-8 py-12">
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-6 transform transition-all hover:scale-105 hover:border-indigo-500/30 shadow-xl">
              <div className="w-12 h-12 mb-4 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Brain className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-300">Intent Field Fluctuations</h3>
              <p className="text-gray-400">Watch as random quantum fluctuations in the intent field give rise to particles with varying charges and behaviors.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 transform transition-all hover:scale-105 hover:border-purple-500/30 shadow-xl">
              <div className="w-12 h-12 mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-300">Emergent Complexity</h3>
              <p className="text-gray-400">Observe how simple particles with intent develop complex behaviors through interactions and knowledge sharing.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6 transform transition-all hover:scale-105 hover:border-pink-500/30 shadow-xl">
              <div className="w-12 h-12 mb-4 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-pink-300">Universal Evolution</h3>
              <p className="text-gray-400">Study how charge, color, and intent affect particle behavior and drive universe evolution over time.</p>
            </div>
          </div>
          
          {/* Call to action with enhanced styling */}
          <div className="mt-20 mb-28 text-center">
            <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 border border-indigo-500/30 rounded-xl p-10 backdrop-blur-md shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
                Explore Both Versions of IntentSim
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Try our public simulation explorer or log in to access the full creator version with advanced features, data analysis, and notebook integration.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/visitor-simulator">
                  <Button size="lg" className="bg-white hover:bg-gray-100 text-gray-900 font-medium px-8 py-6 h-auto rounded-xl">
                    Visitor Experience
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-medium px-8 py-6 h-auto rounded-xl">
                    Creator Access
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
