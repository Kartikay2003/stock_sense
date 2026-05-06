"use client";

import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

export default function PredictionPage() {
    const [ticker, setTicker] = useState("AAPL");
    const [days, setDays] = useState(10);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            // 1. Set up the dynamic URL
            // This tells Next.js: "Use the live URL if we are on Vercel, but use localhost if I am testing on my computer"
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

            // 2. Swap out the hardcoded localhost for the API_URL variable
            const response = await fetch(`${API_URL}/api/predict?ticker=${ticker}&days=${days}`);

            if (!response.ok) throw new Error("Failed to fetch prediction. Make sure your Python server is running!");

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || "An error occurred fetching the prediction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full px-5 py-8 max-w-7xl mx-auto gap-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🤖 AI Stock Forecast</h1>
                <p className="text-gray-500 mt-2">LSTM sequence forecasting for analysis purposes.</p>
            </div>

            {/* Control Panel */}
            <form onSubmit={handlePredict} className="flex flex-wrap gap-4 items-end bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Stock Symbol</label>
                    <input
                        type="text"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        className="p-2 border rounded-md dark:bg-black dark:border-gray-700"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Days to Forecast</label>
                    <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="p-2 border rounded-md dark:bg-black dark:border-gray-700"
                        min="1" max="60"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 h-[42px]"
                >
                    {loading && <Loader2 className="animate-spin w-4 h-4" />}
                    {loading ? "Running AI..." : "Predict"}
                </button>
            </form>

            {/* Error Message */}
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {/* Results Section */}
            {result && (
                <div className="flex flex-col gap-8">
                    {/* Top Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 border rounded-xl bg-white dark:bg-black shadow-sm">
                            <p className="text-sm text-gray-500">Current Price</p>
                            <p className="text-2xl font-bold">${result.current_price.toFixed(2)}</p>
                        </div>
                        <div className="p-6 border rounded-xl bg-white dark:bg-black shadow-sm">
                            <p className="text-sm text-gray-500">Model RMSE</p>
                            <p className="text-2xl font-bold">{result.metrics.RMSE}</p>
                        </div>
                        <div className="p-6 border rounded-xl bg-white dark:bg-black shadow-sm">
                            <p className="text-sm text-gray-500">Direction Accuracy</p>
                            <p className="text-2xl font-bold">{result.metrics.Direction_Accuracy}%</p>
                        </div>
                    </div>

                    {/* The Chart */}
                    <div className="h-[400px] w-full p-6 border rounded-xl bg-white dark:bg-black shadow-sm">
                        <h3 className="font-semibold mb-4">Price Forecast Chart</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={result.chart_data}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="date" tick={{fontSize: 12}} />
                                <YAxis domain={['auto', 'auto']} tick={{fontSize: 12}} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000000', borderColor: '#333333', borderRadius: '8px' }}
                                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '4px' }}
                                    itemStyle={{ color: '#3b82f6' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    name="Price (USD)"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={(props: any) => {
                                        // This makes the AI forecasted dots look different from historical data
                                        return props.payload.type === "Forecast" ? <circle cx={props.cx} cy={props.cy} r={4} fill="#2563eb" /> : <span />;
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}