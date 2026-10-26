import React from 'react';
import { Boxes, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Boxes className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">LogiDP Analytics</span>
              <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono">
                Operations Suite
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Supply Chain Optimization Platform: Industrial algorithmic models for inventory management, 
              warehouse loading, inter-hub freight transit, and last-mile delivery route scheduling.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Engine: Dynamic Programming &bull; Operations Research &bull; Graph Theory</span>
            </div>
          </div>

          {/* Core Algorithms Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Optimization Modules
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => scrollTo('knapsack')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  0/1 Knapsack (Warehouse Packing)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('floyd-warshall')}
                  className="hover:text-indigo-400 transition cursor-pointer"
                >
                  Floyd–Warshall (Inter-Hub Transit)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('obst')}
                  className="hover:text-sky-400 transition cursor-pointer"
                >
                  Optimal BST (Catalog Indexing)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('tsp')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Held–Karp TSP (Last-Mile Routing)
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Telemetry Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform &amp; Insights
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => scrollTo('dashboard')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Executive Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('comparison')}
                  className="hover:text-purple-400 transition cursor-pointer"
                >
                  Complexity Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('architecture')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Execution Pipeline
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('faq')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Technical FAQ &amp; Architecture
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Production Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} LogiDP Operations Research. High-performance deterministic algorithms.
          </p>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pure client-side execution &bull; Zero external API dependencies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
