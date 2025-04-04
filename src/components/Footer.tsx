
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h3 className="text-xl font-bold text-white">IntentSim</h3>
            </div>
            <p className="text-sm text-gray-400">
              A theoretical laboratory exploring universe creation through intent field fluctuations.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com/intentsim/simulation" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://twitter.com/IntentSim" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="mailto:contact@intentsim.org"
                 className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/simulation" className="text-gray-400 hover:text-white transition-colors">Simulation</Link></li>
              <li><Link to="/notebook" className="text-gray-400 hover:text-white transition-colors">Notebook</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/api" className="text-gray-400 hover:text-white transition-colors">API</Link></li>
              <li><Link to="/research" className="text-gray-400 hover:text-white transition-colors">Research Papers</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/license" className="text-gray-400 hover:text-white transition-colors">License</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} IntentSim.org. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-4 md:mt-0">
            Built by <a href="https://thevoidintent.org" className="text-indigo-400 hover:text-indigo-300 transition-colors">TheVoidIntent LLC</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
