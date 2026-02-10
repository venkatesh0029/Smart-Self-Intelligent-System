import React from "react"
import { Bell, Search, User, Menu, Settings } from "lucide-react"
import { Button } from "../ui/Button"
import { useLocation } from "react-router-dom"

const TopBar = () => {
    const location = useLocation();

    // Format path for breadcrumb
    const getPageTitle = (pathname) => {
        if (pathname === '/') return ['Dashboard', 'Overview'];
        const segment = pathname.substring(1).charAt(0).toUpperCase() + pathname.slice(2);
        return [segment, 'Details'];
    }

    const [section, page] = getPageTitle(location.pathname);

    return (
        <header className="flex h-20 items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md px-8 relative z-40">

            {/* Breadcrumb / Title */}
            <div className="flex flex-col">
                <div className="flex items-center text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                    <span className="hover:text-primary transition-colors cursor-pointer">SSIS</span>
                    <span className="mx-2 text-white/20">/</span>
                    <span className="text-foreground">{section}</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">{page}</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative hidden md:block group">
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search system..."
                        className="h-10 w-72 rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-foreground focus:border-primary/50 focus:bg-white/10 focus:outline-none transition-all placeholder:text-muted-foreground/50"
                    />
                </div>

                <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />

                <Button variant="ghost" size="icon" className="relative hover:bg-white/5 hover:text-primary transition-colors rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />
                </Button>

                <Button variant="ghost" size="icon" className="relative hover:bg-white/5 hover:text-primary transition-colors rounded-full">
                    <Settings className="h-5 w-5" />
                </Button>

                <div className="pl-2 border-l border-white/10 ml-2 flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-medium text-white">Admin User</div>
                        <div className="text-[10px] text-muted-foreground">Operations Manager</div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full bg-gradient-to-br from-primary to-secondary p-[1px] overflow-hidden hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                        </div>
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default TopBar
