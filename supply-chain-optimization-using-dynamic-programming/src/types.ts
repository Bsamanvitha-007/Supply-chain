/**
 * Data structures and types for Supply Chain Optimization Platform
 */

export interface KnapsackItem {
  id: string;
  name: string;
  weight: number; // in kg
  value: number;  // in ₹ (Rupees)
}

export interface KnapsackResult {
  dpTable: number[][]; // (n+1) x (W+1)
  selectedItems: KnapsackItem[];
  totalWeight: number;
  totalValue: number;
  unusedCapacity: number;
  capacity: number;
  items: KnapsackItem[];
  backtrackSteps: Array<{
    itemIndex: number;
    weight: number;
    value: number;
    decision: 'included' | 'excluded';
    reason: string;
  }>;
  baselineValue: number;
  baselineItems: KnapsackItem[];
}

export interface FloydNode {
  id: string;
  label: string;
  type: 'warehouse' | 'distribution' | 'hub';
  x: number;
  y: number;
}

export interface FloydEdge {
  from: string;
  to: string;
  distance: number; // in km
}

export interface FloydStep {
  k: number; // 0 = initial, 1..V = intermediate node
  kNodeId: string;
  kNodeLabel: string;
  distMatrix: number[][];
  nextMatrix: number[][]; // for path reconstruction
  updatedPairs: Array<{ i: number; j: number; oldDist: number; newDist: number }>;
}

export interface FloydResult {
  steps: FloydStep[];
  nodeIds: string[];
  nodeLabels: string[];
  finalDistMatrix: number[][];
  finalNextMatrix: number[][];
}

export interface ObstKey {
  id: number;
  key: string; // e.g. "1001"
  frequency: number; // access frequency
}

export interface ObstTreeNode {
  key: string;
  freq: number;
  depth: number;
  left?: ObstTreeNode;
  right?: ObstTreeNode;
  x?: number;
  y?: number;
}

export interface ObstResult {
  keys: ObstKey[];
  costTable: number[][]; // (n+2) x (n+1)
  rootTable: number[][]; // (n+1) x (n+1)
  weightTable: number[][];
  optimalTree: ObstTreeNode | null;
  balancedTree: ObstTreeNode | null;
  optimalWeightedCost: number;
  balancedWeightedCost: number;
  optimalAvgCost: number;
  balancedAvgCost: number;
  totalFrequency: number;
}

export interface TspLocation {
  id: number;
  name: string;
  code: string;
  type: 'central' | 'customer';
  x: number;
  y: number;
}

export interface TspResult {
  tour: number[]; // sequence of node indices, e.g. [0, 1, 3, 4, 2, 0]
  tourNames: string[];
  totalDistance: number;
  baselineTour: number[];
  baselineDistance: number;
  baselineName: string;
  dpTableSummary: Array<{
    mask: number;
    maskBinary: string;
    visitedNames: string[];
    lastNode: string;
    cost: number;
  }>;
  totalStatesComputed: number;
}

export interface DashboardMetrics {
  knapsack: {
    optimalValue: number;
    baselineValue: number;
    totalWeight: number;
    capacity: number;
  };
  floyd: {
    selectedPathDist: number;
    baselineDist: number;
    sourceLabel: string;
    destLabel: string;
    pathLabels: string[];
  };
  obst: {
    optimalCost: number;
    balancedCost: number;
    optimalAvgCost: number;
    balancedAvgCost: number;
  };
  tsp: {
    optimalTourDist: number;
    baselineTourDist: number;
    startLabel: string;
    routeSequence: string;
  };
}
