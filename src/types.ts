/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HouseFeatures {
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  age: number;
  location_score: number; // 1-10
  parking: boolean;
  renovated: boolean;
}

export interface PredictionResult {
  predictedPrice: number;
  confidenceScore: number;
  marketTrend: 'rising' | 'stable' | 'falling';
  featureImpacts: {
    feature: string;
    impact: number;
    description: string;
  }[];
}

export interface MarketDataPoint {
  month: string;
  avgPrice: number;
  volume: number;
}
