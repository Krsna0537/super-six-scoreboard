
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="cricket-container">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="https://placehold.co/40x40/0EA5E9/FFFFFF?text=CC"
                alt="Cricket Cloud Logo"
                className="h-10 w-10"
              />
              <span className="ml-2 text-xl font-bold text-cricket-darkblue">CricketCloud</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 text-gray-700 rounded hover:bg-gray-100">Home</Link>
            <Link to="/tournaments" className="px-3 py-2 text-gray-700 rounded hover:bg-gray-100">Tournaments</Link>
            <Link to="/matches" className="px-3 py-2 text-gray-700 rounded hover:bg-gray-100">Matches</Link>
            <Link to="/teams" className="px-3 py-2 text-gray-700 rounded hover:bg-gray-100">Teams</Link>
            <Link to="/players" className="px-3 py-2 text-gray-700 rounded hover:bg-gray-100">Players</Link>
            <Link to="/rankings" className="px-3 py-2 text-gray-700 rounded hover:bg-gray-100">Rankings</Link>
            <Link to="/login" className="ml-4 px-4 py-2 cricket-button-primary">
              Sign In
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100" onClick={toggleMenu}>Home</Link>
              <Link to="/tournaments" className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100" onClick={toggleMenu}>Tournaments</Link>
              <Link to="/matches" className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100" onClick={toggleMenu}>Matches</Link>
              <Link to="/teams" className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100" onClick={toggleMenu}>Teams</Link>
              <Link to="/players" className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100" onClick={toggleMenu}>Players</Link>
              <Link to="/rankings" className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100" onClick={toggleMenu}>Rankings</Link>
              <Link to="/login" className="block px-3 py-2 cricket-button-primary" onClick={toggleMenu}>
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
