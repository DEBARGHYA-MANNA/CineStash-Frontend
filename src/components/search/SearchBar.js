'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function SearchBar({ onSearch, placeholder = 'Search movies, series, anime...', autoFocus = false, initialValue = '' }) {
    const [query, setQuery] = useState(initialValue);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Debounced search
    useEffect(() => {
        const handler = setTimeout(() => {
            if (query.trim().length >= 2) {
                onSearch(query.trim());
            } else if (query.trim().length === 0) {
                onSearch('');
            }
        }, 400);

        return () => clearTimeout(handler);
    }, [query, onSearch]);

    return (
        <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                autoFocus={autoFocus}
                className={`w-full pl-12 pr-12 py-4 rounded-xl border text-base focus:outline-none transition-all ${isDark
                        ? 'bg-dark-surface border-dark-border focus:border-accent-gold text-white placeholder-gray-500'
                        : 'bg-light-surface border-light-border focus:border-accent-burgundy text-gray-900 placeholder-gray-400'
                    }`}
            />
            {query && (
                <button
                    onClick={() => setQuery('')}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-500'
                        }`}
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}