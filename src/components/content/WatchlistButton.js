'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { WATCHLIST_STATUSES } from '@/utils/constants';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function WatchlistButton({ content }) {
    const { theme } = useTheme();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const isDark = theme === 'dark';
    const [inWatchlist, setInWatchlist] = useState(false);
    const [watchlistItem, setWatchlistItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            checkWatchlist();
        } else {
            setLoading(false);
        }
    }, [content.id, content.type, isAuthenticated]);

    const checkWatchlist = async () => {
        try {
            const res = await api.get(`/watchlist/check/${content.type}/${content.id}`);
            setInWatchlist(res.data.data.inWatchlist);
            setWatchlistItem(res.data.data.item);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (status) => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        setAdding(true);
        setDropdownOpen(false);

        try {
            const res = await api.post('/watchlist', {
                contentId: String(content.id),
                contentType: content.type,
                title: content.title,
                posterUrl: content.posterUrl,
                overview: content.overview,
                status,
                metadata: {
                    releaseDate: content.releaseDate || content.firstAirDate,
                    genres: content.genres?.map((g) => g.name || g) || [],
                    runtime: content.runtime,
                    totalEpisodes: content.numberOfEpisodes || content.episodes,
                    totalSeasons: content.numberOfSeasons,
                },
            });
            setInWatchlist(true);
            setWatchlistItem(res.data.data);
            toast.success(`Added to ${WATCHLIST_STATUSES.find((s) => s.value === status).label}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add');
        } finally {
            setAdding(false);
        }
    };

    const handleUpdate = async (status) => {
        setAdding(true);
        setDropdownOpen(false);

        try {
            const res = await api.put(`/watchlist/${watchlistItem._id}`, { status });
            setWatchlistItem(res.data.data);
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update');
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async () => {
        setAdding(true);
        setDropdownOpen(false);

        try {
            await api.delete(`/watchlist/${watchlistItem._id}`);
            setInWatchlist(false);
            setWatchlistItem(null);
            toast.success('Removed from watchlist');
        } catch (error) {
            toast.error('Failed to remove');
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <button disabled className="px-6 py-3 rounded-xl bg-gray-700 text-gray-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
            </button>
        );
    }

    const currentStatus = watchlistItem
        ? WATCHLIST_STATUSES.find((s) => s.value === watchlistItem.status)
        : null;

    return (
        <div className="relative">
            <button
                onClick={() => (inWatchlist ? setDropdownOpen(!dropdownOpen) : handleAdd('want_to_watch'))}
                disabled={adding}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${inWatchlist
                        ? isDark
                            ? 'bg-dark-surface border border-dark-border hover:border-accent-gold'
                            : 'bg-light-surface border border-light-border hover:border-accent-burgundy'
                        : 'bg-gradient-gold text-dark-bg hover:opacity-90 hover-glow'
                    }`}
            >
                {adding ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : inWatchlist ? (
                    <>
                        <Check className="w-5 h-5" style={{ color: currentStatus?.color }} />
                        <span>{currentStatus?.label}</span>
                        <ChevronDown className="w-4 h-4" />
                    </>
                ) : (
                    <>
                        <Plus className="w-5 h-5" />
                        Add to Watchlist
                    </>
                )}
            </button>

            <AnimatePresence>
                {dropdownOpen && inWatchlist && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setDropdownOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute top-full mt-2 right-0 z-50 w-56 rounded-xl border overflow-hidden shadow-2xl ${isDark ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'
                                }`}
                        >
                            {WATCHLIST_STATUSES.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => handleUpdate(status.value)}
                                    className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${watchlistItem?.status === status.value
                                            ? isDark ? 'bg-dark-card' : 'bg-light-card'
                                            : isDark ? 'hover:bg-dark-card' : 'hover:bg-light-card'
                                        }`}
                                >
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: status.color }}
                                    />
                                    <span>{status.label}</span>
                                    {watchlistItem?.status === status.value && (
                                        <Check className="w-4 h-4 ml-auto" style={{ color: status.color }} />
                                    )}
                                </button>
                            ))}
                            <button
                                onClick={handleRemove}
                                className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 text-accent-red transition-colors border-t ${isDark ? 'border-dark-border hover:bg-dark-card' : 'border-light-border hover:bg-light-card'
                                    }`}
                            >
                                Remove from Watchlist
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}