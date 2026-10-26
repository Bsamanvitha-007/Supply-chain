import React from 'react';
import { 
  Package, 
  Route, 
  Search, 
  Navigation, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Truck, 
  Boxes,
  Info
} from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  return (
    <section id="hero" className="relative pt-24 pb-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enterprise Highlights Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Amazon &amp; Flipkart Scale Architecture
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            Dynamic Programming Operations Engine
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Production-Grade Mathematical Solvers
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            100% Client-Side &bull; Zero External API Costs
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-4xl mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Supply Chain Optimization <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-400">
              Using Dynamic Programming
            </span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Intelligent algorithms for smarter warehousing, faster deliveries, and efficient e-commerce logistics.
          </p>
          <p className="mt-2 text-sm text-slate-400 leading-normal">
            Modern e-commerce giants handle millions of packages every hour. Every saved kilometer, every loaded kilogram, 
            and every accelerated database lookup directly impacts delivery SLA, fuel burn, and customer satisfaction.
          </p>
        </div>

        {/* Visual Logistics Network Graphic (SVG) */}
        <div className="mb-12 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl relative">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              INTEGRATED E-COMMERCE LOGISTICS PIPELINE SIMULATION
            </span>
            <span className="text-slate-500">Live Browser Dynamic Evaluation</span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 960 180" className="w-full min-w-[700px] h-auto">
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Pipeline Track */}
              <path
                d="M 80 90 L 260 90 L 460 90 L 680 90 L 880 90"
                stroke="url(#flowGrad)"
                strokeWidth="4"
                strokeDasharray="8 6"
                fill="none"
              />

              {/* Node 1: Vendor / Supplier */}
              <g transform="translate(80, 90)">
                <circle r="36" fill="#1E293B" stroke="#3B82F6" strokeWidth="2.5" />
                <circle r="26" fill="#0F172A" />
                <Boxes className="w-6 h-6 text-blue-400 -translate-x-3 -translate-y-3" />
                <text x="0" y="55" fill="#94A3B8" fontSize="12" fontWeight="600" textAnchor="middle">
                  1. Suppliers
                </text>
                <text x="0" y="70" fill="#64748B" fontSize="10" textAnchor="middle">
                  Raw Inbound Stock
                </text>
              </g>

              {/* Node 2: Fulfillment Center (0/1 Knapsack) */}
              <g transform="translate(260, 90)">
                <circle r="36" fill="#1E293B" stroke="#F59E0B" strokeWidth="2.5" filter="url(#glow)" />
                <circle r="26" fill="#0F172A" />
                <Package className="w-6 h-6 text-amber-400 -translate-x-3 -translate-y-3" />
                <text x="0" y="55" fill="#FBBF24" fontSize="12" fontWeight="700" textAnchor="middle">
                  2. Warehouse Packing
                </text>
                <text x="0" y="70" fill="#CBD5E1" fontSize="10" textAnchor="middle">
                  0/1 Knapsack (Cap. W)
                </text>
              </g>

              {/* Node 3: Inventory Search Engine (Optimal BST) */}
              <g transform="translate(460, 90)">
                <circle r="36" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
                <circle r="26" fill="#0F172A" />
                <Search className="w-6 h-6 text-sky-400 -translate-x-3 -translate-y-3" />
                <text x="0" y="55" fill="#38BDF8" fontSize="12" fontWeight="700" textAnchor="middle">
                  3. Catalog Database
                </text>
                <text x="0" y="70" fill="#CBD5E1" fontSize="10" textAnchor="middle">
                  Optimal BST Lookups
                </text>
              </g>

              {/* Node 4: Regional Distribution (Floyd-Warshall) */}
              <g transform="translate(680, 90)">
                <circle r="36" fill="#1E293B" stroke="#818CF8" strokeWidth="2.5" />
                <circle r="26" fill="#0F172A" />
                <Route className="w-6 h-6 text-indigo-400 -translate-x-3 -translate-y-3" />
                <text x="0" y="55" fill="#A5B4FC" fontSize="12" fontWeight="700" textAnchor="middle">
                  4. Inter-Hub Transit
                </text>
                <text x="0" y="70" fill="#CBD5E1" fontSize="10" textAnchor="middle">
                  Floyd-Warshall All-Pairs
                </text>
              </g>

              {/* Node 5: Last-Mile Delivery (TSP Held-Karp) */}
              <g transform="translate(880, 90)">
                <circle r="36" fill="#1E293B" stroke="#10B981" strokeWidth="2.5" />
                <circle r="26" fill="#0F172A" />
                <Truck className="w-6 h-6 text-emerald-400 -translate-x-3 -translate-y-3" />
                <text x="0" y="55" fill="#34D399" fontSize="12" fontWeight="700" textAnchor="middle">
                  5. Last-Mile Courier
                </text>
                <text x="0" y="70" fill="#CBD5E1" fontSize="10" textAnchor="middle">
                  Held-Karp TSP Cycle
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1 */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-5 rounded-xl transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
              <Package className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">Algorithm 1</div>
            <h3 className="text-base font-bold text-white mb-1">Warehouse Storage Optimization</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Solves the 0/1 Knapsack problem to pack highest total parcel value into weight-constrained delivery trucks.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
              Complexity: O(n·W) Time | O(n·W) Space
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-xl transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-3">
              <Route className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1">Algorithm 2</div>
            <h3 className="text-base font-bold text-white mb-1">Shortest Path Computation</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Applies Floyd–Warshall to calculate all-pairs shortest haul paths between multi-city fulfilment nodes.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
              Complexity: O(V³) Time | O(V²) Space
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 p-5 rounded-xl transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">Algorithm 3</div>
            <h3 className="text-base font-bold text-white mb-1">Efficient Database Searching</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Constructs an Optimal Binary Search Tree (OBST) minimizing expected comparison cost for high-velocity SKUs.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
              Complexity: O(n³) Time | O(n²) Space
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-xl transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
              <Navigation className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">Algorithm 4</div>
            <h3 className="text-base font-bold text-white mb-1">Multi-Stop Delivery Planning</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Solves the Traveling Salesperson Problem (TSP) using Held–Karp bitmask DP to compute the minimal tour cycle.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
              Complexity: O(n²·2ⁿ) Time | O(n·2ⁿ) Space
            </div>
          </div>
        </div>

        {/* CTA Button & Academic Disclaimer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 cursor-pointer text-sm"
          >
            <span>Explore the Algorithms</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3.5 py-2 rounded-lg border border-slate-800">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Operations Notice:</strong> Deterministic algorithmic simulations evaluate dynamic programming optimization against production baseline heuristics for e-commerce logistics.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
