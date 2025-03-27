
import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, Database, ChartLine, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="text-white font-semibold text-xl flex items-center mb-4">
              <Atom className="mr-2 h-5 w-5 text-indigo-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                intentSim.org
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Explore the universe through intent field simulations - a theoretical laboratory for understanding cosmic emergence.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/intentSim" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-indigo-600 hover:text-white transition-all">
                <Github size={18} />
              </a>
              <a href="https://twitter.com/intentSim" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-indigo-600 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="mailto:contact@intentsim.org" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-indigo-600 hover:text-white transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white text-base font-semibold mb-6">Simulation</h4>
            <ul className="space-y-3">
              <li><Link to="/simulation" className="text-gray-400 hover:text-indigo-400 transition-colors">Interactive Simulation</Link></li>
              <li><Link to="/simulation" className="text-gray-400 hover:text-indigo-400 transition-colors">Parameter Controls</Link></li>
              <li><Link to="/simulation" className="text-gray-400 hover:text-indigo-400 transition-colors">Particle Dynamics</Link></li>
              <li><Link to="/simulation" className="text-gray-400 hover:text-indigo-400 transition-colors">Anomaly Detection</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white text-base font-semibold mb-6">Analysis</h4>
            <ul className="space-y-3">
              <li><Link to="/analysis" className="text-gray-400 hover:text-indigo-400 transition-colors">Data Visualization</Link></li>
              <li><Link to="/analysis" className="text-gray-400 hover:text-indigo-400 transition-colors">Complexity Metrics</Link></li>
              <li><Link to="/analysis" className="text-gray-400 hover:text-indigo-400 transition-colors">Entropy Analysis</Link></li>
              <li><Link to="/analysis" className="text-gray-400 hover:text-indigo-400 transition-colors">Research Data</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white text-base font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Theoretical Background</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Research Papers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} intentSim.org - Universe Intent Simulation Explorer
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <span className="text-gray-700">•</span>
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Terms of Service</a>
              <span className="text-gray-700">•</span>
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
