import React from 'react';
import { Layers, Check, Info } from 'lucide-react';

export const ComparisonTableSection: React.FC = () => {
  const comparisonData = [
    {
      algorithm: '0/1 Knapsack',
      app: 'Warehouse Feeder Truck Loading & Storage Bin Packing',
      goal: 'Maximize loaded parcel rupee value within total gross vehicular weight capacity',
      technique: '2D Tabulation (Items × Capacity) with Backtracking',
      timeComp: 'O(n · W)',
      spaceComp: 'O(n · W) [or O(W) rolling array]',
      variables: 'n = items count, W = truck payload capacity',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      algorithm: 'Floyd–Warshall',
      app: 'Inter-Hub Regional Distribution Network Routing',
      goal: 'Compute all-pairs shortest transit haul distances between fulfillment centers',
      technique: '3D In-Place Tabulation (Evaluating Pivot Vertices k = 1..V)',
      timeComp: 'O(V³)',
      spaceComp: 'O(V²)',
      variables: 'V = warehouse & delivery hub vertices count',
      tagColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    },
    {
      algorithm: 'Optimal BST (OBST)',
      app: 'Catalog SKU & Inventory Database Search Indexing',
      goal: 'Minimize weighted key comparisons during high-velocity customer product lookups',
      technique: 'Interval / Subtree Length Dynamic Programming (L = 1..n)',
      timeComp: 'O(n³)',
      spaceComp: 'O(n²)',
      variables: 'n = sorted inventory SKU keys count',
      tagColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    },
    {
      algorithm: 'TSP (Held–Karp)',
      app: 'Last-Mile Courier Doorstep Delivery Route Planning',
      goal: 'Find the minimum distance closed Hamiltonian cycle visiting all stops once',
      technique: 'Bitmask Dynamic Programming (dp[subset_mask][end_vertex])',
      timeComp: 'O(N² · 2ᴺ)',
      spaceComp: 'O(N · 2ᴺ)',
      variables: 'N = delivery doorstep stops count',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
  ];

  return (
    <section id="comparison" className="py-20 bg-slate-900 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-2">
            <Layers className="w-3.5 h-3.5" />
            Theoretical Analysis &amp; Complexity Synthesis
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Algorithm Comparison &amp; Complexity Matrix
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            A side-by-side formal evaluation of the four Dynamic Programming paradigms deployed in modern supply chains, 
            contrasting their formulation, asymptotic complexities, and operational applications.
          </p>
        </div>

        {/* Master Comparison Table */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300 uppercase tracking-wider font-mono">
                  <th className="py-4 px-4 font-bold">Algorithm</th>
                  <th className="py-4 px-4 font-bold">Supply Chain Application</th>
                  <th className="py-4 px-4 font-bold">Main Optimization Goal</th>
                  <th className="py-4 px-4 font-bold">DP Technique</th>
                  <th className="py-4 px-4 font-bold text-center">Time Complexity</th>
                  <th className="py-4 px-4 font-bold text-center">Space Complexity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition">
                    <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono border ${row.tagColor}`}>
                        {row.algorithm}
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-[220px] leading-relaxed">
                      {row.app}
                    </td>
                    <td className="py-4 px-4 max-w-[260px] leading-relaxed text-slate-400">
                      {row.goal}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-blue-300 max-w-[200px]">
                      {row.technique}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-amber-400 whitespace-nowrap">
                      {row.timeComp}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-sky-400 whitespace-nowrap">
                      {row.spaceComp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className="text-slate-200">Variable Disambiguation: </strong>
              <span className="font-mono text-slate-300">
                n (items/keys) &bull; W (truck capacity) &bull; V (graph network vertices) &bull; N (TSP delivery stops)
              </span>
            </div>
            <span className="text-emerald-400 font-mono font-semibold">Strict Mathematical Precision</span>
          </div>
        </div>

        {/* Production Complexity Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Polynomial vs Exponential DP Classification
            </h4>
            <p className="text-slate-400 leading-relaxed">
              0/1 Knapsack is <em>pseudo-polynomial</em> O(n·W); Floyd–Warshall is <em>polynomial</em> O(V³); 
              OBST is <em>polynomial</em> O(n³). In sharp contrast, TSP (Held–Karp) is <em>exponential</em> O(N²·2ᴺ), 
              as it must explore power set state space (2ᴺ) to guarantee exact optimality for an NP-hard problem.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-400" />
              Space Optimization Capabilities in Practice
            </h4>
            <p className="text-slate-400 leading-relaxed">
              0/1 Knapsack can be space-optimized from O(n·W) to O(W) using a single 1D array traversed backwards. 
              Floyd–Warshall can operate in-place with a single V×V distance matrix. OBST requires O(n²) for tree reconstruction from roots.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
