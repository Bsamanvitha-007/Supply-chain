import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Cpu,
  Truck,
  Package,
  Route,
  Search,
  Navigation
} from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  category: string;
  answer: string;
  keyTakeaway: string;
}

export const TechnicalFaqSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // first open by default

  const faqItems: FaqItem[] = [
    {
      id: 1,
      question: 'What is Dynamic Programming, and when is it preferred over Divide-and-Conquer?',
      category: 'Algorithmic Foundations',
      answer: `Dynamic Programming (DP) is a systematic optimization strategy that solves complex decision problems by decomposing them into overlapping subproblems, computing each subproblem once, and caching results in lookup tables (tabulation or memoization).

While Divide-and-Conquer partitions problems into disjoint, independent subproblems (such as Merge Sort or Quick Sort), Dynamic Programming is specifically engineered for problem spaces with overlapping subproblems and optimal substructure. Without DP caching, naive recursive exploration exhibits exponential time complexity O(2ⁿ); DP compresses this state space into polynomial or pseudo-polynomial time.`,
      keyTakeaway: 'DP resolves combinatorial explosion when subproblems overlap and optimal substructure holds across recursive decision paths.',
    },
    {
      id: 2,
      question: 'How do Overlapping Subproblems manifest in high-throughput fulfillment logistics?',
      category: 'Operations Research',
      answer: `A problem possesses overlapping subproblems when independent execution branches repeatedly evaluate identical states.

In warehouse parcel packing: When determining whether to load Package C (4kg) into a feeder truck with 6kg remaining capacity, the remaining state is "maximize value with 2kg residual capacity across candidate items". This exact residual capacity (2kg) recurs across multiple alternative packaging permutations (such as selecting Package A of 2kg or skipping earlier items). Dynamic Programming solves the 2kg subproblem exactly once and stores it in DP[i][2], ensuring instant O(1) state recall.`,
      keyTakeaway: 'State caching eliminates redundant computation across exponential permutations in discrete packaging.',
    },
    {
      id: 3,
      question: 'What constitutes Optimal Substructure in multi-echelon freight transportation?',
      category: 'Network Routing',
      answer: `A system exhibits optimal substructure when an optimal solution to the global problem is formed from optimal solutions to its constituent subproblems.

In regional inter-hub logistics: If the minimum-distance transit route from Bhiwandi Central Warehouse to Panvel Hub passes through Thane and Navi Mumbai (A → B → D → E), the sub-path from Thane (B) to Navi Mumbai (D) must itself be the absolute shortest possible route between B and D. If any shorter route between B and D existed, inserting it would reduce the global travel distance, violating the premise of optimality.`,
      keyTakeaway: 'Optimal substructure ensures locally optimal sub-path decisions assemble into globally minimal transit corridors.',
    },
    {
      id: 4,
      question: 'Why is Floyd–Warshall ideal for all-pairs routing compared to repeated Dijkstra executions?',
      category: 'Graph Architecture',
      answer: `Floyd–Warshall computes the complete all-pairs shortest path matrix in O(V³) time and O(V²) space via iterative matrix relaxation: D[i][j] = min(D[i][j], D[i][k] + D[k][j]).

Key Architectural Advantages:
1. Dense Network Efficiency: In interconnected fulfillment grids where edge density E ≈ V², running Dijkstra V times with priority queues takes O(V · E log V) ≈ O(V³ log V), requiring higher algorithmic overhead than Floyd–Warshall's tight O(V³) loops.
2. In-Place Matrix Representation: Floyd–Warshall operates directly on a 2D distance matrix with excellent memory locality and cache prefetching.
3. Precomputed Dispatch Lookups: Real-time dispatchers can perform O(1) instantaneous origin-to-destination distance queries from the cached matrix without dynamic graph traversal at checkout.`,
      keyTakeaway: 'Floyd–Warshall delivers predictable O(V³) all-pairs matrix precomputation with zero heap allocation overhead.',
    },
    {
      id: 5,
      question: 'Why is Held–Karp TSP exponential O(N²·2ᴺ) while 0/1 Knapsack is O(n·W)?',
      category: 'Complexity Analysis',
      answer: `The Traveling Salesperson Problem is NP-Hard. In last-mile delivery, state definition requires both the current vehicle location and the complete historical set of visited customer addresses to ensure zero missed or duplicated visits.

There are 2ᴺ subsets for N addresses. For each subset bitmask and ending node u, Held–Karp computes:
dp[mask][u] = min (dp[mask \\ {u}][v] + dist[v][u]).
This yields N · 2ᴺ distinct states, requiring O(N² · 2ᴺ) operations.

In contrast, 0/1 Knapsack state depends solely on item index i and scalar residual weight w (0 ≤ w ≤ W). The state space is bounded by n · W, making it pseudo-polynomial.`,
      keyTakeaway: 'TSP state requires tracking exponential power-set subsets (2ᴺ); Knapsack state depends only on scalar payload capacity W.',
    },
    {
      id: 6,
      question: 'How does an Optimal Binary Search Tree (OBST) accelerate high-velocity catalog queries?',
      category: 'Database Optimization',
      answer: `Standard balanced binary search trees (such as AVL or Red-Black trees) minimize maximum tree height assuming uniform query probability across all keys (1/n).

In enterprise e-commerce databases, catalog traffic follows a steep Pareto distribution: top 5% bestselling promotional SKUs account for over 80% of real-time search queries. 
An Optimal BST applies interval dynamic programming:
Cost[i][j] = min over r of (Cost[i][r-1] + Cost[r+1][j] + W[i][j])
to place high-velocity SKUs at shallow depths (depth 1 or 2). This directly minimizes the weighted expected comparison cost (∑ freq · depth / ∑ freq), reducing CPU cache misses and database I/O latency.`,
      keyTakeaway: 'OBST aligns binary search tree topology with empirical query velocity to minimize average lookup latency.',
    },
    {
      id: 7,
      question: 'What are the architectural trade-offs between Memoization and Tabulation in production systems?',
      category: 'Engineering Patterns',
      answer: `Both paradigms enforce Dynamic Programming principles with distinct runtime profiles:

1. Bottom-Up Tabulation:
   - Iteratively populates matrices in strict topological order from base cases to final optimal state.
   - Zero recursion stack memory overhead; immune to call-stack overflow on deep inputs.
   - Excellent CPU data-cache locality due to contiguous array memory layouts.
   - Production standard in supply chain dispatch engines.

2. Top-Down Memoization:
   - Evaluates subproblems on demand via recursion, caching computed states in hash tables or sparse arrays.
   - Computes only reachable states; advantageous when vast portions of the theoretical state matrix are never queried.
   - Incurs function call frame overhead and heap lookups.`,
      keyTakeaway: 'Tabulation provides predictable memory allocation and cache locality; Memoization evaluates sparse reachable state spaces.',
    },
    {
      id: 8,
      question: 'How do modern logistics platforms handle large-scale last-mile routing beyond exact DP limits?',
      category: 'Production Scaling',
      answer: `While Held–Karp guarantees exact mathematical optimality, 2ᴺ grows rapidly: for N = 35 doorstep deliveries, 2³⁵ exceeds 34 billion states, exceeding memory and execution limits.

Production Enterprise Architecture (Amazon Logistics & Flipkart Ekart):
1. Geographic Clustering: Territory partitioning algorithms (Geohashes, K-Means, or Voronoi cells) divide delivery zones into manageable micro-clusters of 10 to 14 parcels.
2. Local Exact Optimization: Held–Karp or branch-and-cut solvers optimize each local micro-cluster with mathematical precision.
3. Metaheuristic & Real-Time Ensembles: High-level interconnects use Guided Local Search, Lin–Kernighan heuristics, and real-time live traffic overlays to dynamically re-sequence routes during congestion or driver deviations.`,
      keyTakeaway: 'Enterprise logistics combines exact DP on localized micro-clusters with metaheuristics for city-wide routing.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-2">
            <Cpu className="w-3.5 h-3.5" />
            Engineering Knowledge Base &bull; Technical Deep Dive
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            System Architecture &amp; Technical FAQ
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            In-depth architectural analysis, complexity proofs, and implementation rationale for Dynamic Programming 
            algorithms deployed across modern e-commerce fulfillment infrastructures.
          </p>
        </div>

        {/* 4 Core Algorithmic Takeaways */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-2">
                <Package className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">0/1 Knapsack Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discrete parcel packing solved in pseudo-polynomial O(n·W) time by memoizing residual capacity states, eliminating greedy payload suboptimality.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-amber-400">
              State: DP[i][w]
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-2">
                <Route className="w-4 h-4 text-indigo-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Floyd–Warshall Router</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computes all-pairs shortest transit corridors in O(V³) by systematically pivoting through intermediate hub nodes, precomputing static routing matrices.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-indigo-400">
              State: D^(k)[i][j]
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-2">
                <Search className="w-4 h-4 text-sky-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Optimal BST Indexer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Minimizes weighted SKU lookup depth in O(n³) by aligning tree topology with empirical query velocity rather than raw key balance.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-sky-400">
              State: Cost[i][j]
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Held–Karp Tour Solver</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Encodes visited stop subsets as bitmasks to solve the NP-hard delivery cycle in O(N²·2ᴺ) time, outperforming O(N!) brute-force permutation search.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400">
              State: dp[mask][i]
            </div>
          </div>
        </div>

        {/* Expandable Technical Questions Accordion */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Technical Architecture &amp; Algorithmic FAQ
            </h3>
            <span className="text-xs text-slate-400 font-mono">8 Technical Topics</span>
          </div>

          <div className="space-y-3">
            {faqItems.map((q, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-slate-950 border-blue-500/50 shadow-md'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-blue-400 text-xs flex items-center justify-center font-mono font-bold shrink-0">
                        {q.id}
                      </span>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 mr-2">
                          {q.category}
                        </span>
                        <h4 className="text-sm font-bold text-white inline">{q.question}</h4>
                      </div>
                    </div>
                    <span className="text-slate-400 shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-800/80">
                      <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed mb-4">
                        {q.answer}
                      </div>
                      <div className="p-3 bg-blue-950/40 rounded-lg border border-blue-800/50 text-[11px] text-blue-200 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Engineering Rationale:</strong> {q.keyTakeaway}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
