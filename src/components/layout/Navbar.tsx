import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, SearchIcon } from 'lucide-react';
export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="ml-2 text-xl font-bold text-neutral-900">
                LegalDoc
              </span>
            </Link>
          </div>
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`text-base font-medium ${isActive('/') ? 'text-primary-500' : 'text-neutral-700 hover:text-primary-500'}`}>
              Home
            </Link>
            <Link to="/dashboard" className={`text-base font-medium ${isActive('/dashboard') ? 'text-primary-500' : 'text-neutral-700 hover:text-primary-500'}`}>
              Dashboard
            </Link>
            <a href="/features" className="text-base font-medium text-neutral-700 hover:text-primary-500">
              Features
            </a>
            <a href="#pricing" className="text-base font-medium text-neutral-700 hover:text-primary-500">
              Pricing
            </a>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-neutral-100">
              <SearchIcon className="w-5 h-5 text-neutral-700" />
            </button>
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-primary-500 hover:bg-neutral-100">
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden bg-white border-t border-neutral-200 py-2">
          <div className="container mx-auto px-4 space-y-1">
            <Link to="/" className={`block py-2 px-3 rounded-md ${isActive('/') ? 'bg-primary-50 text-primary-500' : 'text-neutral-700 hover:bg-neutral-100'}`} onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/dashboard" className={`block py-2 px-3 rounded-md ${isActive('/dashboard') ? 'bg-primary-50 text-primary-500' : 'text-neutral-700 hover:bg-neutral-100'}`} onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <a href="#features" className="block py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100" onClick={() => setIsMenuOpen(false)}>
              Features
            </a>
            <a href="#pricing" className="block py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </a>
            <div className="pt-4 pb-2">
              <Link to="/dashboard" className="block w-full btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        </div>}
    </header>;
};