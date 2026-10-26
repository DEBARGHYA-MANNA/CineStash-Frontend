'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Star, Film, Loader2 } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ContentCard from '@/components/content/ContentCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import toast from 'react-hot-toast';

const TABS = [
    { key: 'trending', label: 'Trending', icon: TrendingUp },
    { key: 'for-you', label: 'For You', icon: Star },
    { key: 'popular', label: 'Popular', icon: Sparkles },
    { key: 'genre', label: 'By Genre', icon: Film },
];

const GENRES = [
    { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' }, { id: 878, name: 'Sci-Fi' }, { id: 53, name: 'Thriller' },
    { id: 10749, name: 'Romance' }, { id: 16, name: 'Animation' }, { id: 80, name: 'Crime' },
    { id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }, { id: 9648, name: 'Mystery' },
];

export default function RecommendationsPage() {
    const { isAuthenticated } = useAuth();
    const [tab, setTab] = useState('trending');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [genreId, setGenreId] = useState(28);

    const fetchRecs = useCallback(async () => {
        setLoading(true);
        try {
            let res;
            if (tab === 'trending') res = await api.get('/recommendations/trending');
            else if (tab === 'for-you') res = await api.get('/recommendations/for-you');
            else if (tab === 'popular') res = await api.get('/recommendations/popular-all');
            else res = await api.get('/recommendations/by-genre', { params: { genreId } });

            const d = res.data?.data;
            setResults(Array.isArray(d) ? d : d?.results || []);
        } catch (err) {
            if (tab === 'for-you' && !isAuthenticated) {
                setResults([]);
            } else {
                toast.error('Failed to load recommendations');
                setResults([]);
            }
        } finally {
            setLoading(false);
        }
    }, [tab, genreId, isAuthenticated]);

    useEffect(() => { fetchRecs(); }, [fetchRecs]);

    return (
        <div className="min-h-screen bg-dark-bg py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-heading font-bold text-white mb-8"
                >
                    <Sparkles className="inline w-8 h-8 text-accent-gold mr-2 -mt-1" />
                    Recommendations
                </motion.h1>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key
                                        ? 'bg-accent-gold text-dark-bg'
                                        : 'bg-dark-surface text-gray-300 hover:bg-dark-hover border border-dark-border'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* Genre Chips */}
                {tab === 'genre' && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {GENRES.map((g) => (
                            <button
                                key={g.id}
                                onClick={() => setGenreId(g.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${genreId === g.id
                                        ? 'bg-accent-gold text-dark-bg'
                                        : 'bg-dark-surface text-gray-400 border border-dark-border hover:text-white hover:border-accent-gold/50'
                                    }`}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* For You login prompt */}
                {tab === 'for-you' && !isAuthenticated && !loading && (
                    <div className="text-center py-20">
                        <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-heading font-semibold text-white mb-2">Login for personalized picks</h3>
                        <p className="text-gray-400">We use your watchlist to recommend content you'll love</p>
                    </div>
                )}

                {/* Results */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : results.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                    >
                        {results.map((item, i) => (
                            <motion.div
                                key={`${item.type}-${item.id}-${i}`}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                            >
                                <ContentCard item={item} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    !(tab === 'for-you' && !isAuthenticated) && (
                        <div className="text-center py-20">
                            <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-heading font-semibold text-white mb-2">Nothing here yet</h3>
                            <p className="text-gray-400">Add items to your watchlist to get better recommendations</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}