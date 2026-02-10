import React from "react"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 overflow-hidden relative">
            {/* Global Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none z-0" />
            <div className="absolute top-0 left-1/4 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden relative z-10">
                <TopBar />
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
                    <div className="mx-auto max-w-[1600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout
