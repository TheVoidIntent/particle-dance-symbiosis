
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Github, Atom } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Atom className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-white">IntentSim</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                to="/simulation"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/simulation")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Simulation
              </Link>
              <Link
                to="/simulator"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/simulator")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Simulator
              </Link>
              <Link
                to="/analysis"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/analysis")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Analysis
              </Link>
              <Link
                to="/documentation"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/documentation")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Documentation
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => window.open("https://github.com/yourusername/intent-universe", "_blank")}
            >
              <Github className="h-5 w-5 mr-1" />
              GitHub
            </Button>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/simulation"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/simulation")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Simulation
            </Link>
            <Link
              to="/simulator"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/simulator")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Simulator
            </Link>
            <Link
              to="/analysis"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/analysis")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Analysis
            </Link>
            <Link
              to="/documentation"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/documentation")
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            <a
              href="https://github.com/yourusername/intent-universe"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
