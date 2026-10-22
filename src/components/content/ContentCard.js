'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Film, Tv, Sparkles, Gamepad2, BookOpen, Play } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const typeIcons = {
    movie: Film,
    tv: Tv,
    anime: Sparkles,
    game: Gamepad2,
    book: BookOpen,
};

const typeColors = {
    movie: '#f59e0b',
    tv: '#3b82f6',
    anime: '#e94560',
    game: '#22c55e',
    book: '#a855f7',
};

export default function ContentCard({ item, index = 0 }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const TypeIcon = typeIcons[item.type] || Film;
    const typeColor = typeColors[item.type] || '#f59e0b';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
            whileHover={{ y: -8 }}
            className="group relative"
        >
            <Link href={`/details/${item.type}/${item.id}`}>
                <div className={`relative aspect-[2/3] rounded-xl overflow-hidden border transition-all duration-300 ${isDark
                        ? 'border-dark-border group-hover:border-accent-gold/50'
                        : 'border-light-border group-hover:border-accent-burgundy/50'
                    }`}>
                    {/* Poster */}
                    {item.posterUrl ? (
                        <Image
                            src={item.posterUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                        />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-dark-surface' : 'bg-light-surface'
                            }`}>
                            <TypeIcon className="w-16 h-16 opacity-30" />
                        </div>
                    )}

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Type Badge */}
                    <div
                        className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md backdrop-blur-md text-xs font-semibold"
                        style={{
                            backgroundColor: `${typeColor}30`,
                            color: typeColor,
                            border: `1px solid ${typeColor}60`,
                        }}
                    >
                        <TypeIcon className="w-3 h-3" />
                        {item.type.toUpperCase()}
                    </div>

                    {/* Rating Badge */}
                    {item.rating > 0 && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md text-xs font-semibold text-accent-gold border border-accent-gold/40">
                            <Star className="w-3 h-3 fill-accent-gold" />
                            {item.rating.toFixed(1)}
                        </div>
                    )}

                    {/* Play Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-accent-gold/90 flex items-center justify-center shadow-2xl">
                            <Play className="w-7 h-7 text-dark-bg fill-dark-bg ml-1" />
                        </div>
                    </div>

                    {/* Title & Info at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-heading font-bold text-sm line-clamp-2 drop-shadow-lg">
                            {item.title}
                        </h3>
                        {(item.releaseDate || item.firstAirDate || item.year) && (
                            <p className="text-xs text-gray-300 mt-1">
                                {new Date(item.releaseDate || item.firstAirDate || `${item.year}-01-01`).getFullYear()}
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}