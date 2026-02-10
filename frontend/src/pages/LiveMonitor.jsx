import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { useSocket } from '../context/SocketContext';
import { AlertCircle, Camera, History, Video, Sliders, Eye, EyeOff, Activity, Maximize2, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveMonitor = () => {
    const { isConnected, lastEvent, API_URL } = useSocket();
    const [events, setEvents] = useState([]);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);

    useEffect(() => {
        if (lastEvent) {
            setEvents(prev => [lastEvent, ...prev].slice(0, 50));
        }
    }, [lastEvent]);

    return (
        <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Main Video Feed Area - Cinema Mode */}
            <div className="lg:col-span-3 h-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white neon-text">Live Monitor</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="relative flex h-3 w-3">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            </span>
                            <span className="text-sm text-muted-foreground">{isConnected ? "System Online & Monitoring (Camera 01)" : "Signal Lost"}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Confidence</span>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={confidenceThreshold}
                                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                                className="w-24 accent-primary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs w-8 text-right font-mono text-primary">{(confidenceThreshold * 100).toFixed(0)}%</span>
                        </div>

                        <NeonButton
                            variant={showHeatmap ? "primary" : "secondary"}
                            size="sm"
                            onClick={() => setShowHeatmap(!showHeatmap)}
                            className="h-8 text-xs"
                        >
                            {showHeatmap ? <Eye className="w-3 h-3 mr-2" /> : <EyeOff className="w-3 h-3 mr-2" />}
                            Heatmap
                        </NeonButton>
                    </div>
                </div>

                <GlassCard className="flex-1 bg-black/80 relative overflow-hidden border-2 border-primary/20 shadow-[0_0_50px_rgba(124,58,237,0.1)] p-0 flex items-center justify-center group">

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/50 rounded-tl-xl z-20" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/50 rounded-tr-xl z-20" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/50 rounded-bl-xl z-20" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/50 rounded-br-xl z-20" />

                    {isConnected ? (
                        <div className="relative w-full h-full">
                            <img
                                src={`${API_URL}/api/video/stream?t=${Date.now()}`}
                                className="w-full h-full object-contain"
                                alt="Live Stream"
                            />
                            {/* Debug Badge */}
                            <div className="absolute top-6 left-6 bg-blue-600/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full z-50 border border-blue-400/30">
                                LOCAL MODE ACTIVE
                            </div>

                            {/* Scanning Line Animation */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent h-2 w-full animate-scan pointer-events-none" />

                            {/* Simulated Heatmap Overlay */}
                            {showHeatmap && (
                                <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 via-transparent to-transparent pointer-events-none mix-blend-overlay" />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
                            <div className="p-6 rounded-full bg-white/5 border border-white/10 animate-pulse">
                                <Video className="w-12 h-12 opacity-50" />
                            </div>
                            <p className="tracking-widest uppercase text-xs">Waiting for camera feed...</p>
                        </div>
                    )}

                    {/* HUD Overlay */}
                    <div className="absolute top-6 right-6 flex flex-col items-end gap-2 z-30">
                        <div className="bg-black/60 backdrop-blur text-green-400 text-xs font-mono px-3 py-1.5 rounded border border-green-500/30 flex items-center gap-2">
                            <Activity className="w-3 h-3" />
                            FPS: {isConnected ? "30.0" : "0.0"}
                        </div>
                        <div className="bg-black/60 backdrop-blur text-white text-xs font-mono px-3 py-1.5 rounded border border-white/10">
                            RES: 1920x1080
                        </div>
                    </div>

                    {/* Recording Indicator */}
                    <div className="absolute bottom-6 left-6 flex items-center gap-3 z-30">
                        <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1.5 rounded-full border border-red-500/20 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-bold tracking-wider">REC</span>
                        </div>
                        <div className="text-white/50 text-xs font-mono">00:04:23</div>
                    </div>

                    {/* Target Reticle Center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 pointer-events-none z-10">
                        <Target className="w-24 h-24 stroke-1" />
                    </div>

                </GlassCard>
            </div>

            {/* Side Panel: Real-time Event Log */}
            <GlassCard className="lg:col-span-1 h-full flex flex-col overflow-hidden p-0 border-l border-y-0 border-r-0 rounded-none lg:border lg:rounded-xl">
                <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-semibold text-white">Detection Log</h3>
                    </div>
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">{events.length} Events</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-black/20">
                    <AnimatePresence initial={false}>
                        {events.map((event, i) => (
                            <motion.div
                                key={`${event.timestamp}-${i}`}
                                initial={{ opacity: 0, x: 20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`p-3 rounded-lg border text-sm relative overflow-hidden group ${event.event_type === 'misplace'
                                    ? 'bg-red-950/20 border-red-500/20 hover:border-red-500/40'
                                    : event.event_type === 'pick'
                                        ? 'bg-blue-950/20 border-blue-500/20 hover:border-blue-500/40'
                                        : 'bg-white/5 border-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1 relative z-10">
                                    <span className={`font-bold uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded ${event.event_type === 'misplace' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {event.event_type}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                        {new Date(event.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground relative z-10">
                                    <span className="font-mono text-white/70">ID: {event.track_id?.slice(0, 8)}</span>
                                    <span className="text-white/50">Conf: {(event.confidence * 100).toFixed(0)}%</span>
                                </div>

                                {/* Progress bar based on confidence */}
                                <div
                                    className="absolute bottom-0 left-0 h-0.5 bg-current opacity-20 transition-all duration-500 group-hover:h-1 group-hover:opacity-40"
                                    style={{ width: `${event.confidence * 100}%`, color: event.event_type === 'misplace' ? 'red' : 'blue' }}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {events.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Activity className="w-10 h-10 mb-3 opacity-20" />
                            <p className="text-sm">No recent events detected</p>
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};
