import React from 'react';
import { Sidebar } from './Sidebar';

export const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
