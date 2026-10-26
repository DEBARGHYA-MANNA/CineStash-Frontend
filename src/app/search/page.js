// src/app/search/page.js
'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Film, Tv, Sparkles, X, Loader2 } from 'lucide-react';
import ContentCard from '@/components/content/ContentCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import api from '@/services/api';

const CATEGORIES = [
    { key: 'all', label: 'All', icon: Sparkles },
    { key: 'movie', label: 'Movies', icon: Film },
    { key: 'tv', label: 'TV Shows', icon: Tv },
    { key: 'anime', label: 'Anime', icon: Sparkles },
];

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('cat') || 'all';

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchInput, setSearchInput] = useState(query);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const lastSearchRef = useRef('');

    const fetchPage = useCallback(async (q, cat, pageNum, append = false) => {
        if (!q.trim()) {
            setResults([]);
            setTotalCount(0);
            setHasMore(false);
            return;
        }

        if (append) setLoadingMore(true);
        else setLoading(true);

        try {
            const extract = (res) => {
                const d = res?.data?.data;
                const items = Array.isArray(d) ? d : d?.results || [];
                const pagination = res?.data?.pagination || {};
                return { items, pagination };
            };

            if (cat === 'all') {
                const [movies, tv, anime] = await Promise.allSettled([
                    api.get('/search/movies', { params: { query: q, page: pageNum } }),
                    api.get('/search/tv', { params: { query: q, page: pageNum } }),
                    api.get('/search/anime', { params: { query: q, page: pageNum } }),
                ]);

                let allItems = [];
                let total = 0;
                let anyHasMore = false;

                [movies, tv, anime].forEach((result) => {
                    if (result.status === 'fulfilled') {
                        const { items, pagination } = extract(result.value);
                        allItems.push(...items);
                        total += pagination.totalResults || items.length;
                        if (pagination.currentPage < pagination.totalPages) anyHasMore = true;
                    }
                });

                setResults((prev) => (append ? [...prev, ...allItems] : allItems));
                setTotalCount(total);
                setHasMore(anyHasMore);
            } else {
                const endpoint = cat === 'movie' ? 'movies' : cat === 'tv' ? 'tv' : 'anime';
                const res = await api.get(`/search/${endpoint}`, { params: { query: q, page: pageNum } });
                const { items, pagination } = extract(res);

                setResults((prev) => (append ? [...prev, ...items] : items));
                setTotalCount(pagination.totalResults || items.length);
                setHasMore(pagination.currentPage < pagination.totalPages);
            }
        } catch {
            if (!append) setResults([]);
            setTotalCount(0);
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Fire search when query or category changes
    useEffect(() => {
        const searchKey = `${query.trim().toLowerCase()}|${category}`;
        if (searchKey === lastSearchRef.current) return;
        lastSearchRef.current = searchKey;

        setPage(1);
        fetchPage(query, category, 1, false);
    }, [query, category, fetchPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return;
        const params = new URLSearchParams();
        params.set('q', searchInput.trim());
        if (category !== 'all') params.set('cat', category);
        router.push(`/search?${params.toString()}`);
    };

    const setCategory = (cat) => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (cat !== 'all') params.set('cat', cat);
        router.push(`/search?${params.toString()}`);
    };

    const clearSearch = () => {
        setSearchInput('');
        router.push('/search');
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPage(query, category, nextPage, true);
    };

    return (
        <div className="min-h-screen bg-dark-bg py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
                        Search <span className="text-gradient-gold">Content</span>
                    </h1>
                    <p className="text-gray-400">
                        Find movies, TV shows, and anime to add to your stash
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSearch}
                    className="relative mb-6"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search movies, TV shows, anime..."
                            className="w-full pl-12 pr-14 py-4 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all text-lg"
                            autoFocus
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </motion.form>

                {/* Category Tabs — always visible */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = category === cat.key;
                        return (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() => setCategory(cat.key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-accent-gold text-dark-bg'
                                        : 'bg-dark-surface text-gray-300 hover:bg-dark-hover hover:text-white border border-dark-border'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Results */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : query ? (
                    results.length > 0 ? (
                        <>
                            <p className="text-gray-400 mb-4">
                                Found{' '}
                                <span className="text-white font-semibold">
                                    {totalCount.toLocaleString()}
                                </span>{' '}
                                results for &quot;<span className="text-accent-gold">{query}</span>&quot;
                            </p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                            >
                                {results.map((item, index) => (
                                    <motion.div
                                        key={`${item.type}-${item.id}-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(index * 0.02, 0.3) }}
                                    >
                                        <ContentCard item={item} />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Show More */}
                            {hasMore && (
                                <div className="flex justify-center mt-10">
                                    <button
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="flex items-center gap-2 px-8 py-3 bg-dark-surface border border-dark-border text-white rounded-xl hover:bg-dark-hover hover:border-accent-gold transition-all disabled:opacity-50"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            'Show More'
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-heading font-semibold text-white mb-2">
                                No results found
                            </h3>
                            <p className="text-gray-400">
                                Try a different search term or change the category filter
                            </p>
                        </motion.div>
                    )
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-heading font-semibold text-white mb-2">
                            Start searching
                        </h3>
                        <p className="text-gray-400">
                            Type a title above to discover movies, TV shows, and anime
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function SearchFallback() {
    return (
        <div className="min-h-screen bg-dark-bg py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="h-10 w-48 skeleton rounded-lg mb-2" />
                <div className="h-5 w-72 skeleton rounded mb-8" />
                <div className="h-14 w-full skeleton rounded-xl mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchFallback />}>
            <SearchContent />
        </Suspense>
    );
}