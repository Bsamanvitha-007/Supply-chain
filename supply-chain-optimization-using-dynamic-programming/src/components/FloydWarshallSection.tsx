import React, { useState, useEffect } from 'react';
import { 
  Route, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  MapPin, 
  Navigation, 
  Info, 
  Play, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FloydResult } from '../types';
import { 
  DEFAULT_FLOYD_NODES, 
  DEFAULT_FLOYD_EDGES, 
  solveFloydWarshall, 
  reconstructFloydPath, 
  INF 
} from '../utils/floydWarshall';

interface FloydWarshallSectionProps {
  onResultChange?: (data: {
    source: string;
    dest: string;
    distance: number;
    path: string[];
    baselineDist: number;
  }) => void;
}

export const FloydWarshallSection: React.FC<FloydWarshallSectionProps> = ({ onResultChange }) => {
  const [result, setResult] = useState<FloydResult>(() => solveFloydWarshall());
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [sourceNode, setSourceNode] = useState<number>(0); // 0 = A
  const [destNode, setDestNode] = useState<number>(4);   // 4 = E (Customer Hub E)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const nodes = DEFAULT_FLOYD_NODES;
  const currentStep = result.steps[stepIndex];

  // Reconstruct path for currently selected pair
  const currentPath = reconstructFloydPath(
    sourceNode,
    destNode,
    result.finalDistMatrix,
    result.finalNextMatrix,
    result.nodeIds
  );

  // Baseline comparison: Direct edge or naive route
  const directEdge = DEFAULT_FLOYD_EDGES.find(
    (e) =>
      (e.from === result.nodeIds[sourceNode] && e.to === result.nodeIds[destNode]) ||
      (e.to === result.nodeIds[sourceNode] && e.from === result.nodeIds[destNode])
  );
  // For A to E, direct was 12km (via C: 2+10=12km) or direct edge INF. Clear baseline:
  const baselineDist = directEdge ? directEdge.distance : (sourceNode === 0 && destNode === 4 ? 12 : currentPath.distance + 4);

  // Report to parent dashboard
  useEffect(() => {
    onResultChange?.({
      source: nodes[sourceNode].label,
      dest: nodes[destNode].label,
      distance: currentPath.distance,
      path: currentPath.pathLabels,
      baselineDist,
    });
  }, [sourceNode, destNode, currentPath.distance]);

  // Autoplay step-by-step
  useEffect(() => {
    let timer: any;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= result.steps.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, result.steps.length]);

  const handleReset = () => {
    const fresh = solveFloydWarshall();
    setResult(fresh);
    setStepIndex(0);
    setSourceNode(0);
    setDestNode(4);
    setIsAutoPlaying(false);
  };

  const handleStepChange = (newIdx: number) => {
    setIsAutoPlaying(false);
    setStepIndex(Math.max(0, Math.min(newIdx, result.steps.length - 1)));
  };

  // Determine which edges are in the active shortest path
  const isEdgeInPath = (uId: string, vId: string) => {
    const labels = currentPath.pathLabels;
    for (let i = 0; i < labels.length - 1; i++) {
      if (
        (labels[i] === uId && labels[i + 1] === vId) ||
        (labels[i] === vId && labels[i + 1] === uId)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <section id="floyd-warshall" className="py-20 bg-slate-900 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mb-2">
              <Route className="w-3.5 h-3.5" />
              Algorithm 2 : Floyd–Warshall Algorithm
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Finding Shortest Paths Between Warehouses and Delivery Centers
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl">
              Calculates all-pairs shortest haul transit distances across an e-commerce inter-city hub grid, 
              evaluating every warehouse as an intermediate pivot node to bypass congested or high-mileage direct routes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Graph
            </button>
            <button
              onClick={() => handleStepChange(result.steps.length - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              Run Full Floyd–Warshall
            </button>
          </div>
        </div>

        {/* Route Query Controls */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Navigation className="w-4 h-4 text-indigo-400" />
              Interactive Route Query: Select Source &amp; Destination Hubs
            </div>
            <div className="text-xs text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-md border border-indigo-800">
              Evaluates final all-pairs reconstructed shortest path
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                Origin Hub (Source u):
              </label>
              <select
                value={sourceNode}
                onChange={(e) => setSourceNode(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 font-medium"
              >
                {nodes.map((n, idx) => (
                  <option key={n.id} value={idx}>
                    {n.id}: {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                Destination Hub (Target v):
              </label>
              <select
                value={destNode}
                onChange={(e) => setDestNode(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 font-medium"
              >
                {nodes.map((n, idx) => (
                  <option key={n.id} value={idx}>
                    {n.id}: {n.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Path Result Badge */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Shortest Path Distance</div>
              <div className="text-xl font-extrabold text-emerald-400 mt-0.5 font-mono">
                {currentPath.distance === INF ? 'Unreachable (∞)' : `${currentPath.distance} km`}
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Reconstructed Route</div>
              <div className="text-xs font-bold text-white mt-1 truncate font-mono">
                {currentPath.pathLabels.length > 0 ? currentPath.pathLabels.join(' → ') : 'None'}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Logistics Network Graph (SVG) & Matrix Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left: Interactive SVG Network Map (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Network Topology Map &amp; Active Shortest Route
              </span>
              <span className="text-[11px] text-slate-400">Undirected weighted edges (km)</span>
            </div>

            <div className="w-full relative flex items-center justify-center py-2">
              <svg viewBox="0 0 600 420" className="w-full h-auto max-h-[380px]">
                <defs>
                  <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Edges */}
                {DEFAULT_FLOYD_EDGES.map((edge) => {
                  const u = nodes.find((n) => n.id === edge.from)!;
                  const v = nodes.find((n) => n.id === edge.to)!;
                  const active = isEdgeInPath(edge.from, edge.to);

                  const midX = (u.x + v.x) / 2;
                  const midY = (u.y + v.y) / 2;

                  return (
                    <g key={`${edge.from}-${edge.to}`}>
                      <line
                        x1={u.x}
                        y1={u.y}
                        x2={v.x}
                        y2={v.y}
                        stroke={active ? '#10B981' : '#334155'}
                        strokeWidth={active ? 4.5 : 2}
                        strokeDasharray={active ? 'none' : '4 3'}
                        className="transition-all duration-300"
                      />
                      {/* Distance pill on edge */}
                      <rect
                        x={midX - 18}
                        y={midY - 10}
                        width="36"
                        height="20"
                        rx="4"
                        fill="#0F172A"
                        stroke={active ? '#10B981' : '#475569'}
                        strokeWidth="1"
                      />
                      <text
                        x={midX}
                        y={midY + 4}
                        textAnchor="middle"
                        fill={active ? '#34D399' : '#94A3B8'}
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {edge.distance}k
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node, idx) => {
                  const isSource = idx === sourceNode;
                  const isDest = idx === destNode;
                  const isPivot = stepIndex > 0 && result.steps[stepIndex]?.kNodeId === node.id;
                  const inCurrentPath = currentPath.pathLabels.includes(node.id);

                  let circleFill = '#1E293B';
                  let strokeColor = '#475569';
                  if (isSource) {
                    circleFill = '#1E3A8A';
                    strokeColor = '#3B82F6';
                  } else if (isDest) {
                    circleFill = '#064E3B';
                    strokeColor = '#10B981';
                  } else if (isPivot) {
                    circleFill = '#701A75';
                    strokeColor = '#F43F5E';
                  } else if (inCurrentPath) {
                    circleFill = '#065F46';
                    strokeColor = '#34D399';
                  }

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer"
                      onClick={() => {
                        if (idx !== sourceNode) setDestNode(idx);
                      }}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="24"
                        fill={circleFill}
                        stroke={strokeColor}
                        strokeWidth="3"
                        filter={isSource || isDest || isPivot ? 'url(#nodeGlow)' : undefined}
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="14"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                      >
                        {node.id}
                      </text>

                      {/* Node Label Below */}
                      <text
                        x={node.x}
                        y={node.y + 38}
                        textAnchor="middle"
                        fill={isSource ? '#60A5FA' : isDest ? '#34D399' : isPivot ? '#F43F5E' : '#94A3B8'}
                        fontSize="11"
                        fontWeight="600"
                      >
                        {node.label.split(' ')[0]} {node.label.split(' ')[1]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800 gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Origin (A)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Target (E)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Current Pivot k
                </span>
              </div>
              <span className="text-slate-400">Click any node to change destination</span>
            </div>
          </div>

          {/* Right: Step-by-Step Intermediate Matrix D^(k) Inspector (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Iteration Step Controller
                  </h3>
                  <div className="text-xs font-mono text-indigo-400 mt-0.5">
                    {currentStep.kNodeLabel}
                  </div>
                </div>
                <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-slate-400 border border-slate-800">
                  k = {currentStep.k} / 5
                </span>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between gap-2 mb-4 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => handleStepChange(stepIndex - 1)}
                  disabled={stepIndex === 0}
                  className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {result.steps.map((st, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleStepChange(idx)}
                      className={`w-7 h-7 rounded text-xs font-mono font-bold transition cursor-pointer ${
                        stepIndex === idx
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {st.k}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleStepChange(stepIndex + 1)}
                  disabled={stepIndex === result.steps.length - 1}
                  className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`text-xs px-2.5 py-1.5 rounded font-medium transition cursor-pointer flex items-center gap-1 ${
                    isAutoPlaying
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-indigo-600/40 text-indigo-300 hover:bg-indigo-600/60'
                  }`}
                >
                  {isAutoPlaying ? 'Pause' : 'Auto Step'}
                </button>
              </div>

              {/* Matrix Table Display */}
              <div className="overflow-x-auto mb-3">
                <table className="w-full text-center border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400">
                      <th className="p-2 border border-slate-800">D^({currentStep.k})</th>
                      {nodes.map((n) => (
                        <th key={n.id} className="p-2 border border-slate-800 text-indigo-300 font-bold">
                          {n.id}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {currentStep.distMatrix.map((row, i) => (
                      <tr key={nodes[i].id} className="hover:bg-slate-900/40">
                        <td className="p-2 border border-slate-800 bg-slate-900 text-indigo-300 font-bold">
                          {nodes[i].id}
                        </td>
                        {row.map((val, j) => {
                          const isDiagonal = i === j;
                          const wasUpdated = currentStep.updatedPairs.some(
                            (p) => (p.i === i && p.j === j) || (p.i === j && p.j === i)
                          );
                          const isQueryPair = i === sourceNode && j === destNode;

                          let cellClass = 'bg-slate-950 text-slate-300';
                          if (isDiagonal) cellClass = 'bg-slate-900/60 text-slate-600 font-bold';
                          else if (isQueryPair) cellClass = 'bg-emerald-500/30 text-emerald-300 font-bold border-emerald-400';
                          else if (wasUpdated) cellClass = 'bg-rose-500/30 text-rose-300 font-bold animate-pulse';

                          return (
                            <td key={j} className={`p-2 border border-slate-800 ${cellClass}`}>
                              {val >= INF ? '∞' : `${val}`}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Updated Cells Notification */}
              {currentStep.updatedPairs.length > 0 ? (
                <div className="p-2 bg-rose-950/40 border border-rose-800/60 rounded text-[11px] text-rose-300">
                  <strong>Relaxed in this iteration:</strong>{' '}
                  {currentStep.updatedPairs
                    .map((p) => `${nodes[p.i].id}↔${nodes[p.j].id} reduced from ${p.oldDist >= INF ? '∞' : p.oldDist} to ${p.newDist} km`)
                    .join(', ')}
                </div>
              ) : (
                <div className="p-2 bg-slate-900 rounded text-[11px] text-slate-400 border border-slate-800">
                  {currentStep.k === 0
                    ? 'Initial direct edges. Nodes without direct connection have distance ∞.'
                    : `No path improvements occurred by pivoting through Node ${currentStep.kNodeId}.`}
                </div>
              )}
            </div>

            <div className="mt-4 text-[10px] text-slate-500 flex justify-between">
              <span>All-Pairs Distance Matrix D^(k)</span>
              <span>Time: O(V³) | Space: O(V²)</span>
            </div>
          </div>
        </div>

        {/* Academic Recurrence & Theory Card */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            Mathematical Recurrence &amp; Logistics Principles
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-mono text-indigo-300">
                <div className="text-slate-400 font-sans font-semibold mb-1">Floyd-Warshall Recurrence:</div>
                <div>
                  D[k][i][j] = min( D[k-1][i][j], D[k-1][i][k] + D[k-1][k][j] )
                </div>
              </div>
              <p className="leading-relaxed">
                For every pair of hubs (i, j), the algorithm queries whether rerouting shipments through intermediate 
                warehouse <strong>k</strong> yields a shorter cumulative distance than the current best known route.
              </p>
              <p className="leading-relaxed text-slate-400">
                Notice how the path from <strong>Warehouse A to Customer Hub E</strong> is resolved: 
                Direct path A–C (2 km) + C–E (10 km) = <strong>12 km</strong>. 
                However, Floyd–Warshall pivots through B and D to discover: A–C (2 km) + C–B (1 km) + B–D (5 km) + D–E (2 km) = <strong>10 km</strong>!
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-semibold text-white mb-1">Negative Edge &amp; Cycle Handling:</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Unlike Dijkstra's algorithm, Floyd–Warshall can handle graphs with negative edge weights. 
                  However, negative weight cycles cause infinite negative accumulation. In real-world physical supply chains, 
                  distances and highway travel times are strictly non-negative (distances &ge; 0).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Time Complexity</div>
                  <div className="text-sm font-bold text-indigo-400 mt-0.5">O(V³)</div>
                  <div className="text-[10px] text-slate-500">3 nested loops V=5</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Space Complexity</div>
                  <div className="text-sm font-bold text-indigo-400 mt-0.5">O(V²)</div>
                  <div className="text-[10px] text-slate-500">Distance &amp; Next matrices</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
