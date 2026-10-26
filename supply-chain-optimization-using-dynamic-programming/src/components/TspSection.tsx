import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  RotateCcw, 
  Play, 
  Truck, 
  MapPin, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { TspLocation, TspResult } from '../types';
import { 
  DEFAULT_TSP_LOCATIONS, 
  DEFAULT_TSP_DISTANCES, 
  solveTspHeldKarp, 
  validateDistanceMatrix 
} from '../utils/tspHeldKarp';

interface TspSectionProps {
  onResultChange?: (result: TspResult) => void;
}

export const TspSection: React.FC<TspSectionProps> = ({ onResultChange }) => {
  const [locations] = useState<TspLocation[]>(DEFAULT_TSP_LOCATIONS);
  const [matrix, setMatrix] = useState<number[][]>(() =>
    DEFAULT_TSP_DISTANCES.map(row => [...row])
  );
  const [startIndex, setStartIndex] = useState<number>(0);
  const [result, setResult] = useState<TspResult>(() =>
    solveTspHeldKarp(DEFAULT_TSP_LOCATIONS, DEFAULT_TSP_DISTANCES, 0)
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initial sync with parent dashboard
  useEffect(() => {
    onResultChange?.(result);
  }, []);

  const handleCellChange = (i: number, j: number, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    const updated = matrix.map(row => [...row]);
    updated[i][j] = num;
    if (i !== j) {
      updated[j][i] = num; // Maintain symmetry automatically
    }
    setMatrix(updated);
  };

  const handleRunOptimization = () => {
    const validation = validateDistanceMatrix(matrix);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid distance matrix.');
      return;
    }
    setValidationError(null);
    const newResult = solveTspHeldKarp(locations, matrix, startIndex);
    setResult(newResult);
    onResultChange?.(newResult);
  };

  const handleReset = () => {
    const defaultMatrix = DEFAULT_TSP_DISTANCES.map(row => [...row]);
    setMatrix(defaultMatrix);
    setStartIndex(0);
    setValidationError(null);
    const defaultRes = solveTspHeldKarp(DEFAULT_TSP_LOCATIONS, defaultMatrix, 0);
    setResult(defaultRes);
    onResultChange?.(defaultRes);
  };

  const handleStartChange = (newStart: number) => {
    setStartIndex(newStart);
    const newResult = solveTspHeldKarp(locations, matrix, newStart);
    setResult(newResult);
    onResultChange?.(newResult);
  };

  // Helper to determine if an edge (u, v) is part of the optimal tour sequence
  const isTourEdge = (u: number, v: number) => {
    for (let i = 0; i < result.tour.length - 1; i++) {
      if (
        (result.tour[i] === u && result.tour[i + 1] === v) ||
        (result.tour[i] === v && result.tour[i + 1] === u)
      ) {
        return true;
      }
    }
    return false;
  };

  // Get sequence position for node in the tour
  const getTourStopNumber = (nodeIdx: number) => {
    const idx = result.tour.indexOf(nodeIdx);
    if (idx === -1) return '';
    if (idx === 0) return 'Start';
    if (idx === result.tour.length - 1) return 'Return';
    return `Stop ${idx}`;
  };

  return (
    <section id="tsp" className="py-20 bg-slate-900 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <Navigation className="w-3.5 h-3.5" />
              Algorithm 4 : Traveling Salesperson Problem (Held–Karp DP)
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Multi-Stop Delivery Route Optimization
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl">
              Last-mile courier vans must visit multiple customer addresses and return to the dispatch depot. 
              Held–Karp utilizes bitmask dynamic programming to find the exact global minimum-cost Hamiltonian cycle.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Matrix
            </button>
            <button
              onClick={handleRunOptimization}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              Calculate Best Route
            </button>
          </div>
        </div>

        {validationError && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/60 border border-rose-700 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Start Location Selector & Metric Summary */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                Dispatch Depot / Start Location:
              </label>
              <select
                value={startIndex}
                onChange={(e) => handleStartChange(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-medium"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.code}: {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Optimal Tour Distance</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-0.5 font-mono">
                {result.totalDistance} <span className="text-xs text-slate-400 font-normal">km</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Sequential Baseline Distance</div>
              <div className="text-2xl font-extrabold text-slate-300 mt-0.5 font-mono">
                {result.baselineDistance} <span className="text-xs text-slate-400 font-normal">km</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Distance Saved by DP</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-0.5 font-mono">
                -{result.baselineDistance - result.totalDistance} <span className="text-xs text-slate-400 font-normal">km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Map Canvas & Matrix Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Map Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  Last-Mile Delivery Network &amp; Optimal Tour Path
                </h3>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  {result.tour.length - 1} Delivery Stops
                </span>
              </div>

              {/* Map SVG */}
              <div className="w-full relative flex items-center justify-center py-2">
                <svg viewBox="0 0 540 380" className="w-full h-auto max-h-[360px]">
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="18"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                    </marker>
                  </defs>

                  {/* Tour Directed Segments */}
                  {Array.from({ length: result.tour.length - 1 }, (_, idx) => {
                    const u = locations[result.tour[idx]];
                    const v = locations[result.tour[idx + 1]];
                    const distVal = matrix[result.tour[idx]][result.tour[idx + 1]];

                    const midX = (u.x + v.x) / 2;
                    const midY = (u.y + v.y) / 2;

                    return (
                      <g key={`tour-seg-${idx}`}>
                        <line
                          x1={u.x}
                          y1={u.y}
                          x2={v.x}
                          y2={v.y}
                          stroke="#10B981"
                          strokeWidth="3.5"
                          strokeDasharray="6 4"
                          markerEnd="url(#arrow)"
                          className="transition-all duration-300"
                        />
                        <rect
                          x={midX - 16}
                          y={midY - 9}
                          width="32"
                          height="18"
                          rx="3"
                          fill="#0F172A"
                          stroke="#10B981"
                          strokeWidth="1"
                        />
                        <text
                          x={midX}
                          y={midY + 4}
                          textAnchor="middle"
                          fill="#34D399"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {distVal}k
                        </text>
                      </g>
                    );
                  })}

                  {/* Network Nodes */}
                  {locations.map((loc) => {
                    const isStart = loc.id === startIndex;
                    const stopLabel = getTourStopNumber(loc.id);

                    return (
                      <g
                        key={loc.id}
                        className="cursor-pointer"
                        onClick={() => handleStartChange(loc.id)}
                      >
                        <circle
                          cx={loc.x}
                          cy={loc.y}
                          r="22"
                          fill={isStart ? '#065F46' : '#1E293B'}
                          stroke={isStart ? '#10B981' : '#475569'}
                          strokeWidth={isStart ? '3.5' : '2'}
                        />
                        <text
                          x={loc.x}
                          y={loc.y + 4}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {loc.code}
                        </text>

                        {/* Stop Number Badge */}
                        <rect
                          x={loc.x - 22}
                          y={loc.y - 34}
                          width="44"
                          height="14"
                          rx="3"
                          fill={isStart ? '#047857' : '#334155'}
                        />
                        <text
                          x={loc.x}
                          y={loc.y - 24}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="8"
                          fontWeight="bold"
                        >
                          {stopLabel}
                        </text>

                        {/* Location Name Below */}
                        <text
                          x={loc.x}
                          y={loc.y + 36}
                          textAnchor="middle"
                          fill={isStart ? '#34D399' : '#94A3B8'}
                          fontSize="10"
                          fontWeight="500"
                        >
                          {loc.name.split(' ')[0]} {loc.name.split(' ')[1]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-slate-400">Reconstructed Tour Sequence: </span>
                <span className="font-mono font-bold text-emerald-400">
                  {result.tour.map((idx) => locations[idx].code).join(' → ')}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Returns to {locations[startIndex].code}</span>
            </div>
          </div>

          {/* Symmetric Distance Matrix Editor (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Symmetric Distance Matrix (km)
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">Editable (i &harr; j)</span>
              </div>

              <div className="overflow-x-auto mb-3">
                <table className="w-full text-center border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400">
                      <th className="p-1.5 border border-slate-800">Dist</th>
                      {locations.map((loc) => (
                        <th key={loc.id} className="p-1.5 border border-slate-800 text-emerald-400">
                          {loc.code.replace('CUST-', '')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {matrix.map((row, i) => (
                      <tr key={locations[i].id} className="hover:bg-slate-900/40">
                        <td className="p-1.5 border border-slate-800 bg-slate-900 text-emerald-400 font-bold">
                          {locations[i].code.replace('CUST-', '')}
                        </td>
                        {row.map((val, j) => {
                          const isDiagonal = i === j;
                          const inTour = isTourEdge(i, j);

                          if (isDiagonal) {
                            return (
                              <td key={j} className="p-1.5 border border-slate-800 bg-slate-900 text-slate-600">
                                0
                              </td>
                            );
                          }

                          return (
                            <td
                              key={j}
                              className={`p-1 border border-slate-800 ${
                                inTour ? 'bg-emerald-950/40 text-emerald-300 font-bold' : 'bg-slate-950 text-slate-300'
                              }`}
                            >
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={val}
                                onChange={(e) => handleCellChange(i, j, e.target.value)}
                                className="w-10 text-center bg-transparent border-b border-transparent hover:border-slate-700 focus:border-emerald-400 focus:outline-none"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-400 mb-2">
                Editing cell (i, j) automatically mirrors to (j, i) to preserve road network symmetry.
              </p>
            </div>

            {/* Bitmask DP State Summary Table */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-white mb-2 flex items-center justify-between">
                <span>Sample DP Bitmask States [dp[mask][u]]</span>
                <span className="text-[10px] text-slate-400 font-mono">Subsets evaluated</span>
              </div>
              <div className="space-y-1 text-[11px] font-mono">
                {result.dpTableSummary.slice(0, 4).map((st, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300 bg-slate-950/60 px-2 py-1 rounded">
                    <span>
                      mask={st.maskBinary} ({st.visitedNames.join(',')})
                    </span>
                    <span className="text-emerald-400">
                      end={st.lastNode} : {st.cost}km
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Recurrence & Computational Complexity Card */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400" />
            Held–Karp Formulation &amp; Real-World Limitations
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-xs text-slate-300 font-mono">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-emerald-300">
                <div className="text-slate-400 font-sans font-semibold">Held-Karp Recurrence:</div>
                <div className="text-amber-300">
                  dp[mask][i] = min_{'{'}j &isin; mask, j &ne; i{'}'} ( dp[mask \ {'{'}i{'}'}][j] + dist[j][i] )
                </div>
                <div className="text-slate-400 pt-1 text-[11px] font-sans">
                  Where <strong>mask</strong> is a bitmask integer tracking visited locations, and <strong>i</strong> is the last visited destination.
                </div>
                <div className="text-slate-400 font-sans font-semibold pt-1">Return to Start:</div>
                <div className="text-emerald-400">
                  Optimal Tour = min_{'{'}u &ne; start{'}'} ( dp[(1&lt;&lt;n)-1][u] + dist[u][start] )
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Time Complexity</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">O(n² · 2ⁿ)</div>
                  <div className="text-[10px] text-slate-500">vs O(n!) Brute Force</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Space Complexity</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">O(n · 2ⁿ)</div>
                  <div className="text-[10px] text-slate-500">2ⁿ bitmasks × n vertices</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                <h5 className="font-semibold text-white mb-1.5">Why Logistics Giants Use Approximations for Large n:</h5>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  While Held–Karp is vastly faster than O(n!) brute-force permutation checking, 2ⁿ grows exponentially. 
                  For n = 5 stops: 2⁵ = 32 states (microseconds). 
                  For n = 20 stops: 2²⁰ &approx; 1,048,576 states. 
                  For n = 35 doorstep deliveries: 2³⁵ exceeds 34 billion states, exhausting RAM and CPU time.
                </p>
                <p className="text-slate-400 leading-relaxed text-[11px] mt-2">
                  Consequently, Amazon, Swiggy, and Zomato partition city territories using clustering (e.g. k-means / geospatial geohashes) 
                  into small delivery zones (8-12 stops) before applying exact DP, or use metaheuristics (Ant Colony, Lin-Kernighan, OR-Tools) with live traffic inputs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
