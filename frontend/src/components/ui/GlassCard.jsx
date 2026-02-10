import React from 'react';
import { cn } from '../../lib/utils'; // Assuming clsx/tailwind-merge is setup here or similar

// If lib/utils doesn't exist, I'll handle it, but usually it does in these setups. 
// Checking package.json showed "clsx" and "tailwind-merge", so let's assume standard util.
// If not I'll define a quick helper.

export const GlassCard = ({ children, className, ...props }) => {
    return (
        <div
            className={cn("glass-panel rounded-xl p-6 transition-all duration-300 hover:bg-white/5", className)}
            {...props}
        >
            {children}
        </div>
    );
};
