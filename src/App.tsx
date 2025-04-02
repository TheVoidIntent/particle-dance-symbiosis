
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Simulation from './pages/Simulation';
import Research from './pages/Research';
import Notebook from './pages/Notebook';
import IntentSimonPage from './pages/IntentSimonPage';
import IntentAssistantPage from './pages/IntentAssistantPage';
import UniverseSimulator from './pages/UniverseSimulator';
import VisitorSimulator from './pages/VisitorSimulator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="universe" element={<UniverseSimulator />} />
          <Route path="visitor" element={<VisitorSimulator />} />
          <Route path="research" element={<Research />} />
          <Route path="notebook" element={<Notebook />} />
          <Route path="intentsimon" element={<IntentSimonPage />} />
          <Route path="assistant" element={<IntentAssistantPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
