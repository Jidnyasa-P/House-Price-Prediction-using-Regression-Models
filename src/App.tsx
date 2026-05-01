import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MapPin, 
  Square, 
  BedDouble, 
  Bath, 
  Calendar, 
  TrendingUp, 
  ChevronRight,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HouseFeatures, PredictionResult, MarketDataPoint } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [features, setFeatures] = useState<HouseFeatures>({
    sqft: 2000,
    bedrooms: 3,
    bathrooms: 2,
    age: 10,
    location_score: 7,
    parking: true,
    renovated: false
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [marketTrends, setMarketTrends] = useState<MarketDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMarketTrends();
  }, []);

  const fetchMarketTrends = async () => {
    try {
      const res = await fetch('/api/market-trends');
      const data = await res.json();
      setMarketTrends(data);
    } catch (e) {
      console.error("Market trend fetch failed", e);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features)
      });
      const data = await res.json();
      setPrediction(data);
    } catch (e) {
      console.error("Prediction failed", e);
    } finally {
      setTimeout(() => setLoading(false), 600); // Simulate ML latency
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-[#1A1A1A]">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black p-1.5 rounded-lg">
              <Home className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight uppercase">Prophet<span className="text-gray-400">AI</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase opacity-60">
            <a href="#" className="hover:opacity-100 transition-opacity">Market Insight</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Regression Analytics</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Portfolio</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        {/* Hero Section */}
        <header className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9] max-w-3xl">
            PRECISION HOUSING <br/>VALUATION <span className="text-gray-400 italic font-serif font-light">SYSTEM</span>
          </h1>
          <p className="text-gray-500 max-w-xl text-lg font-medium">
            Deploying multivariate regression models to analyze urban property datasets with 92% historical accuracy.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Panel */}
          <section className="lg:col-span-4 bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Feature Parameters
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center justify-between">
                  <span>Square Footage</span>
                  <span className="text-black font-mono">{features.sqft} SQFT</span>
                </label>
                <input 
                  type="range" min="500" max="10000" step="50"
                  value={features.sqft}
                  onChange={e => setFeatures({...features, sqft: parseInt(e.target.value)})}
                  className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-1">
                    <BedDouble className="w-3 h-3" /> Bedrooms
                  </label>
                  <select 
                    value={features.bedrooms}
                    onChange={e => setFeatures({...features, bedrooms: parseInt(e.target.value)})}
                    className="w-full bg-[#F9F9F9] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-black outline-none"
                  >
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Rooms</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-1">
                    <Bath className="w-3 h-3" /> Bathrooms
                  </label>
                  <select 
                    value={features.bathrooms}
                    onChange={e => setFeatures({...features, bathrooms: parseInt(e.target.value)})}
                    className="w-full bg-[#F9F9F9] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-black outline-none"
                  >
                    {[1,1.5,2,2.5,3,4,5].map(n => <option key={n} value={n}>{n} Baths</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center justify-between">
                  <span>Location Quality</span>
                  <span className="text-black font-mono">{features.location_score}/10</span>
                </label>
                <input 
                  type="range" min="1" max="10" step="1"
                  value={features.location_score}
                  onChange={e => setFeatures({...features, location_score: parseInt(e.target.value)})}
                  className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Property Age (Years)
                </label>
                <input 
                  type="number"
                  value={features.age}
                  onChange={e => setFeatures({...features, age: parseInt(e.target.value)})}
                  className="w-full bg-[#F9F9F9] border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setFeatures({...features, parking: !features.parking})}
                  className={cn(
                    "flex-1 p-3 rounded-xl text-xs font-bold uppercase border transition-all",
                    features.parking ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-200"
                  )}
                >
                  Parking
                </button>
                <button 
                  onClick={() => setFeatures({...features, renovated: !features.renovated})}
                  className={cn(
                    "flex-1 p-3 rounded-xl text-xs font-bold uppercase border transition-all",
                    features.renovated ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-200"
                  )}
                >
                  Renovated
                </button>
              </div>

              <button 
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white p-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-colors active:scale-[0.98]"
              >
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <Activity className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-white" /> Run Prediction
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Results & Analysis Panel */}
          <section className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {prediction ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {/* Price Card */}
                  <div className="bg-black text-white rounded-[32px] p-10 flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest opacity-40">Estimated Market Value</span>
                      <h3 className="text-6xl font-bold font-mono tracking-tighter">
                        {formatCurrency(prediction.predictedPrice)}
                      </h3>
                    </div>
                    <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-8">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500">Confidence Score</p>
                        <p className="font-mono text-xl">{(prediction.confidenceScore * 100).toFixed(1)}%</p>
                      </div>
                      <div className="h-10 w-[1px] bg-white/10" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500">Market Signal</p>
                        <p className={cn(
                          "font-bold uppercase flex items-center gap-1",
                          prediction.marketTrend === 'rising' ? "text-emerald-400" : "text-amber-400"
                        )}>
                          {prediction.marketTrend} <TrendingUp className="w-4 h-4" />
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Impact Chart */}
                  <div className="bg-white rounded-[32px] p-8 border border-gray-100 flex flex-col justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 px-2">Coefficient Impact Analysis</h4>
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prediction.featureImpacts} layout="vertical" margin={{ left: -30 }}>
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="feature" hide />
                          <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-3 shadow-xl rounded-xl border border-gray-100 text-xs">
                                    <p className="font-bold text-gray-400 uppercase mb-1">{payload[0].payload.feature}</p>
                                    <p className="font-mono font-bold">{formatCurrency(payload[0].value as number)} contribution</p>
                                    <p className="text-gray-500 mt-1">{payload[0].payload.description}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={20}>
                            {prediction.featureImpacts.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#1A1A1A' : '#9CA3AF'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 px-2">
                       <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                         The model attributes <span className="text-black font-bold font-mono">+{formatCurrency(prediction.featureImpacts[0].impact)}</span> to dimensional scale and structural specifications.
                       </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-100 rounded-[32px] p-20 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-4"
                >
                   <div className="bg-white p-4 rounded-full shadow-sm">
                     <Zap className="w-8 h-8 text-gray-300" />
                   </div>
                   <div className="space-y-1">
                     <h3 className="font-bold text-xl uppercase tracking-tight">System Awaiting Parameters</h3>
                     <p className="text-gray-400 max-w-xs text-sm">Configure property features in the left panel to execute the regression inference engine.</p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Market History Chart */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100">
               <div className="flex items-center justify-between mb-8 px-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">12-Month Market Volatility</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-black"></div> Average Price
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-gray-200"></div> Sales Volume
                    </div>
                  </div>
               </div>
               <div className="h-[280px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={marketTrends}>
                      <CartesianGrid vertical={false} stroke="#F0F0F0" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        fontSize={10} 
                        fontWeight={700}
                        tick={{ fill: '#9CA3AF' }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        fontSize={10} 
                        fontWeight={700}
                        tick={{ fill: '#9CA3AF' }}
                        tickFormatter={(v) => `$${v/1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }}
                        formatter={(val: number) => [formatCurrency(val), "Market Avg"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avgPrice" 
                        stroke="#1A1A1A" 
                        strokeWidth={3} 
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#1A1A1A' }}
                      />
                    </LineChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Explanation / Footer Area */}
            <footer className="bg-amber-50 border-amber-100 border rounded-2xl p-6 flex gap-4">
               <Info className="w-5 h-5 text-amber-500 flex-shrink-0" />
               <div className="space-y-1">
                 <p className="text-[10px] font-bold uppercase text-amber-500 tracking-widest">Model Documentation</p>
                 <p className="text-xs text-amber-900/80 leading-relaxed">
                   This dashboard demonstrates a <span className="font-bold underline">Multivariate Linear Regression</span> approach. The model accounts for both physical attributes (dimensions/rooms) and temporal factors (age/renovation status). In a real-world deployment, this system would consume real-time MLS data via proprietary APIs to adjust coefficients dynamically.
                 </p>
               </div>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}
