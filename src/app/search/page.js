'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Tv, Sparkles, Search as SearchIcon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import api from '@/services/api';
import SearchBar from '@/components/search/SearchBar';
import ContentCard from '@/components/content/ContentCard';
import { SkeletonGrid } from '@/components/ui/SkeletonCard';

const SEARCH_TYPES = [
    { value: 'movie', label: 'Movies', icon: Film, endpoint: '/search/movies' },
    { value: 'tv', label: 'TV Shows', icon: Tv, endpoint: '/search/tv' },
    { value: 'anime', label: 'Anime', icon: Sparkles, endpoint: '/search/anime' },
];

export default function SearchPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeType, setActiveType] = useState('movie');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (searchQuery) => {
        if (!searchQuery) {
            setResults([]);
            setSearched(false);
            return;
        }

        setQuery(searchQuery);
        setLoading(true);
        setSearched(true);

        try {
            const endpoint = SEARCH_TYPES.find((t) => t.value === activeType).endpoint;
            const res = await api.get(endpoint, { params: { query: searchQuery } });
            setResults(res.data.data || []);
        } catch (error) {
            console.error(error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Re-search when type changes
    useEffect(() => {
        if (query) handleSearch(query);
    }, [activeType]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl sm:text-5xl font-heading font-black mb-3">
                    Find Your Next <span className="text-gradient-gold">Obsession</span>
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Search across movies, TV shows, and anime
                </p>
            </motion.div>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-6">
                <SearchBar
                    onSearch={handleSearch}
                    placeholder={`Search ${SEARCH_TYPES.find((t) => t.value === activeType).label.toLowerCase()}...`}
                    autoFocus
                />
            </div>

            {/* Type Tabs */}
            <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto">
                {SEARCH_TYPES.map((type) => {
                    const Icon = type.icon;
                    const active = activeType === type.value;
                    return (
                        <button
                            key={type.value}
                            onClick={() => setActiveType(type.value)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${active
                                    ? 'bg-gradient-gold text-dark-bg shadow-lg'
                                    : isDark
                                        ? 'bg-dark-surface border border-dark-border hover:border-accent-gold/50'
                                        : 'bg-light-surface border border-light-border hover:border-accent-burgundy/50'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {type.label}
                        </button>
                    );
                })}
            </div>

            {/* Results */}
            {loading ? (
                <SkeletonGrid count={10} />
            ) : !searched ? (
                <div className="text-center py-16">
                    <SearchIcon className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                    <p className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Start typing to discover content
                    </p>
                </div>
            ) : results.length === 0 ? (
                <div className="text-center py-16">
                    <SearchIcon className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                    <p className={`text-lg mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No results found for &quot;{query}&quot;
                    </p>
                    <p className="text-sm text-gray-500">Try a different search term</p>
                </div>
            ) : (
                <>
                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Found <span className="text-accent-gold font-semibold">{results.length}</span> results for &quot;{query}&quot;
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {results.map((item, i) => (
                            <ContentCard key={`${item.type}-${item.id}`} item={item} index={i} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}