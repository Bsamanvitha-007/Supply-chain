import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Route, 
  Search, 
  Navigation, 
  BarChart3, 
  Layers, 
  HelpCircle, 
  Menu, 
  X, 
  ArrowUp, 
  Boxes 
} from 'lucide-react';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Boxes },
    { id: 'knapsack', label: '0/1 Knapsack', icon: Package },
    { id: 'floyd-warshall', label: 'Floyd–Warshall', icon: Route },
    { id: 'obst', label: 'Optimal BST', icon: Search },
    { id: 'tsp', label: 'TSP Route', icon: Navigation },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'comparison', label: 'Comparison', icon: Layers },
    { id: 'architecture', label: 'Architecture', icon: Boxes },
    { id: 'faq', label: 'Technical FAQ', icon: HelpCircle },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70; // Header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Sticky Navbar */}
      <header className="fixed top-1 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Enterprise Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/30">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">LogiDP</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/40 px-1.5 py-0.2 rounded font-mono font-semibold">
                  Enterprise Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Supply Chain Optimization Architecture</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="px-2 py-1 rounded text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center space-x-1 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Dashboard / FAQ */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={() => scrollTo('dashboard')}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1.5 rounded-md transition shadow-sm cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-3 py-1.5 rounded-md transition cursor-pointer"
            >
              Technical FAQ
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 max-h-[80vh] overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="w-full text-left px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 hover:scale-105 transition-all duration-200 border border-blue-400/40 cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};
