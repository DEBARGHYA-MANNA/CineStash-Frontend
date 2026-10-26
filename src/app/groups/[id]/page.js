'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Users, Film, Check, Eye, Trash2,
    Plus, Search, Loader2, UserMinus,
} from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function GroupDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQ, setSearchQ] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const fetchGroup = useCallback(async () => {
        try {
            const res = await api.get(`/groups/${id}`);
            setGroup(res.data?.data);
        } catch {
            toast.error('Group not found');
            router.push('/groups');
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => { fetchGroup(); }, [fetchGroup]);

    const searchContent = async (q) => {
        if (!q.trim() || q.length < 2) { setSearchResults([]); return; }
        setSearching(true);
        try {
            const [movies, tv] = await Promise.allSettled([
                api.get('/search/movies', { params: { query: q } }),
                api.get('/search/tv', { params: { query: q } }),
            ]);
            const extract = (r) => (r.status === 'fulfilled' ? (Array.isArray(r.value.data?.data) ? r.value.data.data : r.value.data?.data?.results || []) : []);
            setSearchResults([...extract(movies), ...extract(tv)].slice(0, 8));
        } catch { setSearchResults([]); }
        finally { setSearching(false); }
    };

    useEffect(() => {
        const t = setTimeout(() => searchContent(searchQ), 400);
        return () => clearTimeout(t);
    }, [searchQ]);

    const addItem = async (item) => {
        try {
            await api.post(`/groups/${id}/items`, {
                contentId: String(item.id),
                contentType: item.type,
                title: item.title,
                posterUrl: item.posterUrl,
                overview: item.overview,
            });
            toast.success('Added to vault');
            setSearchResults([]);
            setSearchQ('');
            fetchGroup();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add');
        }
    };

    const markWatched = async (itemId) => {
        try {
            await api.put(`/groups/${id}/items/${itemId}/watch`);
            toast.success('Marked as watched');
            fetchGroup();
        } catch { toast.error('Failed'); }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/groups/${id}/items/${itemId}`);
            toast.success('Removed');
            fetchGroup();
        } catch { toast.error('Failed'); }
    };

    const removeMember = async (userId) => {
        if (!confirm('Remove this member?')) return;
        try {
            await api.delete(`/groups/${id}/members/${userId}`);
            toast.success('Member removed');
            fetchGroup();
        } catch { toast.error('Failed'); }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="h-8 w-48 skeleton rounded mb-6" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    if (!group) return null;

    return (
        <div className="min-h-screen bg-dark-bg py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <button onClick={() => router.push('/groups')} className="flex items-center gap-1 text-gray-400 hover:text-white mb-4 text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Groups
                    </button>
                    <h1 className="text-3xl font-heading font-bold text-white mb-1">{group.name}</h1>
                    {group.description && <p className="text-gray-400">{group.description}</p>}
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {group.members?.length || 0}</span>
                        <span className="flex items-center gap-1"><Film className="w-4 h-4" /> {group.items?.length || 0} items</span>
                    </div>
                </motion.div>

                {/* Members */}
                {group.members?.length > 0 && (
                    <div className="mb-8 p-4 bg-dark-surface border border-dark-border rounded-xl">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">Members</h3>
                        <div className="flex flex-wrap gap-2">
                            {group.members.map((m) => {
                                const u = m.user || m;
                                return (
                                    <div key={u._id || m._id} className="flex items-center gap-2 px-3 py-1.5 bg-dark-bg border border-dark-border rounded-lg">
                                        <span className="text-sm text-white">{u.name}</span>
                                        <span className="text-xs text-gray-500 font-mono">{u.uniqueId}</span>
                                        {m.role !== 'admin' && (
                                            <button onClick={() => removeMember(u._id)} className="text-gray-500 hover:text-accent-red">
                                                <UserMinus className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Add Content */}
                <div className="mb-8 relative">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                            placeholder="Add movies or TV shows to this vault..."
                            className="w-full pl-11 pr-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-all"
                        />
                        {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />}
                    </div>
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-surface border border-dark-border rounded-xl overflow-hidden z-20 max-h-80 overflow-y-auto shadow-xl">
                            {searchResults.map((item) => (
                                <button
                                    key={`${item.type}-${item.id}`}
                                    onClick={() => addItem(item)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-hover transition-colors text-left border-b border-dark-border last:border-0"
                                >
                                    {item.posterUrl ? (
                                        <img src={item.posterUrl} alt="" className="w-8 h-12 object-cover rounded" />
                                    ) : (
                                        <Film className="w-8 h-8 text-gray-600" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{item.title}</p>
                                        <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                                    </div>
                                    <Plus className="w-4 h-4 text-accent-gold shrink-0" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Vault Items */}
                {group.items?.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {group.items.map((item, i) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="relative group bg-dark-surface border border-dark-border rounded-xl overflow-hidden"
                            >
                                <div className="aspect-[2/3] bg-dark-bg relative">
                                    {item.posterUrl ? (
                                        <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><Film className="w-8 h-8 text-gray-600" /></div>
                                    )}
                                    {item.watchedBy?.length > 0 && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-accent-green/90 rounded text-xs text-white font-medium flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Watched
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <p className="text-white text-sm font-medium truncate">{item.title}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <button
                                            onClick={() => markWatched(item._id)}
                                            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-accent-green/15 text-accent-green rounded text-xs hover:bg-accent-green/25 transition-all"
                                        >
                                            <Eye className="w-3 h-3" /> Watched
                                        </button>
                                        <button
                                            onClick={() => removeItem(item._id)}
                                            className="p-1.5 text-gray-500 hover:text-accent-red hover:bg-accent-red/10 rounded transition-all"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">This vault is empty. Search above to add content.</p>
                    </div>
                )}
            </div>
        </div>
    );
}