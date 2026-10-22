export const CONTENT_TYPES = [
    { value: 'movie', label: 'Movies', icon: '🎬' },
    { value: 'tv', label: 'TV Shows', icon: '📺' },
    { value: 'anime', label: 'Anime', icon: '🎌' },
    { value: 'game', label: 'Games', icon: '🎮' },
    { value: 'book', label: 'Books', icon: '📚' },
];

export const WATCHLIST_STATUSES = [
    { value: 'want_to_watch', label: 'Want to Watch', color: 'blue' },
    { value: 'currently_watching', label: 'Currently Watching', color: 'amber' },
    { value: 'watched', label: 'Watched', color: 'green' },
    { value: 'dropped', label: 'Dropped', color: 'red' },
];

export const REFERRAL_TIERS = {
    bronze: { label: 'Bronze', min: 0, color: '#cd7f32' },
    silver: { label: 'Silver', min: 5, color: '#c0c0c0' },
    gold: { label: 'Gold', min: 10, color: '#ffd700' },
    platinum: { label: 'Platinum', min: 25, color: '#e5e4e2' },
    diamond: { label: 'Diamond', min: 50, color: '#b9f2ff' },
};