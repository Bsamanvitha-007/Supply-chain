import { ObstKey, ObstResult, ObstTreeNode } from '../types';

export const DEFAULT_OBST_KEYS: ObstKey[] = [
  { id: 1, key: '1001', frequency: 10 },
  { id: 2, key: '1002', frequency: 20 },
  { id: 3, key: '1003', frequency: 50 },
  { id: 4, key: '1004', frequency: 15 },
  { id: 5, key: '1005', frequency: 5 },
];

/**
 * Solves the Optimal Binary Search Tree (OBST) problem using Dynamic Programming.
 *
 * Recurrence:
 * Cost[i][j] = min_{r=i..j} (Cost[i][r-1] + Cost[r+1][j] + W[i][j])
 * where W[i][j] = sum of frequencies from key i to key j.
 * Base Case: Cost[i][i-1] = 0
 *
 * Time Complexity: O(n^3)
 * Space Complexity: O(n^2)
 */
export function solveObst(inputKeys: ObstKey[] = DEFAULT_OBST_KEYS): ObstResult {
  // Ensure keys are sorted by key string / identifier
  const keys = [...inputKeys].sort((a, b) => a.key.localeCompare(b.key));
  const n = keys.length;

  // 1-indexed tables for standard academic notation
  // cost[i][j] for 1 <= i <= n+1 and 0 <= j <= n
  const cost: number[][] = Array.from({ length: n + 2 }, () => Array(n + 1).fill(0));
  const root: number[][] = Array.from({ length: n + 2 }, () => Array(n + 1).fill(0));
  const weight: number[][] = Array.from({ length: n + 2 }, () => Array(n + 1).fill(0));

  // Prefix sums for weight table W[i][j]
  for (let i = 1; i <= n; i++) {
    for (let j = i; j <= n; j++) {
      let sum = 0;
      for (let k = i; k <= j; k++) {
        sum += keys[k - 1].frequency;
      }
      weight[i][j] = sum;
    }
  }

  // Base cases: single keys
  for (let i = 1; i <= n; i++) {
    cost[i][i - 1] = 0;
    cost[i][i] = keys[i - 1].frequency;
    root[i][i] = i;
  }
  cost[n + 1][n] = 0;

  // Subtree lengths L from 2 to n
  for (let L = 2; L <= n; L++) {
    for (let i = 1; i <= n - L + 1; i++) {
      const j = i + L - 1;
      cost[i][j] = Number.POSITIVE_INFINITY;

      for (let r = i; r <= j; r++) {
        const c = cost[i][r - 1] + cost[r + 1][j] + weight[i][j];
        if (c < cost[i][j]) {
          cost[i][j] = c;
          root[i][j] = r;
        }
      }
    }
  }

  // Helper to reconstruct Optimal Tree from Root Table
  function constructOptimalTree(i: number, j: number, depth: number): ObstTreeNode | null {
    if (i > j) return null;
    const r = root[i][j];
    if (r === 0) return null;

    const node: ObstTreeNode = {
      key: keys[r - 1].key,
      freq: keys[r - 1].frequency,
      depth,
      left: constructOptimalTree(i, r - 1, depth + 1) || undefined,
      right: constructOptimalTree(r + 1, j, depth + 1) || undefined,
    };
    return node;
  }

  // Helper to construct a standard Balanced BST baseline (choosing middle key as root)
  function constructBalancedTree(low: number, high: number, depth: number): ObstTreeNode | null {
    if (low > high) return null;
    const mid = Math.floor((low + high) / 2);
    const node: ObstTreeNode = {
      key: keys[mid].key,
      freq: keys[mid].frequency,
      depth,
      left: constructBalancedTree(low, mid - 1, depth + 1) || undefined,
      right: constructBalancedTree(mid + 1, high, depth + 1) || undefined,
    };
    return node;
  }

  const optimalTree = constructOptimalTree(1, n, 1);
  const balancedTree = constructBalancedTree(0, n - 1, 1);

  // Calculate weighted costs: sum of (frequency * depth)
  function calculateTreeWeightedCost(node: ObstTreeNode | null | undefined): number {
    if (!node) return 0;
    return (
      node.freq * node.depth +
      calculateTreeWeightedCost(node.left) +
      calculateTreeWeightedCost(node.right)
    );
  }

  const totalFrequency = keys.reduce((acc, k) => acc + k.frequency, 0);
  const optimalWeightedCost = cost[1][n];
  const balancedWeightedCost = calculateTreeWeightedCost(balancedTree);

  const optimalAvgCost = totalFrequency > 0 ? Number((optimalWeightedCost / totalFrequency).toFixed(2)) : 0;
  const balancedAvgCost = totalFrequency > 0 ? Number((balancedWeightedCost / totalFrequency).toFixed(2)) : 0;

  return {
    keys,
    costTable: cost,
    rootTable: root,
    weightTable: weight,
    optimalTree,
    balancedTree,
    optimalWeightedCost,
    balancedWeightedCost,
    optimalAvgCost,
    balancedAvgCost,
    totalFrequency,
  };
}
