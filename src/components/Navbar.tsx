import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, DownloadCloud, FileText, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Universe Simulation', path: '/simulation' },
    { name: 'Data Analysis', path: '/analysis' },
    { name: 'Documentation', path: '/documentation' },
    { name: 'Deployment', path: '/deployment' },
    { name: 'License', path: '/license' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="IntentSim Logo" className="h-10 w-auto mr-2" />
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                intentSim.org
              </span>
              <span className="ml-2 text-xs text-gray-400">by TheVoidIntent LLC</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-white bg-indigo-600/20'
                      : 'text-gray-300 hover:text-white hover:bg-indigo-600/10'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button variant="default" size="sm" className="ml-4 bg-indigo-600 hover:bg-indigo-700">
                <a href="https://github.com/TheVoidInent" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
            </div>
          </div>

          <div className="flex md:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-md shadow-lg">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? 'text-white bg-indigo-600/20'
                  : 'text-gray-300 hover:text-white hover:bg-indigo-600/10'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://github.com/TheVoidInent"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 mt-2"
            onClick={() => setIsOpen(false)}
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
