
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Simulator from '@/pages/Simulator';
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Simulator />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
