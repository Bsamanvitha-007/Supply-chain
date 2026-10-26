import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  Plus, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  DollarSign, 
  Weight, 
  Percent, 
  ChevronRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { KnapsackItem, KnapsackResult } from '../types';
import { solve01Knapsack } from '../utils/knapsack';

const DEFAULT_ITEMS: KnapsackItem[] = [
  { id: '1', name: 'Package A (Electronics)', weight: 2, value: 30 },
  { id: '2', name: 'Package B (Apparel Bundle)', weight: 3, value: 40 },
  { id: '3', name: 'Package C (Home Appliance)', weight: 4, value: 50 },
  { id: '4', name: 'Package D (Cookware Set)', weight: 5, value: 60 },
];

const DEFAULT_CAPACITY = 8;

interface KnapsackSectionProps {
  onResultChange?: (result: KnapsackResult) => void;
}

export const KnapsackSection: React.FC<KnapsackSectionProps> = ({ onResultChange }) => {
  const [items, setItems] = useState<KnapsackItem[]>(DEFAULT_ITEMS);
  const [capacity, setCapacity] = useState<number>(DEFAULT_CAPACITY);
  const [result, setResult] = useState<KnapsackResult>(() => solve01Knapsack(DEFAULT_ITEMS, DEFAULT_CAPACITY));
  const [selectedCell, setSelectedCell] = useState<{ i: number; w: number } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync to parent dashboard on initial render
  useEffect(() => {
    onResultChange?.(result);
  }, []);

  const handleRunOptimization = () => {
    if (items.length === 0) {
      setValidationError('Please keep at least one package item.');
      return;
    }
    if (capacity <= 0 || capacity > 50) {
      setValidationError('Truck capacity must be between 1 and 50 kg for visual demonstration.');
      return;
    }
    setValidationError(null);
    const newResult = solve01Knapsack(items, capacity);
    setResult(newResult);
    onResultChange?.(newResult);
  };

  const handleReset = () => {
    setItems(DEFAULT_ITEMS);
    setCapacity(DEFAULT_CAPACITY);
    setValidationError(null);
    setSelectedCell(null);
    const defaultRes = solve01Knapsack(DEFAULT_ITEMS, DEFAULT_CAPACITY);
    setResult(defaultRes);
    onResultChange?.(defaultRes);
  };

  const handleItemChange = (index: number, field: 'name' | 'weight' | 'value', val: any) => {
    const updated = [...items];
    if (field === 'weight') {
      const num = Math.max(1, parseInt(val) || 1);
      updated[index].weight = num;
    } else if (field === 'value') {
      const num = Math.max(1, parseInt(val) || 1);
      updated[index].value = num;
    } else {
      updated[index].name = val;
    }
    setItems(updated);
  };

  const handleAddItem = () => {
    if (items.length >= 8) {
      setValidationError('Maximum 8 items allowed for clear DP table inspection.');
      return;
    }
    const nextLetter = String.fromCharCode(65 + items.length);
    const newItem: KnapsackItem = {
      id: Date.now().toString(),
      name: `Package ${nextLetter}`,
      weight: 3,
      value: 35,
    };
    const updated = [...items, newItem];
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      setValidationError('At least one package is required.');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Backtracking path cells coordinates in the table for highlighting
  const backtrackCoordinates: Array<{ i: number; w: number }> = [];
  let wTrace = result.capacity;
  for (let i = result.items.length; i >= 1; i--) {
    backtrackCoordinates.push({ i, w: wTrace });
    if (result.dpTable[i][wTrace] !== result.dpTable[i - 1][wTrace]) {
      wTrace -= Math.floor(result.items[i - 1].weight);
    }
  }
  backtrackCoordinates.push({ i: 0, w: 0 });

  return (
    <section id="knapsack" className="py-20 bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
              <Package className="w-3.5 h-3.5" />
              Algorithm 1 : 0/1 Knapsack Problem
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Warehouse Storage and Truck Loading Optimization
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl">
              Fulfillment centers must pack high-priority, high-value packages into delivery feeder trucks without exceeding 
              strict gross vehicular weight limits. 0/1 Knapsack guarantees the mathematically optimal subset of cargo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Sample Data
            </button>
            <button
              onClick={handleRunOptimization}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              Optimize Loading
            </button>
          </div>
        </div>

        {validationError && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/60 border border-rose-700 text-rose-300 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Input Configuration & Visual Inventory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Column 1: Truck Payload Parameters */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Truck Capacity Limits
              </h3>
              <span className="text-xs font-mono text-slate-400">Parameter W</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Maximum Payload Capacity (W in kg):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-semibold">kg</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Default benchmark value: 8 kg</p>
              </div>

              {/* Live Truck Capacity Gauge */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs text-slate-300 mb-2">
                  <span>Current Utilization:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {result.totalWeight} / {result.capacity} kg ({Math.round((result.totalWeight / (result.capacity || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (result.totalWeight / (result.capacity || 1)) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                  <span>0 kg</span>
                  <span>Unused: {result.unusedCapacity} kg</span>
                  <span>{result.capacity} kg Max</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-amber-400">0/1 Constraint:</strong> Each package can either be completely loaded (1) or left behind in sorting (0). Fractional packages are prohibited.
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Package Candidates Editor */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-400" />
                Candidate Packages for Feeder Truck (Items i = 1 to n)
              </h3>
              <button
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 px-2.5 py-1 rounded-md transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Package
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {items.map((item, index) => {
                const isSelected = result.selectedItems.some((sel) => sel.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'bg-amber-950/20 border-amber-500/60 shadow-sm'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] flex items-center justify-center font-mono font-bold">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          className="bg-transparent text-xs font-bold text-white border-b border-transparent hover:border-slate-700 focus:border-amber-400 focus:outline-none w-36 truncate"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isSelected && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded font-semibold">
                            LOADED
                          </span>
                        )}
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-slate-500 hover:text-rose-400 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Weight className="w-3 h-3 text-slate-400" /> Weight (kg)
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={item.weight}
                          onChange={(e) => handleItemChange(index, 'weight', e.target.value)}
                          className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span className="text-amber-400 font-mono">₹</span> Value (₹)
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={item.value}
                          onChange={(e) => handleItemChange(index, 'value', e.target.value)}
                          className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-amber-300 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Total Available Packages: {items.length}</span>
              <span className="text-amber-400 font-mono">Click "Optimize Loading" after editing</span>
            </div>
          </div>
        </div>

        {/* DP Execution Results Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Max Cargo Value</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
              ₹{result.totalValue}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">DP optimal state: DP[{result.items.length}][{result.capacity}]</div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Total Loaded Weight</div>
            <div className="text-2xl font-extrabold text-white mt-1 font-mono">
              {result.totalWeight} <span className="text-sm font-normal text-slate-400">kg</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Out of {result.capacity} kg max capacity</div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Unused Capacity</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
              {result.unusedCapacity} <span className="text-sm font-normal text-slate-400">kg</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Remaining payload margin</div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono uppercase">Baseline Comparison</div>
            <div className="text-2xl font-extrabold text-sky-400 mt-1 font-mono">
              +₹{result.totalValue - result.baselineValue}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Over First-Fit arrival (₹{result.baselineValue})</div>
          </div>
        </div>

        {/* Interactive DP Table Display */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Dynamic Programming Tabulation Table: DP[i][w]
              </h3>
              <p className="text-xs text-slate-400">
                Row i corresponds to considering the first i items; Column w corresponds to truck capacity from 0 to W kg.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500" /> Backtracking Path
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500" /> Optimal Cell
              </span>
            </div>
          </div>

          {/* Scrollable Grid */}
          <div className="overflow-x-auto pb-2">
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono">
                  <th className="p-2 border border-slate-800 text-left">i / Item</th>
                  <th className="p-2 border border-slate-800">wt</th>
                  <th className="p-2 border border-slate-800">val</th>
                  {Array.from({ length: result.capacity + 1 }, (_, w) => (
                    <th key={w} className="p-2 border border-slate-800 font-bold text-sky-400 min-w-[38px]">
                      w={w}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {/* Base row i = 0 */}
                <tr className="bg-slate-950/50">
                  <td className="p-2 border border-slate-800 text-left font-sans text-slate-400">
                    0 (Empty Base)
                  </td>
                  <td className="p-2 border border-slate-800 text-slate-500">-</td>
                  <td className="p-2 border border-slate-800 text-slate-500">-</td>
                  {Array.from({ length: result.capacity + 1 }, (_, w) => (
                    <td
                      key={w}
                      className="p-2 border border-slate-800 text-slate-500"
                    >
                      0
                    </td>
                  ))}
                </tr>

                {/* Items rows i = 1 to n */}
                {result.items.map((item, itemIdx) => {
                  const i = itemIdx + 1;
                  return (
                    <tr key={item.id} className="hover:bg-slate-850 transition">
                      <td className="p-2 border border-slate-800 text-left font-sans text-slate-200">
                        {i}: {item.name}
                      </td>
                      <td className="p-2 border border-slate-800 text-slate-400">{item.weight}kg</td>
                      <td className="p-2 border border-slate-800 text-amber-300">₹{item.value}</td>
                      {Array.from({ length: result.capacity + 1 }, (_, w) => {
                        const val = result.dpTable[i][w];
                        const isOptimal = i === result.items.length && w === result.capacity;
                        const isBacktrack = backtrackCoordinates.some((coord) => coord.i === i && coord.w === w);
                        const isInspected = selectedCell?.i === i && selectedCell?.w === w;

                        let bgClass = 'bg-slate-950/30 text-slate-300';
                        if (isOptimal) {
                          bgClass = 'bg-emerald-500/30 text-emerald-300 font-bold border-2 border-emerald-400';
                        } else if (isBacktrack) {
                          bgClass = 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/60';
                        } else if (isInspected) {
                          bgClass = 'bg-blue-600/30 text-blue-200 font-semibold';
                        }

                        return (
                          <td
                            key={w}
                            onClick={() => setSelectedCell({ i, w })}
                            className={`p-2 border border-slate-800 cursor-pointer transition ${bgClass} hover:bg-blue-600/20`}
                            title={`Click to inspect DP[${i}][${w}] = ₹${val}`}
                          >
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

          {/* Cell Inspection Tooltip / Explanation */}
          {selectedCell && (
            <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-blue-500/40 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-mono text-blue-400 font-bold">
                  Inspecting DP[{selectedCell.i}][{selectedCell.w}] = ₹{result.dpTable[selectedCell.i][selectedCell.w]}
                </span>
                <span className="text-slate-400 ml-2">
                  (Evaluating package "{result.items[selectedCell.i - 1].name}" with weight={result.items[selectedCell.i - 1].weight}kg, value=₹{result.items[selectedCell.i - 1].value})
                </span>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Backtracking & Recurrence Academic Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backtracking Log */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Optimal Package Decision Backtracking Log
            </h4>
            <div className="space-y-2.5">
              {result.backtrackSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs leading-relaxed ${
                    step.decision === 'included'
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>
                      Package {step.itemIndex} ({result.items[step.itemIndex - 1]?.name})
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      step.decision === 'included'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {step.decision.toUpperCase()}
                    </span>
                  </div>
                  <p>{step.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recurrence & Complexity Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400" />
                Mathematical Recurrence & Complexity Analysis
              </h4>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 space-y-2 mb-4">
                <div className="text-slate-400 font-sans font-semibold">State Definition:</div>
                <div className="text-slate-200">
                  DP[i][w] = Maximum cargo value attainable using a subset of first i packages within weight limit w.
                </div>
                <div className="pt-2 text-slate-400 font-sans font-semibold">Recurrence Relation:</div>
                <div className="text-amber-300">
                  DP[i][w] = DP[i-1][w] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if weight[i] &gt; w
                </div>
                <div className="text-emerald-400">
                  DP[i][w] = max( DP[i-1][w], value[i] + DP[i-1][w - weight[i]] ) &nbsp; if weight[i] &le; w
                </div>
                <div className="pt-2 text-slate-400 font-sans font-semibold">Base Case:</div>
                <div className="text-slate-300">
                  DP[0][w] = 0 (0 items = 0 value) &amp; DP[i][0] = 0 (0 capacity = 0 value)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 font-medium">Time Complexity:</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">O(n · W)</div>
                  <div className="text-[10px] text-slate-500 mt-1">Pseudo-polynomial (n items × W capacities)</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 font-medium">Space Complexity:</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">O(n · W)</div>
                  <div className="text-[10px] text-slate-500 mt-1">Can be reduced to O(W) using 1D rolling array</div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200">Operational Note:</strong> Currency valuations (₹) and parcel weights in this simulation reflect standardized benchmarking parameters; enterprise carrier systems determine final line-haul rates via volumetric dimensional pricing.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
