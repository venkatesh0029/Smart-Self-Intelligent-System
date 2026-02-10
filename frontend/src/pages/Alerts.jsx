import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertTriangle, Bell, CheckCircle2, XCircle, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data - replace with API call later
const MOCK_ALERTS = [
    { id: 1, type: 'misplace', severity: 'high', location: 'Shelf A-12', message: 'Item misplaced in Zone B', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), status: 'active' },
    { id: 2, type: 'stockout', severity: 'medium', location: 'Shelf C-05', message: 'Low stock: Coca Cola 2L', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), status: 'active' },
    { id: 3, type: 'system', severity: 'critical', location: 'Camera 03', message: 'Signal lost for > 60s', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), status: 'resolved' },
    { id: 4, type: 'misplace', severity: 'high', location: 'Shelf B-09', message: 'Item misplaced in Zone A', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), status: 'resolved' },
];

export const Alerts = () => {
    const [alerts, setAlerts] = useState(MOCK_ALERTS);
    const [filter, setFilter] = useState('all'); // all, active, resolved

    const filteredAlerts = alerts.filter(alert =>
        filter === 'all' ? true : alert.status === filter
    );

    const handleResolve = (id) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">System Alerts</h2>
                    <p className="text-muted-foreground">Monitor and resolve system notifications.</p>
                </div>
                <div className="flex gap-2 bg-card border rounded-lg p-1">
                    <Button
                        variant={filter === 'all' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'active' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('active')}
                    >
                        Active
                    </Button>
                    <Button
                        variant={filter === 'resolved' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter('resolved')}
                    >
                        Resolved
                    </Button>
                </div>
            </div>

            <Card className="border-0 bg-transparent shadow-none" noPadding>
                <div className="space-y-4">
                    <AnimatePresence mode='popLayout'>
                        {filteredAlerts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 border-2 border-dashed rounded-lg"
                            >
                                <Bell className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground">No alerts found</p>
                            </motion.div>
                        ) : (
                            filteredAlerts.map((alert) => (
                                <motion.div
                                    layout
                                    key={alert.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <div className={`
                                        flex items-center p-4 rounded-xl border transition-all
                                        ${alert.status === 'active'
                                            ? 'bg-card border-l-4 border-l-red-500 shadow-sm'
                                            : 'bg-muted/30 border-l-4 border-l-green-500 opacity-70'
                                        }
                                    `}>
                                        <div className={`p-3 rounded-full mr-4 ${alert.status === 'active' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                            {alert.type === 'system' ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-sm truncate">{alert.message}</h4>
                                                {alert.status === 'active' && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>{alert.location}</span>
                                                <span>•</span>
                                                <span>{new Date(alert.timestamp).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 ml-4">
                                            {alert.status === 'active' && (
                                                <Button size="sm" onClick={() => handleResolve(alert.id)}>
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Resolve
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </div>
    );
};
