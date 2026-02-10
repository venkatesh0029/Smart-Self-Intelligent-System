import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Save, Server, Camera, Bell, Shield, RefreshCw } from 'lucide-react';

export const Configuration = () => {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        VIDEO_SOURCE: '',
        CAMERA_FPS: 30,
        CONFIDENCE_THRESHOLD: 0.5,
        IOU_THRESHOLD: 0.45,
        ENABLE_EMAIL_ALERTS: true,
        ENABLE_WEBSOCKET_ALERTS: true
    });
    const [originalConfig, setOriginalConfig] = useState({});

    // Fetch config on load
    React.useEffect(() => {
        const fetchConfig = async () => {
            try {
                // Determine API URL (assuming relative for same-origin or localhost default)
                // In production, this should come from context or env
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const res = await fetch(`${API_URL}/api/config/config`);
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data);
                    setOriginalConfig(data);
                }
            } catch (error) {
                console.error("Failed to fetch config:", error);
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/api/config/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: config })
            });

            if (res.ok) {
                setOriginalConfig(config);
                // Optional: Show success toast
                alert("Configuration saved successfully!");
            } else {
                alert("Failed to save configuration.");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Error saving configuration.");
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Configuration</h2>
                    <p className="text-muted-foreground">Manage system settings and device parameters.</p>
                </div>
                <Button onClick={handleSave} disabled={loading || !hasChanges}>
                    {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Camera Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Camera className="w-5 h-5 text-primary" />
                            <CardTitle>Camera Settings</CardTitle>
                        </div>
                        <CardDescription>Configure video stream parameters and RTSP sources.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Video Source / RTSP URL</label>
                                <input
                                    type="text"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={config.VIDEO_SOURCE}
                                    onChange={(e) => handleChange('VIDEO_SOURCE', e.target.value)}
                                    placeholder="0 for webcam or RTSP URL"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Frame Rate (FPS)</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={config.CAMERA_FPS}
                                    onChange={(e) => handleChange('CAMERA_FPS', parseInt(e.target.value))}
                                >
                                    <option value={15}>15</option>
                                    <option value={24}>24</option>
                                    <option value={30}>30</option>
                                    <option value={60}>60</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Model Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Server className="w-5 h-5 text-blue-500" />
                            <CardTitle>AI Model Parameters</CardTitle>
                        </div>
                        <CardDescription>Adjust detection sensitivity and model thresholds.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium">Confidence Threshold</label>
                                    <span className="text-sm text-muted-foreground">{config.CONFIDENCE_THRESHOLD}</span>
                                </div>
                                <input
                                    type="range"
                                    className="w-full accent-primary"
                                    min="0" max="1" step="0.05"
                                    value={config.CONFIDENCE_THRESHOLD}
                                    onChange={(e) => handleChange('CONFIDENCE_THRESHOLD', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium">IoU Threshold</label>
                                    <span className="text-sm text-muted-foreground">{config.IOU_THRESHOLD}</span>
                                </div>
                                <input
                                    type="range"
                                    className="w-full accent-primary"
                                    min="0" max="1" step="0.05"
                                    value={config.IOU_THRESHOLD}
                                    onChange={(e) => handleChange('IOU_THRESHOLD', parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-amber-500" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <CardDescription>Manage alert channels and frequency.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium">Email Alerts</label>
                                <p className="text-xs text-muted-foreground">Receive daily summaries via email.</p>
                            </div>
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={config.ENABLE_EMAIL_ALERTS}
                                onChange={(e) => handleChange('ENABLE_EMAIL_ALERTS', e.target.checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium">Real-time WebSockets</label>
                                <p className="text-xs text-muted-foreground">Live updates on the dashboard.</p>
                            </div>
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={config.ENABLE_WEBSOCKET_ALERTS}
                                onChange={(e) => handleChange('ENABLE_WEBSOCKET_ALERTS', e.target.checked)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
