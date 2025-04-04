
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VisitorSimulator from './pages/VisitorSimulator';
import IntentSimonPage from './pages/IntentSimonPage';
import SimpleVisitor from './pages/SimpleVisitor';
import GeminiChatPage from './pages/GeminiChat';
import IntentAssistantPage from './pages/IntentAssistantPage';
import IntentAdvisorPage from './pages/IntentAdvisorPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/visitor" />} />
        <Route path="/visitor" element={<SimpleVisitor />} />
        <Route path="/simulator" element={<VisitorSimulator />} />
        <Route path="/mascot" element={<IntentSimonPage />} />
        <Route path="/gemini" element={<GeminiChatPage />} />
        <Route path="/assistant" element={<IntentAssistantPage />} />
        <Route path="/advisor" element={<IntentAdvisorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
