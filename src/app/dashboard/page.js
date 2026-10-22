'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Film,
    Tv,
    Sparkles,
    Gamepad2,
    BookOpen,
    List,
    Clock,
    Check,
    X,
    TrendingUp,
    Star,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import api from '@/services/api';
import ContentCard from '@/components/content/ContentCard';
import { SkeletonGrid } from '@/components/ui/SkeletonCard';

export default function DashboardPage() {
    const { isAuthenticated, loading: authLoading, user } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        try {
            const [statsRes, trendingRes] = await Promise.all([
                api.get('/watchlist/stats'),
                api.get('/recommendations/trending'),
            ]);
            setStats(statsRes.data.data);
            setTrending(trendingRes.data.data.results || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-10 h-10 animate-spin text-accent-gold" />
                </div>
            </div>
        );
    }

    const statusCards = [
        { label: 'Want to Watch', value: stats?.byStatus?.want_to_watch || 0, icon: List, color: '#3b82f6' },
        { label: 'Watching', value: stats?.byStatus?.currently_watching || 0, icon: Clock, color: '#f59e0b' },
        { label: 'Watched', value: stats?.byStatus?.watched || 0, icon: Check, color: '#22c55e' },
        { label: 'Dropped', value: stats?.byStatus?.dropped || 0, icon: X, color: '#e94560' },
    ];

    const typeCards = [
        { label: 'Movies', value: stats?.byType?.movie || 0, icon: Film, color: '#f59e0b', type: 'movie' },
        { label: 'TV Shows', value: stats?.byType?.tv || 0, icon: Tv, color: '#3b82f6', type: 'tv' },
        { label: 'Anime', value: stats?.byType?.anime || 0, icon: Sparkles, color: '#e94560', type: 'anime' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl sm:text-4xl font-heading font-black mb-2">
                    Welcome back, <span className="text-gradient-gold">{user?.name}</span>
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your personal content vault awaits. {stats?.totalItems || 0} items tracked.
                </p>
            </motion.div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statusCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-5 hover-glow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${card.color}20` }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                                </div>
                            </div>
                            <div className="text-3xl font-heading font-black mb-1" style={{ color: card.color }}>
                                {card.value}
                            </div>
                            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                                {card.label}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Average Rating */}
            {stats?.averageRating && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 mb-8 flex items-center gap-4"
                >
                    <div className="w-14 h-14 rounded-xl bg-accent-gold/20 flex items-center justify-center">
                        <Star className="w-7 h-7 fill-accent-gold text-accent-gold" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-400">Your Average Rating</div>
                        <div className="text-2xl font-heading font-black text-accent-gold">
                            {stats.averageRating} / 5
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Content Type Breakdown */}
            <div className="mb-10">
                <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                    <List className="w-5 h-5 text-accent-gold" />
                    Your Collection
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {typeCards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={`/watchlist?type=${card.type}`}>
                                    <div className="glass-card p-5 hover-glow group cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                    style={{ backgroundColor: `${card.color}20` }}
                                                >
                                                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-heading font-black" style={{ color: card.color }}>
                                                        {card.value}
                                                    </div>
                                                    <div className="text-sm text-gray-400">{card.label}</div>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-accent-gold group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Recently Watched */}
            {stats?.recentlyWatched && stats.recentlyWatched.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                            <Check className="w-5 h-5 text-accent-green" />
                            Recently Watched
                        </h2>
                        <Link
                            href="/watchlist?status=watched"
                            className="text-sm text-accent-gold hover:underline flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {stats.recentlyWatched.map((item, i) => (
                            <ContentCard
                                key={item._id}
                                item={{
                                    id: item.contentId || item._id,
                                    type: item.contentType,
                                    title: item.title,
                                    posterUrl: item.posterUrl,
                                    rating: item.rating,
                                }}
                                index={i}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Trending */}
            {trending.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-accent-red" />
                            Trending Now
                        </h2>
                        <Link
                            href="/recommendations"
                            className="text-sm text-accent-gold hover:underline flex items-center gap-1"
                        >
                            Discover more <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {trending.slice(0, 10).map((item, i) => (
                            <ContentCard key={`${item.type}-${item.id}`} item={item} index={i} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}