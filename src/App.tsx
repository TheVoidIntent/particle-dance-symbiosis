
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Simulation from './pages/Simulation';
import Research from './pages/Research';
import Notebook from './pages/Notebook';
import GeminiChat from './pages/GeminiChat';
import IntentAssistantPage from './pages/IntentAssistantPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="research" element={<Research />} />
          <Route path="notebook" element={<Notebook />} />
          <Route path="gemini" element={<GeminiChat />} />
          <Route path="assistant" element={<IntentAssistantPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
