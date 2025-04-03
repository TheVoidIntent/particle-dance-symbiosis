
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SimpleVisitor from './pages/SimpleVisitor';
import CreatorDashboard from './pages/CreatorDashboard';
import DataAnalysis from './pages/DataAnalysis';
import VisitorSimulator from './pages/VisitorSimulator';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleVisitor />} />
        <Route path="/creator" element={<CreatorDashboard />} />
        <Route path="/analysis" element={<DataAnalysis />} />
        <Route path="/visitor" element={<VisitorSimulator />} />
      </Routes>
    </Router>
  );
};

export default App;
