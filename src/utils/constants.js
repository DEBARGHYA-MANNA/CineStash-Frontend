import { Film, Tv, Sparkles, Gamepad2, BookOpen } from 'lucide-react';

export const CONTENT_TYPES = [
    { value: 'movie', label: 'Movies', icon: Film, color: '#f59e0b' },
    { value: 'tv', label: 'TV Shows', icon: Tv, color: '#3b82f6' },
    { value: 'anime', label: 'Anime', icon: Sparkles, color: '#e94560' },
    { value: 'game', label: 'Games', icon: Gamepad2, color: '#22c55e' },
    { value: 'book', label: 'Books', icon: BookOpen, color: '#a855f7' },
];

export const WATCHLIST_STATUSES = [
    { value: 'want_to_watch', label: 'Want to Watch', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { value: 'currently_watching', label: 'Currently Watching', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { value: 'watched', label: 'Watched', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
    { value: 'dropped', label: 'Dropped', color: '#e94560', bg: 'rgba(233, 69, 96, 0.1)' },
];

export const REFERRAL_TIERS = {
    bronze: { label: 'Bronze', min: 0, color: '#cd7f32' },
    silver: { label: 'Silver', min: 5, color: '#c0c0c0' },
    gold: { label: 'Gold', min: 10, color: '#ffd700' },
    platinum: { label: 'Platinum', min: 25, color: '#e5e4e2' },
    diamond: { label: 'Diamond', min: 50, color: '#b9f2ff' },
};

export const SORT_OPTIONS = [
    { value: 'updatedAt', label: 'Recently Updated' },
    { value: 'createdAt', label: 'Recently Added' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'rating', label: 'Rating' },
];