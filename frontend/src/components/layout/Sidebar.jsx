import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { LayoutDashboard, MonitorPlay, BarChart3, PackageSearch, Bell, Settings, LogOut, Box, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"

const Sidebar = () => {
    const location = useLocation();
    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
        { icon: MonitorPlay, label: "Live Monitor", path: "/live" },
        { icon: PackageSearch, label: "Inventory", path: "/inventory" },
        { icon: BarChart3, label: "Analytics", path: "/analytics" },
        { icon: Bell, label: "Alerts", path: "/alerts" },
        { icon: Settings, label: "Configuration", path: "/config" },
    ]

    return (
        <div className="flex h-screen w-72 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl text-card-foreground transition-all duration-300 relative overflow-hidden z-50">

            {/* Header / Brand */}
            <div className="flex h-20 items-center px-6 border-b border-white/5 relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 p-2 rounded-lg bg-primary/20 mr-3 shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                    <Box className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col z-10">
                    <span className="text-xl font-bold tracking-tight text-white neon-text">SSIS</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Enterprise AI</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-1 px-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/20 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] border border-primary/20"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                )
                            }
                        >
                            <div className="flex items-center relative z-10">
                                <item.icon className={cn("mr-3 h-5 w-5 transition-colors",
                                    location.pathname === item.path ? "text-primary-foreground" : "text-muted-foreground group-hover:text-white"
                                )} />
                                {item.label}
                            </div>

                            {/* Active Indicator Arrow */}
                            {location.pathname === item.path && (
                                <ChevronRight className="h-4 w-4 text-primary animate-pulse relative z-10" />
                            )}

                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Footer / User Profile */}
            <div className="border-t border-white/10 p-4 bg-black/20">
                <button className="flex w-full items-center rounded-xl p-3 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive group border border-transparent hover:border-destructive/20">
                    <div className="p-1.5 rounded-full bg-destructive/10 mr-3 group-hover:animate-bounce">
                        <LogOut className="h-4 w-4" />
                    </div>
                    Sign Out
                </button>
            </div>

            {/* Background Glow Effect */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />
        </div>
    )
}

export default Sidebar
