import { FloydEdge, FloydNode, FloydResult, FloydStep } from '../types';

export const DEFAULT_FLOYD_NODES: FloydNode[] = [
  { id: 'A', label: 'Warehouse A (Bhiwandi)', type: 'warehouse', x: 120, y: 110 },
  { id: 'B', label: 'Warehouse B (Thane)', type: 'warehouse', x: 380, y: 80 },
  { id: 'C', label: 'Warehouse C (Kurla)', type: 'warehouse', x: 230, y: 220 },
  { id: 'D', label: 'Dist. Center D (Navi Mumbai)', type: 'distribution', x: 500, y: 240 },
  { id: 'E', label: 'Customer Hub E (Panvel)', type: 'hub', x: 350, y: 360 },
];

export const DEFAULT_FLOYD_EDGES: FloydEdge[] = [
  { from: 'A', to: 'B', distance: 4 },
  { from: 'A', to: 'C', distance: 2 },
  { from: 'B', to: 'C', distance: 1 },
  { from: 'B', to: 'D', distance: 5 },
  { from: 'C', to: 'D', distance: 8 },
  { from: 'C', to: 'E', distance: 10 },
  { from: 'D', to: 'E', distance: 2 },
];

export const INF = 999999;

/**
 * Solves Floyd-Warshall All-Pairs Shortest Path algorithm step-by-step.
 *
 * Recurrence:
 * D^[k][i][j] = min( D^[k-1][i][j], D^[k-1][i][k] + D^[k-1][k][j] )
 *
 * Time Complexity: O(V^3)
 * Space Complexity: O(V^2)
 */
export function solveFloydWarshall(
  nodes: FloydNode[] = DEFAULT_FLOYD_NODES,
  edges: FloydEdge[] = DEFAULT_FLOYD_EDGES
): FloydResult {
  const V = nodes.length;
  const nodeIds = nodes.map(n => n.id);
  const nodeLabels = nodes.map(n => n.label);

  // Initialize D^(0) distance matrix and next matrix for path reconstruction
  let dist: number[][] = Array.from({ length: V }, (_, i) =>
    Array.from({ length: V }, (_, j) => (i === j ? 0 : INF))
  );

  let next: number[][] = Array.from({ length: V }, (_, i) =>
    Array.from({ length: V }, (_, j) => (i === j ? i : -1))
  );

  // Populate known undirected edges
  for (const edge of edges) {
    const u = nodeIds.indexOf(edge.from);
    const v = nodeIds.indexOf(edge.to);
    if (u !== -1 && v !== -1) {
      dist[u][v] = edge.distance;
      dist[v][u] = edge.distance;
      next[u][v] = v;
      next[v][u] = u;
    }
  }

  const steps: FloydStep[] = [];

  // Step 0: Initial matrix D^(0)
  steps.push({
    k: 0,
    kNodeId: 'None (Initial Graph)',
    kNodeLabel: 'Initial Direct Adjacency Matrix D^(0)',
    distMatrix: dist.map(row => [...row]),
    nextMatrix: next.map(row => [...row]),
    updatedPairs: [],
  });

  // Run Floyd-Warshall DP iterations for k = 0 to V - 1
  for (let k = 0; k < V; k++) {
    const nextDist = dist.map(row => [...row]);
    const nextNext = next.map(row => [...row]);
    const updatedPairs: Array<{ i: number; j: number; oldDist: number; newDist: number }> = [];

    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] !== INF && dist[k][j] !== INF) {
          const throughK = dist[i][k] + dist[k][j];
          if (throughK < dist[i][j]) {
            updatedPairs.push({
              i,
              j,
              oldDist: dist[i][j],
              newDist: throughK,
            });
            nextDist[i][j] = throughK;
            nextNext[i][j] = next[i][k]; // next step along the shortest path
          }
        }
      }
    }

    dist = nextDist;
    next = nextNext;

    steps.push({
      k: k + 1,
      kNodeId: nodeIds[k],
      kNodeLabel: `Considering Node ${nodeIds[k]} as Pivot (D^(${k + 1}))`,
      distMatrix: dist.map(row => [...row]),
      nextMatrix: next.map(row => [...row]),
      updatedPairs,
    });
  }

  return {
    steps,
    nodeIds,
    nodeLabels,
    finalDistMatrix: dist,
    finalNextMatrix: next,
  };
}

/**
 * Reconstructs the exact shortest path between u and v using the next matrix.
 */
export function reconstructFloydPath(
  u: number,
  v: number,
  distMatrix: number[][],
  nextMatrix: number[][],
  nodeIds: string[]
): { pathIndices: number[]; pathLabels: string[]; distance: number } {
  if (distMatrix[u][v] >= INF) {
    return { pathIndices: [], pathLabels: [], distance: INF };
  }
  if (u === v) {
    return { pathIndices: [u], pathLabels: [nodeIds[u]], distance: 0 };
  }

  const pathIndices: number[] = [u];
  let curr = u;
  while (curr !== v) {
    curr = nextMatrix[curr][v];
    if (curr === -1 || pathIndices.length > nodeIds.length + 2) {
      // Loop protection / unreachable
      return { pathIndices: [], pathLabels: [], distance: INF };
    }
    pathIndices.push(curr);
  }

  const pathLabels = pathIndices.map(idx => nodeIds[idx]);
  return { pathIndices, pathLabels, distance: distMatrix[u][v] };
}
