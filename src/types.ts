/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  views: number;
}

export interface EcoProject {
  id: string;
  title: string;
  category: 'energy' | 'development' | 'lifestyle';
  status: 'active' | 'pending' | 'completed';
  progress: number; // 0 to 100
  budget: number; // in Tomans or generic unit
  impactFactor: number; // CO2 reduction percentage or score
  location: string;
  startDate: string;
  supervisor: string;
}

export interface ChartDataPoint {
  label: string;
  energySaved: number; // kWh
  wasteReduced: number; // kg
  waterSaved: number; // Liters
}

export interface LifestyleSimulation {
  solarPower: boolean; // Is solar used?
  recyclingLevel: number; // 0 to 5 (none to maximum)
  commuteMode: 'car' | 'hybrid' | 'bike' | 'public';
  waterSavingUsage: boolean; // Active water saving gadgets
  meatConsumption: 'high' | 'medium' | 'low';
}
