import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, trend, trendValue, icon: Icon, color = "text-primary" }) => {
    return (
        <GlassCard className="relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">{title}</h3>
                    <div className="text-3xl font-bold mt-2 neon-text">{value}</div>
                </div>
                {Icon && (
                    <div className={`p-3 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>

            {(trend || trendValue) && (
                <div className="flex items-center text-xs">
                    {trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                    )}
                    <span className={trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                        {trendValue}
                    </span>
                    <span className="text-muted-foreground ml-2">vs last week</span>
                </div>
            )}

            {/* Background Glow */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 ${color.replace('text-', 'bg-')}/20 blur-3xl rounded-full group-hover:bg-${color.replace('text-', '')}/30 transition-all duration-500`} />
        </GlassCard>
    );
};
