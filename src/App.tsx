
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import Documentation from './pages/Documentation';
import DataAnalysis from './pages/DataAnalysis';
import NotFound from './pages/NotFound';
import License from './pages/License';
import UniverseSimulation from './pages/UniverseSimulation';
import Deployment from './pages/Deployment';
import Notebook from './pages/Notebook';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from "sonner";

function App() {
  // Remove any Lovable badge that might be added automatically
  React.useEffect(() => {
    // Look for any elements with Lovable-related classes and remove them
    const removeBadge = () => {
      const badges = document.querySelectorAll('[class*="lovable"], [id*="lovable"], [class*="gpte"], [id*="gpte"]');
      badges.forEach(badge => {
        if (badge.parentNode) {
          badge.parentNode.removeChild(badge);
        }
      });
    };
    
    // Run on first load
    removeBadge();
    
    // Also set an interval to catch any dynamically added badges
    const interval = setInterval(removeBadge, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/analysis" element={<DataAnalysis />} />
          <Route path="/license" element={<License />} />
          <Route path="/simulation" element={<UniverseSimulation />} />
          <Route path="/deploy" element={<Deployment />} />
          <Route path="/notebook" element={<Notebook />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <SonnerToaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
