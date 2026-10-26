import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RotateCcw, 
  Database, 
  TrendingUp, 
  Info, 
  GitCommit, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { ObstKey, ObstResult, ObstTreeNode } from '../types';
import { DEFAULT_OBST_KEYS, solveObst } from '../utils/obst';

interface ObstSectionProps {
  onResultChange?: (result: ObstResult) => void;
}

export const ObstSection: React.FC<ObstSectionProps> = ({ onResultChange }) => {
  const [keys, setKeys] = useState<ObstKey[]>(DEFAULT_OBST_KEYS);
  const [result, setResult] = useState<ObstResult>(() => solveObst(DEFAULT_OBST_KEYS));
  const [activeTab, setActiveTab] = useState<'cost' | 'root'>('cost');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initial sync with parent dashboard
  useEffect(() => {
    onResultChange?.(result);
  }, []);

  const handleFrequencyChange = (index: number, val: string) => {
    const num = Math.max(1, parseInt(val) || 1);
    const updated = [...keys];
    updated[index].frequency = num;
    setKeys(updated);
  };

  const handleRunOptimization = () => {
    for (const k of keys) {
      if (k.frequency <= 0) {
        setValidationError('All search frequencies must be positive numbers (&ge; 1).');
        return;
      }
    }
    setValidationError(null);
    const newResult = solveObst(keys);
    setResult(newResult);
    onResultChange?.(newResult);
  };

  const handleReset = () => {
    setKeys(DEFAULT_OBST_KEYS);
    setValidationError(null);
    const defaultRes = solveObst(DEFAULT_OBST_KEYS);
    setResult(defaultRes);
    onResultChange?.(defaultRes);
  };

  // Helper to render tree nodes recursively with SVG coordinates
  const renderTreeSVG = (rootNode: ObstTreeNode | null) => {
    if (!rootNode) return null;

    // Compute coordinate positions for nodes
    interface VisualNode {
      key: string;
      freq: number;
      depth: number;
      x: number;
      y: number;
      left?: VisualNode;
      right?: VisualNode;
    }

    const mapNode = (
      node: ObstTreeNode | undefined,
      x: number,
      y: number,
      spread: number
    ): VisualNode | undefined => {
      if (!node) return undefined;
      return {
        key: node.key,
        freq: node.freq,
        depth: node.depth,
        x,
        y,
        left: mapNode(node.left, x - spread, y + 65, spread * 0.52),
        right: mapNode(node.right, x + spread, y + 65, spread * 0.52),
      };
    };

    const visualTree = mapNode(rootNode, 280, 45, 120);

    const lines: React.ReactElement[] = [];
    const nodeElements: React.ReactElement[] = [];

    const traverse = (n: VisualNode | undefined) => {
      if (!n) return;
      if (n.left) {
        lines.push(
          <line
            key={`line-${n.key}-${n.left.key}`}
            x1={n.x}
            y1={n.y}
            x2={n.left.x}
            y2={n.left.y}
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        );
        traverse(n.left);
      }
      if (n.right) {
        lines.push(
          <line
            key={`line-${n.key}-${n.right.key}`}
            x1={n.x}
            y1={n.y}
            x2={n.right.x}
            y2={n.right.y}
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        );
        traverse(n.right);
      }

      nodeElements.push(
        <g key={`node-${n.key}`}>
          <circle
            cx={n.x}
            cy={n.y}
            r="22"
            fill="#0F172A"
            stroke={n.depth === 1 ? '#F59E0B' : '#38BDF8'}
            strokeWidth={n.depth === 1 ? '3' : '2'}
          />
          <text
            x={n.x}
            y={n.y - 2}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {n.key}
          </text>
          <text
            x={n.x}
            y={n.y + 11}
            textAnchor="middle"
            fill="#38BDF8"
            fontSize="9"
            fontWeight="semibold"
            fontFamily="sans-serif"
          >
            f={n.freq}
          </text>
          <rect
            x={n.x + 12}
            y={n.y - 22}
            width="22"
            height="14"
            rx="3"
            fill="#1E293B"
            stroke="#475569"
            strokeWidth="0.5"
          />
          <text
            x={n.x + 23}
            y={n.y - 12}
            textAnchor="middle"
            fill="#FBBF24"
            fontSize="8"
            fontWeight="bold"
            fontFamily="monospace"
          >
            d={n.depth}
          </text>
        </g>
      );
    };

    traverse(visualTree);

    return (
      <svg viewBox="0 0 560 260" className="w-full h-auto">
        {lines}
        {nodeElements}
      </svg>
    );
  };

  const n = keys.length;

  return (
    <section id="obst" className="py-20 bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 mb-2">
              <Search className="w-3.5 h-3.5" />
              Algorithm 3 : Optimal Binary Search Trees (OBST)
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Optimizing Inventory Database Search
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl">
              In e-commerce databases, product lookups are non-uniform: bestselling items receive orders thousands of times 
              per second. OBST constructs a search tree that minimizes expected key comparison cost by positioning high-frequency keys near the root.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Frequencies
            </button>
            <button
              onClick={handleRunOptimization}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <Database className="w-4 h-4" />
              Optimize Search Tree
            </button>
          </div>
        </div>

        {validationError && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/60 border border-rose-700 text-rose-300 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Frequencies Config Cards */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-400" />
              Inventory SKU Product IDs &amp; Successful-Search Access Frequencies
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Access Velocity: {result.totalFrequency} queries/sec
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {keys.map((k, idx) => {
              const pct = Math.round((k.frequency / (result.totalFrequency || 1)) * 100);
              return (
                <div key={k.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-sky-300">SKU #{k.key}</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                      {pct}%
                    </span>
                  </div>
                  <label className="block text-[10px] text-slate-500 mb-1">Search Frequency:</label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={k.frequency}
                    onChange={(e) => handleFrequencyChange(idx, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm text-white font-mono focus:border-sky-400 focus:outline-none"
                  />
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-sky-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex justify-between">
            <span>Notice: SKU #1003 has 50% query share (high-velocity festive bestseller).</span>
            <span className="text-sky-400 font-mono">Click "Optimize Search Tree" after adjustments</span>
          </div>
        </div>

        {/* Performance Metrics: DP Optimal vs Balanced BST Baseline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Optimal Weighted Cost</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
              {result.optimalWeightedCost}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">∑ (frequency × depth) with root at depth 1</div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Optimal Avg Search Depth</div>
            <div className="text-2xl font-extrabold text-sky-400 mt-1 font-mono">
              {result.optimalAvgCost} <span className="text-xs text-slate-400 font-normal">comps</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Average comparisons per catalog search</div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Balanced BST Baseline Cost</div>
            <div className="text-2xl font-extrabold text-slate-300 mt-1 font-mono">
              {result.balancedWeightedCost}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Standard height-balanced tree (root = 1003)</div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Optimization Efficiency</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
              {result.balancedWeightedCost > result.optimalWeightedCost
                ? `-${result.balancedWeightedCost - result.optimalWeightedCost} cost`
                : 'Optimal matches baseline'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Balanced avg depth: {result.balancedAvgCost} comps
            </div>
          </div>
        </div>

        {/* Visual Binary Search Tree & Tabulation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Visual Optimal Tree (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-sky-400" />
                  Optimal Binary Search Tree Architecture
                </h3>
                <span className="text-xs text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Root = SKU #{result.optimalTree?.key}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Nodes indicate <strong>SKU key</strong>, access frequency <strong>f</strong>, and tree level depth <strong>d</strong>.
              </p>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                {renderTreeSVG(result.optimalTree)}
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200">Structural Insight:</strong> The algorithm places the highest-frequency node (or a key balancing heavy left/right frequency sums) at shallower levels, directly minimizing total disk reads during catalog queries.
            </div>
          </div>

          {/* Tabulation Cost & Root Tables (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('cost')}
                    className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      activeTab === 'cost'
                        ? 'bg-sky-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Cost Table C[i][j]
                  </button>
                  <button
                    onClick={() => setActiveTab('root')}
                    className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      activeTab === 'root'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Root Table R[i][j]
                  </button>
                </div>
                <span className="text-xs font-mono text-slate-500">Interval DP</span>
              </div>

              {/* Table Matrix */}
              <div className="overflow-x-auto mb-3">
                <table className="w-full text-center border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400">
                      <th className="p-1.5 border border-slate-800">i \ j</th>
                      {keys.map((_, col) => (
                        <th key={col} className="p-1.5 border border-slate-800 text-sky-400">
                          j={col + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {Array.from({ length: n }, (_, row) => {
                      const i = row + 1;
                      return (
                        <tr key={i} className="hover:bg-slate-850">
                          <td className="p-1.5 border border-slate-800 bg-slate-950 text-sky-400 font-bold">
                            i={i}
                          </td>
                          {Array.from({ length: n }, (_, col) => {
                            const j = col + 1;
                            const isUpper = j >= i;
                            const isOptimalTotal = i === 1 && j === n;

                            const val =
                              activeTab === 'cost'
                                ? isUpper
                                  ? result.costTable[i][j]
                                  : '-'
                                : isUpper
                                ? result.rootTable[i][j]
                                : '-';

                            let bg = 'bg-slate-950 text-slate-300';
                            if (!isUpper) bg = 'bg-slate-950/40 text-slate-700';
                            else if (isOptimalTotal)
                              bg = 'bg-emerald-500/30 text-emerald-300 font-bold border-emerald-400';

                            return (
                              <td key={j} className={`p-1.5 border border-slate-800 ${bg}`}>
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] text-slate-400">
                {activeTab === 'cost' ? (
                  <span>
                    Cell <strong>C[1][{n}] = {result.optimalWeightedCost}</strong> holds the minimum weighted search cost for all {n} keys.
                  </span>
                ) : (
                  <span>
                    Cell <strong>R[1][{n}] = {result.rootTable[1][n]}</strong> signifies that Key #{keys[result.rootTable[1][n] - 1]?.key} is the optimal global tree root.
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>Time: O(n³) | Space: O(n²)</span>
              <span>1-Indexed Interval Tabulation</span>
            </div>
          </div>
        </div>

        {/* Academic Recurrence & Formulation */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400" />
            Mathematical Recurrence &amp; Algorithmic Formulation
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-xs text-slate-300 font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-sky-300">
                <div className="text-slate-400 font-sans font-semibold">OBST Recurrence Relation:</div>
                <div className="text-amber-300">
                  Cost[i][j] = min_{'{'}r=i..j{'}'} ( Cost[i][r-1] + Cost[r+1][j] + W[i][j] )
                </div>
                <div className="text-slate-400 pt-1 text-[11px]">
                  Where W[i][j] = &sum;_{'{'}k=i{'}'}^j p_k (sum of key frequencies from i to j).
                </div>
                <div className="text-slate-400 font-sans font-semibold pt-1">Base Case:</div>
                <div className="text-emerald-400">
                  Cost[i][i-1] = 0 (empty subtrees have 0 cost)
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">
                When a key <strong>r</strong> is selected as root for interval [i..j], all nodes in the left subtree [i..r-1] 
                and right subtree [r+1..j] descend one level deeper. Each node’s depth increases by 1, contributing exactly 
                &sum; p_k = W[i][j] to the total search cost.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-sky-400">Algorithmic Note:</strong> While Knuth’s monotonicity property can optimize OBST to O(n²), the fundamental O(n³) interval dynamic programming solver demonstrated above provides explicit subproblem inspection across all candidate intervals.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
