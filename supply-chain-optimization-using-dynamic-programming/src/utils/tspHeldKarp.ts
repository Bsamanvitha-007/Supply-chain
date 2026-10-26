import { TspLocation, TspResult } from '../types';

export const DEFAULT_TSP_LOCATIONS: TspLocation[] = [
  { id: 0, name: 'Central Warehouse (Bhiwandi)', code: 'WH-0', type: 'central', x: 250, y: 190 },
  { id: 1, name: 'Customer A (Powai)', code: 'CUST-A', type: 'customer', x: 100, y: 90 },
  { id: 2, name: 'Customer B (Bandra)', code: 'CUST-B', type: 'customer', x: 420, y: 70 },
  { id: 3, name: 'Customer C (Andheri)', code: 'CUST-C', type: 'customer', x: 440, y: 310 },
  { id: 4, name: 'Customer D (Vashi)', code: 'CUST-D', type: 'customer', x: 90, y: 300 },
];

export const DEFAULT_TSP_DISTANCES: number[][] = [
  [0, 10, 15, 20, 12],
  [10, 0, 35, 25, 17],
  [15, 35, 0, 30, 28],
  [20, 25, 30, 0, 16],
  [12, 17, 28, 16, 0],
];

/**
 * Validates a distance matrix for TSP:
 * - Square (n x n)
 * - Symmetric (dist[i][j] == dist[j][i])
 * - Non-negative
 * - Zeros on the diagonal
 */
export function validateDistanceMatrix(matrix: number[][]): { valid: boolean; error?: string } {
  const n = matrix.length;
  if (n < 3) return { valid: false, error: 'TSP requires at least 3 locations.' };
  if (n > 8) return { valid: false, error: 'Matrix size too large for interactive demonstration (max 8).' };

  for (let i = 0; i < n; i++) {
    if (!Array.isArray(matrix[i]) || matrix[i].length !== n) {
      return { valid: false, error: `Row ${i} must have exactly ${n} values.` };
    }
    for (let j = 0; j < n; j++) {
      const val = matrix[i][j];
      if (typeof val !== 'number' || isNaN(val) || val < 0) {
        return { valid: false, error: `Distance [${i}][${j}] must be a non-negative number.` };
      }
      if (i === j && val !== 0) {
        return { valid: false, error: `Diagonal entry [${i}][${j}] must be 0.` };
      }
      if (Math.abs(matrix[i][j] - matrix[j][i]) > 0.001) {
        return { valid: false, error: `Matrix is asymmetric at [${i}][${j}] (${matrix[i][j]} != ${matrix[j][i]}).` };
      }
    }
  }
  return { valid: true };
}

/**
 * Solves Traveling Salesperson Problem (TSP) using Held-Karp Dynamic Programming with Bitmasking.
 *
 * Recurrence:
 * dp[mask][i] = min_{j in mask, j != i} ( dp[mask \ {i}][j] + dist[j][i] )
 *
 * Time Complexity: O(n^2 * 2^n)
 * Space Complexity: O(n * 2^n)
 */
export function solveTspHeldKarp(
  locations: TspLocation[] = DEFAULT_TSP_LOCATIONS,
  distMatrix: number[][] = DEFAULT_TSP_DISTANCES,
  startIndex: number = 0
): TspResult {
  const n = locations.length;
  const numStates = 1 << n;
  const s = Math.min(Math.max(0, startIndex), n - 1);

  // dp[mask][u] = min cost to visit all nodes in 'mask', ending at 'u'
  const dp: number[][] = Array.from({ length: numStates }, () => Array(n).fill(Infinity));
  // parent[mask][u] = previous node v in optimal path
  const parent: number[][] = Array.from({ length: numStates }, () => Array(n).fill(-1));

  // Base Case: starting at s with mask (1 << s)
  dp[1 << s][s] = 0;

  // Track sample states for state inspection
  const sampleStates: TspResult['dpTableSummary'] = [];
  let statesComputed = 0;

  // Iterate over all subset sizes from 2 to n
  for (let mask = 0; mask < numStates; mask++) {
    // Only consider masks that include start vertex s
    if ((mask & (1 << s)) === 0) continue;

    for (let u = 0; u < n; u++) {
      if ((mask & (1 << u)) === 0) continue;
      if (dp[mask][u] === Infinity) continue;

      // Try extending path to next node v
      for (let v = 0; v < n; v++) {
        if ((mask & (1 << v)) !== 0) continue; // v is not yet visited
        const nextMask = mask | (1 << v);
        const newCost = dp[mask][u] + distMatrix[u][v];

        if (newCost < dp[nextMask][v]) {
          dp[nextMask][v] = newCost;
          parent[nextMask][v] = u;
          statesComputed++;
        }
      }
    }
  }

  // Full mask visiting all vertices
  const fullMask = (1 << n) - 1;
  let minCost = Infinity;
  let lastNode = -1;

  for (let u = 0; u < n; u++) {
    if (u === s) continue;
    const returnCost = dp[fullMask][u] + distMatrix[u][s];
    if (returnCost < minCost) {
      minCost = returnCost;
      lastNode = u;
    }
  }

  // Reconstruct optimal tour
  const tour: number[] = [];
  let currMask = fullMask;
  let currNode = lastNode;

  while (currNode !== -1 && currNode !== s) {
    tour.push(currNode);
    const prevNode = parent[currMask][currNode];
    currMask = currMask ^ (1 << currNode);
    currNode = prevNode;
  }
  tour.push(s);
  tour.reverse();
  tour.push(s); // complete the cycle back to start

  const tourNames = tour.map(idx => locations[idx].name);

  // Baseline comparison: Natural Sequential Order (s -> s+1 -> ... -> s)
  const baselineTour: number[] = [];
  for (let i = 0; i < n; i++) {
    baselineTour.push((s + i) % n);
  }
  baselineTour.push(s);

  let baselineDistance = 0;
  for (let i = 0; i < baselineTour.length - 1; i++) {
    baselineDistance += distMatrix[baselineTour[i]][baselineTour[i + 1]];
  }

  // Sample informative DP states for the pedagogical breakdown
  const intermediateMasks = [
    (1 << s) | (1 << ((s + 1) % n)),
    (1 << s) | (1 << ((s + 1) % n)) | (1 << ((s + 2) % n)),
    fullMask,
  ];

  for (const m of intermediateMasks) {
    for (let u = 0; u < n; u++) {
      if ((m & (1 << u)) !== 0 && dp[m][u] !== Infinity && dp[m][u] > 0) {
        const visitedNames = locations
          .filter((_, idx) => (m & (1 << idx)) !== 0)
          .map(loc => loc.code);
        sampleStates.push({
          mask: m,
          maskBinary: m.toString(2).padStart(n, '0'),
          visitedNames,
          lastNode: locations[u].code,
          cost: dp[m][u],
        });
      }
    }
  }

  return {
    tour,
    tourNames,
    totalDistance: minCost,
    baselineTour,
    baselineDistance,
    baselineName: `Sequential Order (${baselineTour.map(idx => locations[idx].code).join(' → ')})`,
    dpTableSummary: sampleStates.slice(0, 8),
    totalStatesComputed: statesComputed,
  };
}
