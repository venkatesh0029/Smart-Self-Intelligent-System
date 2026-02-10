import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { useSocket } from '../context/SocketContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';
import { BarChart as BarChartIcon, BrainCircuit, AlertTriangle } from 'lucide-react';

export const Analytics = () => {
    const { API_URL } = useSocket();
    const [behavior, setBehavior] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [anomalies, setAnomalies] = useState([]);


    useEffect(() => {
        const fetch = async () => {
            try {
                const [behavRes, predRes, anomRes] = await Promise.all([
                    axios.get(`${API_URL}/api/analytics/behavior`),
                    axios.get(`${API_URL}/api/analytics/predictions`),
                    axios.get(`${API_URL}/api/analytics/anomalies`)
                ]);
                setBehavior(behavRes.data);
                setPredictions(predRes.data);
                setAnomalies(anomRes.data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            }
        };
        fetch();
    }, [API_URL]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground">AI-driven insights and predictions.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {anomalies.length > 0 && (
                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="w-5 h-5" />
                                <CardTitle className="text-lg">Detected Anomalies</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {anomalies.map((anomaly, i) => (
                                    <div key={i} className="flex items-start justify-between p-4 rounded-lg bg-background border border-destructive/20 shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-destructive uppercase text-xs tracking-wider border border-destructive/30 px-1.5 py-0.5 rounded">{anomaly.severity} SEVERITY</span>
                                                <span className="text-xs text-muted-foreground">{new Date(anomaly.timestamp).toLocaleString()}</span>
                                            </div>
                                            <p className="font-medium mt-1">{anomaly.description}</p>
                                            <p className="text-sm text-muted-foreground">Shelf: {anomaly.shelf_id}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BarChartIcon className="w-5 h-5 text-primary" />
                            <CardTitle>Shelf Engagement</CardTitle>
                        </div>
                        <CardDescription>Interaction frequency by shelf zone</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={behavior?.shelf_engagement || []}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <XAxis
                                        dataKey="shelf_id"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                                    />
                                    <Bar
                                        dataKey="engagement_score"
                                        fill="hsl(var(--primary))"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-purple-500" />
                            <CardTitle>Restocking Predictions</CardTitle>
                        </div>
                        <CardDescription>Predicted stockout times based on current consumption rates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {predictions.slice(0, 5).map((pred, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                                    <div>
                                        <p className="font-medium text-sm">{pred.product_name}</p>
                                        <p className="text-xs text-muted-foreground">Shelf: {pred.shelf_id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-sm ${pred.hours_to_empty < 4 ? 'text-destructive' : 'text-amber-500'}`}>
                                            {pred.hours_to_empty}h remaining
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {pred.consumption_rate_per_hour}/hr rate
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {predictions.length === 0 && <p className="text-muted-foreground text-center py-10 text-sm">No predictions available yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
