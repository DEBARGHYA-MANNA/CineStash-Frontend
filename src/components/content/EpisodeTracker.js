'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function EpisodeTracker({ seriesId, seriesType, seasons = [], totalEpisodes }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [progress, setProgress] = useState({});
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchProgress();
  }, [seriesId, seriesType]);

  const fetchProgress = async () => {
    try {
      const res = await api.get(`/episodes/${seriesType}/${seriesId}`);
      const episodes = res.data.data.episodes || [];
      const map = {};
      episodes.forEach((ep) => {
        map[`${ep.seasonNumber}-${ep.episodeNumber}`] = ep.watched;
      });
      setProgress(map);
    } catch (error) {
      console.error('Failed to fetch progress', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEpisode = async (seasonNum, epNum) => {
    const key = `${seasonNum}-${epNum}`;
    const currentWatched = progress[key] || false;
    const newWatched = !currentWatched;

    setUpdating({ ...updating, [key]: true });
    setProgress({ ...progress, [key]: newWatched });

    try {
      await api.put(`/episodes/${seriesType}/${seriesId}/season/${seasonNum}/episode/${epNum}`, {
        watched: newWatched,
      });
    } catch (error) {
      toast.error('Failed to update episode');
      setProgress({ ...progress, [key]: currentWatched });
    } finally {
      setUpdating({ ...updating, [key]: false });
    }
  };

  const markSeasonComplete = async (seasonNum, episodeCount) => {
    try {
      await api.put(`/episodes/${seriesType}/${seriesId}/bulk`, {
        markAllUpTo: { season: seasonNum, episode: episodeCount },
      });
      toast.success(`Season ${seasonNum} marked complete`);
      fetchProgress();
    } catch (error) {
      toast.error('Failed to update season');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-accent-gold" />
      </div>
    );
  }

  // Build display seasons
  const displaySeasons = seasons.length > 0
    ? seasons.filter((s) => s.seasonNumber > 0)
    : [{ seasonNumber: 1, episodeCount: totalEpisodes || 12, name: 'Season 1' }];

  const totalWatched = Object.values(progress).filter(Boolean).length;
  const totalPossible = displaySeasons.reduce((sum, s) => sum + (s.episodeCount || 0), 0);
  const overallProgress = totalPossible > 0 ? Math.round((totalWatched / totalPossible) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Overall Progress */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-dark-surface' : 'bg-light-surface'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Overall Progress</span>
          <span className="text-sm text-accent-gold font-bold">
            {totalWatched} / {totalPossible} episodes
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-dark-bg' : 'bg-light-bg'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-gold"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{overallProgress}% completed</p>
      </div>

      {/* Seasons */}
      {displaySeasons.map((season) => {
        const seasonEpisodes = Array.from({ length: season.episodeCount || 0 }, (_, i) => i + 1);
        const seasonWatched = seasonEpisodes.filter(
          (ep) => progress[`${season.seasonNumber}-${ep}`]
        ).length;
        const seasonPercent = seasonEpisodes.length > 0
          ? Math.round((seasonWatched / seasonEpisodes.length) * 100)
          : 0;
        const isExpanded = expandedSeason === season.seasonNumber;

        return (
          <div
            key={season.seasonNumber}
            className={`rounded-xl border overflow-hidden ${
              isDark ? 'border-dark-border bg-dark-surface' : 'border-light-border bg-light-surface'
            }`}
          >
            <button
              onClick={() => setExpandedSeason(isExpanded ? null : season.seasonNumber)}
              className={`w-full flex items-center justify-between p-4 transition-colors ${
                isDark ? 'hover:bg-dark-card' : 'hover:bg-light-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{
                    backgroundColor: seasonPercent === 100 ? '#22c55e30' : '#f59e0b20',
                    color: seasonPercent === 100 ? '#22c55e' : '#f59e0b',
                  }}
                >
                  S{season.seasonNumber}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">{season.name || `Season ${season.seasonNumber}`}</div>
                  <div className="text-xs text-gray-500">
                    {seasonWatched} / {seasonEpisodes.length} watched ({seasonPercent}%)
                  </div>
                </div>
              </div>
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={`p-4 border-t ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
                    <div className="flex justify-end mb-3">
                      <button
                        onClick={() => markSeasonComplete(season.seasonNumber, season.episodeCount)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-accent-gold/10 text-accent-gold hover:bg-accent-gold/20 transition-colors font-medium"
                      >
                        Mark All Watched
                      </button>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                      {seasonEpisodes.map((epNum) => {
                        const key = `${season.seasonNumber}-${epNum}`;
                        const watched = progress[key] || false;
                        const isUpdating = updating[key];

                        return (
                          <button
                            key={epNum}
                            onClick={() => toggleEpisode(season.seasonNumber, epNum)}
                            disabled={isUpdating}
                            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all relative ${
                              watched
                                ? 'bg-accent-green text-white shadow-lg scale-100'
                                : isDark
                                  ? 'bg-dark-bg hover:bg-dark-card border border-dark-border'
                                  : 'bg-light-bg hover:bg-light-card border border-light-border'
                            } ${isUpdating ? 'opacity-50' : 'hover:scale-110'}`}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : watched ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              epNum
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}