
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Github, Atom, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  isCreatorVersion?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isCreatorVersion = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isCreatorVersion ? "/creator" : "/"} className="flex-shrink-0 flex items-center">
              <Atom className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-white">
                IntentSim {isCreatorVersion && <span className="text-purple-400">Creator</span>}
              </span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {isCreatorVersion ? (
                // Creator navigation links
                <>
                  <Link
                    to="/creator"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/creator")
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/creator/simulation"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/creator/simulation")
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Simulation
                  </Link>
                  <Link
                    to="/creator/notebook"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/creator/notebook")
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Notebook
                  </Link>
                </>
              ) : (
                // Visitor navigation links
                <>
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
                    to="/visitor-simulator"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/visitor-simulator")
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Try Simulation
                  </Link>
                  <Link
                    to="/simulation"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/simulation")
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    About
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <div className="text-gray-300 mr-2">
                  {user?.name}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => navigate('/auth')}
                >
                  <User className="h-5 w-5 mr-1" />
                  Creator Login
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => window.open("https://github.com/TheVoidIntent/IntentSim", "_blank")}
                >
                  <Github className="h-5 w-5 mr-1" />
                  GitHub
                </Button>
              </>
            )}
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
            {isCreatorVersion ? (
              // Creator mobile navigation
              <>
                <Link
                  to="/creator"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/creator")
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/creator/simulation"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/creator/simulation")
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Simulation
                </Link>
                <Link
                  to="/creator/notebook"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/creator/notebook")
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notebook
                </Link>
              </>
            ) : (
              // Visitor mobile navigation
              <>
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
                  to="/visitor-simulator"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/visitor-simulator")
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Try Simulation
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
                  About
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <button
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Creator Login
              </Link>
            )}
            
            <a
              href="https://github.com/TheVoidIntent/IntentSim"
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
