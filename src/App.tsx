
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UniverseSimulation from './pages/UniverseSimulation';
import Notebook from './pages/Notebook';
import OrcidIntegrationPage from './pages/OrcidIntegrationPage';
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulation" element={<UniverseSimulation />} />
          <Route path="/orcid-integration" element={<OrcidIntegrationPage />} />
          <Route path="/notebook" element={<Notebook />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
