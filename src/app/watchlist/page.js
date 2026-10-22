'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Film, Tv, Sparkles, List, Clock, Check, X, Loader2, Edit2, Trash2, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import api from '@/services/api';
import ContentCard from '@/components/content/ContentCard';
import Modal from '@/components/ui/Modal';
import RatingStars from '@/components/ui/RatingStars';
import { WATCHLIST_STATUSES, CONTENT_TYPES } from '@/utils/constants';
import toast from 'react-hot-toast';

const STATUS_ICONS = {
  all: List,
  want_to_watch: List,
  currently_watching: Clock,
  watched: Check,
  dropped: X,
};

export default function WatchlistPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editItem, setEditItem] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/auth/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchWatchlist();
  }, [isAuthenticated, statusFilter, typeFilter]);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.contentType = typeFilter;

      const res = await api.get('/watchlist', { params });
      setItems(res.data.data || []);
      setStats(res.data.pagination?.statusCounts || {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditRating(item.rating || 0);
    setEditNotes(item.notes || '');
    setEditStatus(item.status);
  };

  const saveEdit = async () => {
    try {
      await api.put(`/watchlist/${editItem._id}`, {
        rating: editRating || null,
        notes: editNotes,
        status: editStatus,
      });
      toast.success('Updated');
      setEditItem(null);
      fetchWatchlist();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Remove from watchlist?')) return;
    try {
      await api.delete(`/watchlist/${id}`);
      toast.success('Removed');
      fetchWatchlist();
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-10 h-10 animate-spin text-accent-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-heading font-black mb-2">
          My <span className="text-gradient-gold">Watchlist</span>
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {stats.total || 0} items in your vault
        </p>
      </motion.div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {['all', ...WATCHLIST_STATUSES.map((s) => s.value)].map((status) => {
          const Icon = STATUS_ICONS[status];
          const statusObj = WATCHLIST_STATUSES.find((s) => s.value === status);
          const count = status === 'all' ? stats.total : stats[status];
          const active = statusFilter === status;

          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-gradient-gold text-dark-bg shadow-lg'
                  : isDark
                    ? 'bg-dark-surface border border-dark-border hover:border-accent-gold/50'
                    : 'bg-light-surface border border-light-border hover:border-accent-burgundy/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {status === 'all' ? 'All' : statusObj?.label}
              {count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-dark-bg/20' : 'bg-white/10'}`}>
                  {count || 0}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Type Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            typeFilter === 'all'
              ? isDark ? 'bg-dark-card text-accent-gold' : 'bg-light-card text-accent-burgundy'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          All Types
        </button>
        {CONTENT_TYPES.slice(0, 3).map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => setTypeFilter(type.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === type.value
                  ? 'bg-accent-gold/20 text-accent-gold'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-accent-gold" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <List className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Your watchlist is empty
          </p>
          <p className="text-sm text-gray-500 mt-1">Start adding movies, shows, and anime!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className={`glass-card p-4 group`}
            >
              <ContentCard
                item={{
                  id: item.contentId,
                  type: item.contentType,
                  title: item.title,
                  posterUrl: item.posterUrl,
                  rating: item.rating,
                }}
                index={0}
              />
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{
                      color: WATCHLIST_STATUSES.find((s) => s.value === item.status)?.color,
                      backgroundColor: WATCHLIST_STATUSES.find((s) => s.value === item.status)?.bg,
                    }}
                  >
                    {WATCHLIST_STATUSES.find((s) => s.value === item.status)?.label}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className={`p-1.5 rounded hover:bg-accent-gold/20 transition-colors`}
                    >
                      <Edit2 className="w-4 h-4 text-accent-gold" />
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className={`p-1.5 rounded hover:bg-accent-red/20 transition-colors`}
                    >
                      <Trash2 className="w-4 h-4 text-accent-red" />
                    </button>
                  </div>
                </div>
                {item.rating && <RatingStars rating={item.rating} size="sm" />}
                {item.notes && (
                  <p className="text-xs text-gray-400 line-clamp-2 italic">
                    &ldquo;{item.notes}&rdquo;
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Item">
        {editItem && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark ? 'bg-dark-bg border-dark-border' : 'bg-light-bg border-light-border'
                }`}
              >
                {WATCHLIST_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Your Rating</label>
              <RatingStars rating={editRating} size="lg" interactive onChange={setEditRating} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Notes</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Your thoughts..."
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark ? 'bg-dark-bg border-dark-border' : 'bg-light-bg border-light-border'
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">{editNotes.length}/500</p>
            </div>
            <button
              onClick={saveEdit}
              className="w-full py-3 rounded-lg bg-gradient-gold text-dark-bg font-semibold hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}