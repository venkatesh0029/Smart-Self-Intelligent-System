import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatCard } from '../components/ui/StatCard';
import { NeonButton } from '../components/ui/NeonButton';
import { useSocket } from '../context/SocketContext';
import { Activity, AlertTriangle, Box, CheckCircle, Package, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const chartData = [
    { name: 'Mon', stock: 120, alerts: 2 },
    { name: 'Tue', stock: 132, alerts: 1 },
    { name: 'Wed', stock: 101, alerts: 5 },
    { name: 'Thu', stock: 134, alerts: 2 },
    { name: 'Fri', stock: 90, alerts: 8 },
    { name: 'Sat', stock: 70, alerts: 12 },
    { name: 'Sun', stock: 110, alerts: 4 },
];

export const Overview = () => {
    const { isConnected, API_URL } = useSocket();
    const [stats, setStats] = useState(null);
    const [recentEvents, setRecentEvents] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, eventsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/analytics/dashboard`),
                    axios.get(`${API_URL}/api/events/list?limit=5`)
                ]);
                setStats(statsRes.data);
                setRecentEvents(eventsRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, [API_URL]);

    return (
        <div className="space-y-8 pb-10">
            {/* Hero Section */}
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-white neon-text mb-2">Command Center</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        System Online & Monitoring Active
                    </p>
                </div>
                <div className="flex gap-4">
                    <NeonButton variant="secondary">Download Report</NeonButton>
                    <NeonButton>System Config</NeonButton>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Alerts"
                    value={stats?.active_alerts || 0}
                    icon={AlertTriangle}
                    color="text-destructive"
                    trend="up"
                    trendValue="+2"
                />
                <StatCard
                    title="Total Inventory"
                    value={stats?.total_items || 1240}
                    icon={Package}
                    color="text-neon-cyan"
                    trend="down"
                    trendValue="1.2%"
                />
                <StatCard
                    title="Anomalies"
                    value={stats?.mismatches || 0}
                    icon={Zap}
                    color="text-amber-400"
                    trend="up"
                    trendValue="5"
                />
                <StatCard
                    title="System Health"
                    value={isConnected ? "98%" : "Offline"}
                    icon={CheckCircle}
                    color={isConnected ? "text-green-400" : "text-destructive"}
                />
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Action & Charts */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Action Required Panel */}
                    <GlassCard className="border-l-4 border-l-destructive/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Action Required</h3>
                            <span className="text-xs font-mono text-destructive bg-destructive/10 px-2 py-1 rounded">3 CRITICAL</span>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-destructive" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Low stock on Shelf A{i}</p>
                                            <p className="text-xs text-muted-foreground">Predicted stockout in 2 hours</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-transform group-hover:translate-x-1" />
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Inventory Forecast Chart */}
                    <GlassCard className="h-[400px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Inventory Forecast</h3>
                            <select className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-muted-foreground outline-none focus:border-primary">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="stock" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" />
                                <Area type="monotone" dataKey="alerts" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorAlerts)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </GlassCard>
                </div>

                {/* Right Column: Live Feed & Activity */}
                <div className="space-y-6">
                    {/* Mini Live Feed */}
                    <GlassCard className="p-0 overflow-hidden relative group aspect-video">
                        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg animate-pulse">
                            LIVE
                        </div>
                        {isConnected ? (
                            <img
                                src={`${API_URL}/api/video/stream?t=${Date.now()}`} // Force refresh
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                alt="Live Stream"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 text-muted-foreground">
                                <Activity className="w-8 h-8 opacity-50 mb-2" />
                                <span className="text-xs">Signal Lost</span>
                            </div>
                        )}
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                            <div>
                                <p className="text-white text-sm font-medium">Cam-01 (Main Aisle)</p>
                                <p className="text-xs text-white/50">1920x1080 • 30FPS</p>
                            </div>
                            <div className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer backdrop-blur-md">
                                <Box className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Recent Activity Feed */}
                    <GlassCard className="h-[400px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-neon-cyan" />
                            <h3 className="text-lg font-semibold text-white">Event Stream</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1">
                            <AnimatePresence>
                                {recentEvents.map((event, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${event.event_type === 'misplace' ? 'bg-red-500/20 text-red-400' :
                                                    event.event_type === 'pick' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-white/10 text-gray-400'
                                                }`}>
                                                {event.event_type.toUpperCase()}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                {new Date(event.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-300">
                                            Object <span className="text-white font-mono">{event.track_id}</span> detected on Shelf A
                                        </p>
                                    </motion.div>
                                ))}
                                {recentEvents.length === 0 && (
                                    <div className="text-center py-10 text-muted-foreground text-xs">
                                        No recent events
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
