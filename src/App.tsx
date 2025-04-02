
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UniverseSimulation from './pages/UniverseSimulation';
import Notebook from './pages/Notebook';
import OrcidIntegrationPage from './pages/OrcidIntegrationPage';
import { ThemeProvider } from "@/components/theme-provider";
import CreatorDashboard from './pages/CreatorDashboard';
import VisitorSimulator from './pages/VisitorSimulator';
import AuthPage from './pages/AuthPage';
import PublicLayout from './components/layouts/PublicLayout';
import ProtectedLayout from './components/layouts/ProtectedLayout';
import { AuthProvider } from './contexts/AuthContext';
import GeminiChatPage from './pages/GeminiChat';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/simulation" element={<UniverseSimulation />} />
              <Route path="/visitor-simulator" element={<VisitorSimulator />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/chat" element={<GeminiChatPage />} />
            </Route>
            
            {/* Protected Routes (Creator Version) */}
            <Route element={<ProtectedLayout />}>
              <Route path="/creator" element={<CreatorDashboard />} />
              <Route path="/creator/simulation" element={<UniverseSimulation />} />
              <Route path="/creator/notebook" element={<Notebook />} />
              <Route path="/creator/orcid-integration" element={<OrcidIntegrationPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
