import React from 'react';
import { Button } from './Button';

export const NeonButton = ({ children, variant = "primary", className, ...props }) => {
    const glowColor = variant === 'secondary' ? 'shadow-neon-cyan/50' : 'shadow-neon-purple/50';
    const borderColor = variant === 'secondary' ? 'border-neon-cyan' : 'border-neon-purple';
    const textColor = variant === 'secondary' ? 'text-neon-cyan' : 'text-neon-purple';

    return (
        <Button
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] ${glowColor} ${borderColor} border bg-transparent hover:bg-white/5 ${textColor} ${className || ''}`}
            {...props}
        >
            <span className="relative z-10">{children}</span>
        </Button>
    );
};
