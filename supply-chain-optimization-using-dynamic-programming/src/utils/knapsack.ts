import { KnapsackItem, KnapsackResult } from '../types';

/**
 * Solves 0/1 Knapsack using Bottom-Up Dynamic Programming Tabulation.
 *
 * Recurrence:
 * DP[i][w] = DP[i-1][w]                                    if weight[i-1] > w
 * DP[i][w] = max(DP[i-1][w], value[i-1] + DP[i-1][w - weight[i-1]]) if weight[i-1] <= w
 *
 * Time Complexity: O(n * W)
 * Space Complexity: O(n * W)
 */
export function solve01Knapsack(items: KnapsackItem[], capacity: number): KnapsackResult {
  const n = items.length;
  const W = Math.max(0, Math.floor(capacity));

  // Initialize (n + 1) x (W + 1) table with zeros
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  // Fill DP Table
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    const w_i = Math.floor(item.weight);
    const v_i = item.value;

    for (let w = 0; w <= W; w++) {
      if (w_i <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], v_i + dp[i - 1][w - w_i]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtracking to find selected items
  const selectedItems: KnapsackItem[] = [];
  const backtrackSteps: KnapsackResult['backtrackSteps'] = [];

  let curW = W;
  for (let i = n; i >= 1; i--) {
    const item = items[i - 1];
    const w_i = Math.floor(item.weight);
    const v_i = item.value;

    if (dp[i][curW] !== dp[i - 1][curW]) {
      // Item was included
      selectedItems.push(item);
      backtrackSteps.push({
        itemIndex: i,
        weight: item.weight,
        value: item.value,
        decision: 'included',
        reason: `DP[${i}][${curW}] (${dp[i][curW]}) != DP[${i - 1}][${curW}] (${dp[i - 1][curW]}). Package "${item.name}" was packed. Remaining capacity: ${curW} - ${w_i} = ${curW - w_i} kg.`
      });
      curW -= w_i;
    } else {
      // Item was excluded
      backtrackSteps.push({
        itemIndex: i,
        weight: item.weight,
        value: item.value,
        decision: 'excluded',
        reason: `DP[${i}][${curW}] == DP[${i - 1}][${curW}] (${dp[i][curW]}). Package "${item.name}" was skipped to maximize overall value.`
      });
    }
  }

  selectedItems.reverse();
  backtrackSteps.reverse();

  const totalWeight = selectedItems.reduce((acc, item) => acc + item.weight, 0);
  const totalValue = selectedItems.reduce((acc, item) => acc + item.value, 0);
  const unusedCapacity = Math.max(0, W - totalWeight);

  // Baseline comparison: First-Fit / Order-of-arrival heuristic
  // In real warehouses, unoptimized loading frequently packs packages in arrival order until full.
  let baselineW = 0;
  let baselineValue = 0;
  const baselineItems: KnapsackItem[] = [];

  for (const it of items) {
    if (baselineW + it.weight <= W) {
      baselineW += it.weight;
      baselineValue += it.value;
      baselineItems.push(it);
    }
  }

  return {
    dpTable: dp,
    selectedItems,
    totalWeight,
    totalValue,
    unusedCapacity,
    capacity: W,
    items,
    backtrackSteps,
    baselineValue,
    baselineItems,
  };
}
