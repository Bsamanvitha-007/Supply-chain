/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemOverviewSection } from './components/ProblemOverviewSection';
import { KnapsackSection } from './components/KnapsackSection';
import { FloydWarshallSection } from './components/FloydWarshallSection';
import { ObstSection } from './components/ObstSection';
import { TspSection } from './components/TspSection';
import { UnifiedDashboardSection } from './components/UnifiedDashboardSection';
import { ComparisonTableSection } from './components/ComparisonTableSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { TechnicalFaqSection } from './components/TechnicalFaqSection';
import { Footer } from './components/Footer';
import { DashboardMetrics, KnapsackResult, ObstResult, TspResult } from './types';

export default function App() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    knapsack: {
      optimalValue: 120,
      baselineValue: 70,
      totalWeight: 8,
      capacity: 8,
    },
    floyd: {
      selectedPathDist: 10,
      baselineDist: 12,
      sourceLabel: 'Warehouse A (Bhiwandi)',
      destLabel: 'Customer Hub E (Panvel)',
      pathLabels: ['A', 'C', 'B', 'D', 'E'],
    },
    obst: {
      optimalCost: 190,
      balancedCost: 205,
      optimalAvgCost: 1.9,
      balancedAvgCost: 2.05,
    },
    tsp: {
      optimalTourDist: 88,
      baselineTourDist: 103,
      startLabel: 'WH-0',
      routeSequence: 'WH-0 → CUST-A → CUST-D → CUST-C → CUST-B → WH-0',
    },
  });

  const handleKnapsackChange = (res: KnapsackResult) => {
    setMetrics((prev) => ({
      ...prev,
      knapsack: {
        optimalValue: res.totalValue,
        baselineValue: res.baselineValue,
        totalWeight: res.totalWeight,
        capacity: res.capacity,
      },
    }));
  };

  const handleFloydChange = (data: {
    source: string;
    dest: string;
    distance: number;
    path: string[];
    baselineDist: number;
  }) => {
    setMetrics((prev) => ({
      ...prev,
      floyd: {
        selectedPathDist: data.distance,
        baselineDist: data.baselineDist,
        sourceLabel: data.source,
        destLabel: data.dest,
        pathLabels: data.path,
      },
    }));
  };

  const handleObstChange = (res: ObstResult) => {
    setMetrics((prev) => ({
      ...prev,
      obst: {
        optimalCost: res.optimalWeightedCost,
        balancedCost: res.balancedWeightedCost,
        optimalAvgCost: res.optimalAvgCost,
        balancedAvgCost: res.balancedAvgCost,
      },
    }));
  };

  const handleTspChange = (res: TspResult) => {
    setMetrics((prev) => ({
      ...prev,
      tsp: {
        optimalTourDist: res.totalDistance,
        baselineTourDist: res.baselineDistance,
        startLabel: res.tourNames[0] || 'Depot',
        routeSequence: res.tourNames.join(' → '),
      },
    }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* Sticky Navigation Bar */}
      <Navbar activeSection="hero" />

      <main className="w-full">
        {/* SECTION 1: Hero Section */}
        <HeroSection onExplore={() => scrollToSection('knapsack')} />

        {/* SECTION 2: Real-World Problem Overview & Why DP Fits */}
        <ProblemOverviewSection />

        {/* SECTION 3: Algorithm 1 — 0/1 Knapsack Problem */}
        <KnapsackSection onResultChange={handleKnapsackChange} />

        {/* SECTION 4: Algorithm 2 — Floyd–Warshall Shortest Path */}
        <FloydWarshallSection onResultChange={handleFloydChange} />

        {/* SECTION 5: Algorithm 3 — Optimal Binary Search Trees (OBST) */}
        <ObstSection onResultChange={handleObstChange} />

        {/* SECTION 6: Algorithm 4 — Traveling Salesperson Problem (TSP) using Held–Karp */}
        <TspSection onResultChange={handleTspChange} />

        {/* SECTION 7: Integrated Supply Chain Dashboard */}
        <UnifiedDashboardSection metrics={metrics} />

        {/* SECTION 8: Algorithm Comparison Matrix */}
        <ComparisonTableSection />

        {/* SECTION 9: Implementation Architecture */}
        <ArchitectureSection />

        {/* SECTION 10: Technical FAQ & Architecture Deep Dive */}
        <TechnicalFaqSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
