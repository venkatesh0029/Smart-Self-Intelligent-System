import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { useSocket } from '../context/SocketContext';
import { Filter, Search, Package, Plus, ArrowUpDown } from 'lucide-react';
import axios from 'axios';

export const Inventory = () => {
    const { API_URL } = useSocket();
    const [inventory, setInventory] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/api/inventory/inventory`)
            .then(res => setInventory(res.data))
            .catch(err => console.error(err));
    }, [API_URL]);

    const filtered = inventory.filter(item =>
        item.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.shelf_id?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white neon-text mb-2">Inventory Management</h2>
                    <p className="text-muted-foreground">Live stock tracking and mismatch detection.</p>
                </div>
                <NeonButton>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </NeonButton>
            </div>

            <GlassCard className="flex items-center gap-4 p-2">
                <div className="relative flex-1 group">
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products, shelves..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <NeonButton variant="secondary" size="sm" className="h-10">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </NeonButton>
            </GlassCard>

            <GlassCard className="overflow-hidden p-0 border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/40 text-muted-foreground font-medium uppercase text-xs tracking-wider border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors">Product <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                                <th className="px-6 py-4">Shelf Location</th>
                                <th className="px-6 py-4 text-center">In Stock</th>
                                <th className="px-6 py-4 text-center">Expected</th>
                                <th className="px-6 py-4 text-right">System Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-white/5 text-primary group-hover:text-white group-hover:bg-primary/20 transition-colors">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            {item.product?.name || `Product ${item.product_id}`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground font-mono">{item.shelf?.shelf_code}</td>
                                    <td className="px-6 py-4 text-center font-bold text-lg neon-text">{item.actual_quantity}</td>
                                    <td className="px-6 py-4 text-center text-muted-foreground">{item.expected_quantity}</td>
                                    <td className="px-6 py-4 text-right">
                                        {item.mismatch === 0 ? (
                                            <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                                                Synced
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.2)] animate-pulse">
                                                {item.mismatch > 0 ? '+' : ''}{item.mismatch} Mismatch
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};
