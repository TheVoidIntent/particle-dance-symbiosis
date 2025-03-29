
import React from 'react';
import { Github, Mail, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/logo.svg" alt="IntentSim Logo" className="h-8 w-auto mr-2" />
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              intentSim.org
            </span>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://www.facebook.com/profile.php?id=61574833319107" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="https://instagram.com/thevoidintent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="https://www.threads.net/@thevoidintent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Threads">
              <span className="font-mono text-lg">@</span>
            </a>
            <a href="https://discord.gg/intentsim" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Discord">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="currentColor" />
              </svg>
            </a>
            <a href="https://github.com/thevoidintent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
              <Github className="h-6 w-6" />
            </a>
            <a href="mailto:info@intentSim.org" className="text-gray-400 hover:text-white transition-colors" aria-label="Email">
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} TheVoidIntent LLC. All rights reserved. Continuous simulation for research purposes only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
