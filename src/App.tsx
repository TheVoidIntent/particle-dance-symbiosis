
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UniverseSimulator from '@/pages/UniverseSimulator';
import Simulation from '@/pages/Simulation';
import MobileWellness from '@/pages/MobileWellness';
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UniverseSimulator />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/mobile-wellness" element={<MobileWellness />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
