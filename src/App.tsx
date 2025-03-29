
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import UniverseSimulation from './pages/UniverseSimulation';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from "sonner";
import { initializeMotherSimulation, startMotherSimulation } from './utils/motherSimulation';

function App() {
  // Initialize and start the continuous simulation when the app loads
  useEffect(() => {
    console.info("🔄 Initializing mother simulation...");
    initializeMotherSimulation();
    startMotherSimulation();
    
    // Remove any Lovable badge that might be added automatically
    const removeBadge = () => {
      const badges = document.querySelectorAll('[class*="lovable"], [id*="lovable"], [class*="gpte"], [id*="gpte"]');
      badges.forEach(badge => {
        if (badge.parentNode) {
          badge.parentNode.removeChild(badge);
        }
      });
    };
    
    // Run on first load and set an interval to catch any dynamically added badges
    removeBadge();
    const interval = setInterval(removeBadge, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/simulation" element={<UniverseSimulation />} />
          <Route path="/" element={<Navigate to="/simulation" replace />} />
          <Route path="*" element={<Navigate to="/simulation" replace />} />
        </Routes>
        <Toaster />
        <SonnerToaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
