import React, { useState } from 'react';
import { 
  Truck, 
  Warehouse, 
  Boxes, 
  Database, 
  MapPin, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  ArrowRight,
  TrendingUp,
  Table,
  Zap
} from 'lucide-react';

export const ProblemOverviewSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      title: 'Supplier',
      icon: Boxes,
      badge: 'Inbound Supply',
      color: 'blue',
      description: 'Raw product shipments arrive from merchant partners, OEM manufacturers, and local vendors.',
      bottleneck: 'Staggered arrival times and unstandardized packaging dimensions.',
      dpRole: 'Volume and batch grouping algorithms schedule incoming shipments.',
    },
    {
      id: 1,
      title: 'Warehouse',
      icon: Warehouse,
      badge: 'Storage & Sorting',
      color: 'amber',
      description: 'Goods are unpacked, inspected, and loaded into designated storage bins and feeder trucks.',
      bottleneck: 'Physical capacity of sorting bins and weight limits of feeder trucks.',
      dpRole: '0/1 Knapsack optimization maximizes cargo value per truck payload.',
    },
    {
      id: 2,
      title: 'Inventory Mgmt',
      icon: Database,
      badge: 'Data Indexing',
      color: 'sky',
      description: 'Millions of SKUs must be instantly queryable when customers search or place orders.',
      bottleneck: 'Popular festival items receive 10,000x more queries than obscure products.',
      dpRole: 'Optimal Binary Search Trees place high-velocity SKUs closest to root.',
    },
    {
      id: 3,
      title: 'Distribution Center',
      icon: Layers,
      badge: 'Regional Hub',
      color: 'indigo',
      description: 'Packages transit across highway networks between multi-city fulfillment centers.',
      bottleneck: 'Highway tolls, varied road distances, congestion, and multi-hop routing.',
      dpRole: 'Floyd–Warshall computes all-pairs shortest distances between all hubs.',
    },
    {
      id: 4,
      title: 'Delivery Route',
      icon: Truck,
      badge: 'Last-Mile Transit',
      color: 'emerald',
      description: 'Local delivery vans or riders navigate city streets to deliver packages to doorstep addresses.',
      bottleneck: 'Visiting 15-25 stops with minimum fuel consumption and on-time promise.',
      dpRole: 'Held–Karp Bitmask DP optimizes the minimal cyclic delivery tour.',
    },
    {
      id: 5,
      title: 'Customer',
      icon: UserCheck,
      badge: 'SLA Delivery',
      color: 'purple',
      description: 'End customer receives their package on time with live tracking confirmation.',
      bottleneck: 'Late deliveries directly reduce customer retention and incur penalty costs.',
      dpRole: 'Real-time deterministic routing guarantees on-time doorstep handoffs.',
    },
  ];

  return (
    <section id="overview" className="py-20 bg-slate-900 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            Theoretical Foundation & Supply Chain Architecture
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Real-World Problem Overview & Why DP Fits
          </h2>
          <p className="mt-3 text-base text-slate-300">
            E-commerce supply chains are networks of constrained optimization problems. When decisions made at early stages 
            (such as truck packing or routing) determine downstream efficiency, Dynamic Programming provides optimal solutions without combinatorial explosion.
          </p>
        </div>

        {/* Interactive Supply Chain Pipeline Flow */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl mb-14">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Interactive E-Commerce Pipeline (Click any stage to examine constraints)
            </h3>
            <span className="text-xs text-blue-400 font-mono">Stage {activeStep + 1} of 6</span>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-blue-950/70 border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white truncate">{st.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{st.badge}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Stage Detail Inspector */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
                  Stage Analysis: {steps[activeStep].badge}
                </span>
                <h4 className="text-xl font-bold text-white mt-1">
                  {steps[activeStep].title} Logistics Operations
                </h4>
              </div>
              <div className="text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                <strong>Target Objective:</strong> Minimize operational latency & resource waste
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" /> Operational Description
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {steps[activeStep].description}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                <div className="text-xs text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Operational Bottleneck
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {steps[activeStep].bottleneck}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                <div className="text-xs text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dynamic Programming Solution
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {steps[activeStep].dpRole}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Dynamic Programming is Suitable */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              The Two Prerequisites for Dynamic Programming
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-400 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-mono">1</span>
                  Optimal Substructure
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  An optimal solution to the problem contains optimal solutions to its subproblems. 
                  In logistics: if the shortest path from Warehouse A to Customer E passes through Node D, the sub-path from A to D must also be the shortest possible path between A and D.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-1">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">2</span>
                  Overlapping Subproblems
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A recursive algorithm visits the same subproblems repeatedly rather than generating new ones. 
                  In truck packing or TSP bitmasks, the remaining capacity or visited subset recurs across numerous decision branches. DP solves each subproblem once and caches the result.
                </p>
              </div>
            </div>
          </div>

          {/* Memoization vs Tabulation Comparison */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Table className="w-5 h-5 text-sky-400" />
              Memoization vs Tabulation (Architectural Trade-offs)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">Dimension</th>
                    <th className="py-2.5 px-3 font-semibold text-blue-400">Memoization (Top-Down)</th>
                    <th className="py-2.5 px-3 font-semibold text-emerald-400">Tabulation (Bottom-Up)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">Execution Order</td>
                    <td className="py-2.5 px-3">Top-down recursive with lookup cache</td>
                    <td className="py-2.5 px-3">Bottom-up iterative filling DP table</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">Subproblem Coverage</td>
                    <td className="py-2.5 px-3">Solves only subproblems needed on path</td>
                    <td className="py-2.5 px-3">Solves all subproblems systematically</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">Call Stack Overhead</td>
                    <td className="py-2.5 px-3 text-rose-300">Requires recursion stack memory</td>
                    <td className="py-2.5 px-3 text-emerald-300">No recursion stack; purely iterative</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">State Transition</td>
                    <td className="py-2.5 px-3">On-demand recursive calls</td>
                    <td className="py-2.5 px-3">Topological order (length, weight, k)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-white">Usage in this Case Study</td>
                    <td className="py-2.5 px-3">Selected path queries</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-400">Primary engine for all 4 algorithms</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200">Engineering Note:</strong> In production logistics engines (Amazon Fulfillment / Flipkart Ekart), bottom-up tabulation is preferred due to predictable memory allocation, cache locality, and zero risk of stack overflow on large inputs.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
