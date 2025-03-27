
import React from 'react';
import { Link } from 'react-router-dom';
import { Atom, Github, Mail, Twitter, FileText, BookOpen, Brain } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <img src="/logo.svg" alt="IntentSim Logo" className="h-8 w-auto mr-2" />
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              intentSim.org
            </span>
          </div>
          <p className="text-gray-400 text-sm max-w-xs">
            A theoretical laboratory exploring universe creation through intent field fluctuations and emergent complexity.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://twitter.com/intentSim" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://github.com/thevoidintent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="mailto:info@intentSim.org" className="text-gray-400 hover:text-white transition-colors">
              <Mail className="h-5 w-5" />
            </a>
            <a href="/license" className="text-gray-400 hover:text-white transition-colors">
              <FileText className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-4">Simulation</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/simulation" className="hover:text-white transition-colors">Run Simulation</Link></li>
            <li><Link to="/analysis" className="hover:text-white transition-colors">Data Analysis</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Parameters</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-4">Resources</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Theory</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Publications</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            <li className="flex items-center gap-1">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="hover:text-white transition-colors">Notebook LM Integration</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-4">About</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} TheVoidIntent LLC. All rights reserved. Licensed for research purposes only.</p>
      </div>
    </footer>
  );
};

export default Footer;
