import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { HouseFeatures, PredictionResult } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Industry-inspired Regression Logic (Simulated Weights)
  // These weights are inspired by standard housing datasets (e.g., Ames, IA)
  const weights = {
    basePrice: 150000,
    sqft: 220,         // Price per sqft
    bedroom: 15000,    // Price per bedroom
    bathroom: 25000,   // Price per bathroom
    location: 45000,   // Price per location point (1-10)
    agePenalty: -1200, // Annual depreciation
    parkingBonus: 12000,
    renovationBonus: 35000
  };

  // API: Predict House Price
  app.post("/api/predict", (req, res) => {
    try {
      const features: HouseFeatures = req.body;

      // Linear Regression Calculation: Y = B0 + B1*X1 + B2*X2...
      let price = weights.basePrice;
      price += features.sqft * weights.sqft;
      price += features.bedrooms * weights.bedroom;
      price += features.bathrooms * weights.bathroom;
      price += features.location_score * weights.location;
      price += features.age * weights.agePenalty;
      if (features.parking) price += weights.parkingBonus;
      if (features.renovated) price += weights.renovationBonus;

      // Add slight noise to simulate real-world uncertainty (±2%)
      const noise = price * (Math.random() * 0.04 - 0.02);
      const finalPrice = Math.round(price + noise);

      const result: PredictionResult = {
        predictedPrice: finalPrice,
        confidenceScore: 0.92,
        marketTrend: 'rising',
        featureImpacts: [
          { feature: 'Square Footage', impact: features.sqft * weights.sqft, description: 'Single largest driver of value' },
          { feature: 'Location', impact: features.location_score * weights.location, description: 'Proximity to amenities and safety' },
          { feature: 'Age', impact: features.age * weights.agePenalty, description: 'Structural depreciation over time' },
          { feature: 'Extras', impact: (features.parking ? weights.parkingBonus : 0) + (features.renovated ? weights.renovationBonus : 0), description: 'Value added by modern amenities' }
        ]
      };

      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid feature data provided" });
    }
  });

  // API: Get Market Trends (Simulated)
  app.get("/api/market-trends", (req, res) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trend = months.map((m, i) => ({
      month: m,
      avgPrice: 400000 + (i * 12500) + (Math.random() * 20000),
      volume: 45 + Math.floor(Math.random() * 30)
    }));
    res.json(trend);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
