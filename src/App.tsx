import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UniverseSimulation from './pages/UniverseSimulation';
import Notebook from './pages/Notebook';
import OrcidIntegrationPage from './pages/OrcidIntegrationPage';
import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <Router>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulation" element={<UniverseSimulation />} />
          <Route path="/orcid-integration" element={<OrcidIntegrationPage />} />
          <Route path="/notebook" element={<Notebook />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
