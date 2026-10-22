'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Star, Calendar, Clock, Film, Tv, Sparkles, Play, ExternalLink, Users, Loader2,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import api from '@/services/api';
import WatchlistButton from '@/components/content/WatchlistButton';
import EpisodeTracker from '@/components/content/EpisodeTracker';
import ContentCard from '@/components/content/ContentCard';
import { formatDate, formatRuntime, formatNumber } from '@/utils/helpers';

const typeIcons = { movie: Film, tv: Tv, anime: Sparkles };

export default function DetailsPage() {
    const { type, id } = useParams();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const TypeIcon = typeIcons[type] || Film;

    useEffect(() => {
        fetchDetails();
    }, [type, id]);

    const fetchDetails = async () => {
        try {
            const res = await api.get(`/search/details/${type}/${id}`);
            setContent({ ...res.data.data, type });
        } catch (err) {
            setError('Content not found');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-accent-gold" />
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-500">{error}</p>
            </div>
        );
    }

    const isSeries = type === 'tv' || type === 'anime';

    return (
        <div>
            {/* Hero / Backdrop */}
            <div className="relative h-[70vh] overflow-hidden">
                {content.backdropUrl || content.bannerUrl ? (
                    <Image
                        src={content.backdropUrl || content.bannerUrl}
                        alt={content.title}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                ) : (
                    <div className={`w-full h-full ${isDark ? 'bg-dark-surface' : 'bg-light-surface'}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative -mt-96 z-10 max-w-7xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
                    {/* Poster */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-auto md:mx-0 w-full max-w-[300px]"
                    >
                        <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-accent-gold/20">
                            {content.posterUrl ? (
                                <Image
                                    src={content.posterUrl}
                                    alt={content.title}
                                    width={300}
                                    height={450}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full bg-dark-surface flex items-center justify-center">
                                    <TypeIcon className="w-24 h-24 opacity-30" />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Type Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs font-bold mb-3">
                            <TypeIcon className="w-3.5 h-3.5" />
                            {type.toUpperCase()}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-white mb-2 drop-shadow-xl">
                            {content.title}
                        </h1>

                        {content.tagline && (
                            <p className="text-lg text-accent-gold italic mb-4">&ldquo;{content.tagline}&rdquo;</p>
                        )}

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-300">
                            {content.rating > 0 && (
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-accent-gold text-accent-gold" />
                                    <span className="font-bold">{content.rating.toFixed(1)}</span>
                                    {content.voteCount && <span className="text-gray-500">({formatNumber(content.voteCount)})</span>}
                                </div>
                            )}
                            {(content.releaseDate || content.firstAirDate) && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(content.releaseDate || content.firstAirDate)}
                                </div>
                            )}
                            {content.runtime && (
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatRuntime(content.runtime)}
                                </div>
                            )}
                            {content.numberOfSeasons && (
                                <div className="flex items-center gap-1">
                                    <Tv className="w-4 h-4" />
                                    {content.numberOfSeasons} Season{content.numberOfSeasons > 1 ? 's' : ''}
                                </div>
                            )}
                            {content.episodes && (
                                <div className="flex items-center gap-1">
                                    <Play className="w-4 h-4" />
                                    {content.episodes} Episodes
                                </div>
                            )}
                        </div>

                        {/* Genres */}
                        {content.genres && content.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {content.genres.map((genre, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium border border-white/20"
                                    >
                                        {typeof genre === 'string' ? genre : genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Overview */}
                        <p className="text-gray-300 leading-relaxed mb-6 max-w-3xl">
                            {content.overview || 'No overview available.'}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <WatchlistButton content={content} />
                            {content.trailerUrl && (
                                <a
                                    href={content.trailerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-red hover:bg-accent-red/90 text-white font-semibold transition-all hover-glow"
                                >
                                    <Play className="w-5 h-5 fill-white" />
                                    Watch Trailer
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Episode Tracker */}
                {isSeries && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12"
                    >
                        <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                            <Play className="w-6 h-6 text-accent-gold" />
                            Episode Tracker
                        </h2>
                        <EpisodeTracker
                            seriesId={id}
                            seriesType={type}
                            seasons={content.seasons}
                            totalEpisodes={content.numberOfEpisodes || content.episodes}
                        />
                    </motion.div>
                )}

                {/* Cast */}
                {content.cast && content.cast.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12"
                    >
                        <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6 text-accent-gold" />
                            Cast
                        </h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {content.cast.slice(0, 8).map((member) => (
                                <div key={member.id} className="text-center">
                                    <div className="aspect-square rounded-full overflow-hidden mb-2 border-2 border-dark-border">
                                        {member.profileUrl ? (
                                            <Image
                                                src={member.profileUrl}
                                                alt={member.name}
                                                width={100}
                                                height={100}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-dark-surface flex items-center justify-center">
                                                <Users className="w-6 h-6 opacity-30" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs font-semibold truncate">{member.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{member.character}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Characters (Anime) */}
                {content.characters && content.characters.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12"
                    >
                        <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6 text-accent-gold" />
                            Characters
                        </h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {content.characters.slice(0, 8).map((char) => (
                                <div key={char.id} className="text-center">
                                    <div className="aspect-square rounded-full overflow-hidden mb-2 border-2 border-dark-border">
                                        {char.imageUrl ? (
                                            <Image
                                                src={char.imageUrl}
                                                alt={char.name}
                                                width={100}
                                                height={100}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-dark-surface flex items-center justify-center">
                                                <Users className="w-6 h-6 opacity-30" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs font-semibold truncate">{char.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{char.role}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Recommendations */}
                {content.recommendations && content.recommendations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12"
                    >
                        <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-accent-gold" />
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {content.recommendations.slice(0, 6).map((rec, i) => (
                                <ContentCard key={`${rec.type}-${rec.id}`} item={rec} index={i} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* External Links (Anime) */}
                {content.externalLinks && content.externalLinks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12"
                    >
                        <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                            <ExternalLink className="w-6 h-6 text-accent-gold" />
                            External Links
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {content.externalLinks.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:border-accent-gold ${isDark ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'
                                        }`}
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    <span className="text-sm">{link.site}</span>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}