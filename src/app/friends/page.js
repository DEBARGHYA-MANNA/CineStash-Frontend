'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, Search, Check, X, UserMinus,
    Loader2, UserCheck, Clock, AlertCircle,
} from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function FriendsPage() {
    const { user } = useAuth();
    const [tab, setTab] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [friendsRes, requestsRes] = await Promise.allSettled([
                api.get('/friends'),
                api.get('/friends/requests'),
            ]);
            if (friendsRes.status === 'fulfilled') setFriends(friendsRes.value.data?.data || []);
            if (requestsRes.status === 'fulfilled') setRequests(requestsRes.value.data?.data || []);
        } catch {
            toast.error('Failed to load friends');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const searchUsers = async (q) => {
        if (!q.trim() || q.trim().length < 3) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await api.get('/users/search', { params: { q: q.trim() } });
            const results = (res.data?.data || []).filter((u) => u._id !== user?._id);
            setSearchResults(results);
        } catch {
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(() => searchUsers(searchQuery), 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const sendRequest = async (userId) => {
        try {
            await api.post('/friends/request', { userId });
            toast.success('Friend request sent');
            setSearchResults((prev) => prev.filter((u) => u._id !== userId));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send request');
        }
    };

    const acceptRequest = async (id) => {
        try {
            await api.put(`/friends/accept/${id}`);
            toast.success('Friend added');
            fetchData();
        } catch {
            toast.error('Failed to accept');
        }
    };

    const rejectRequest = async (id) => {
        try {
            await api.put(`/friends/reject/${id}`);
            toast.success('Request declined');
            fetchData();
        } catch {
            toast.error('Failed to decline');
        }
    };

    const removeFriend = async (id) => {
        try {
            await api.delete(`/friends/${id}`);
            toast.success('Friend removed');
            fetchData();
        } catch {
            toast.error('Failed to remove');
        }
    };

    const tabs = [
        { key: 'friends', label: 'Friends', icon: Users, count: friends.length },
        { key: 'requests', label: 'Requests', icon: Clock, count: requests.length },
    ];

    return (
        <div className="min-h-screen bg-dark-bg py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-heading font-bold text-white mb-8"
                >
                    <Users className="inline w-8 h-8 text-accent-gold mr-2 -mt-1" />
                    Friends
                </motion.h1>

                {/* Search Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or unique ID (e.g. DEB-7X9K2)..."
                            className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-all"
                        />
                        {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />}
                    </div>

                    <AnimatePresence>
                        {searchResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-2 bg-dark-surface border border-dark-border rounded-xl overflow-hidden"
                            >
                                {searchResults.map((u) => (
                                    <div key={u._id} className="flex items-center justify-between px-4 py-3 border-b border-dark-border last:border-0 hover:bg-dark-hover transition-colors">
                                        <div>
                                            <p className="text-white font-medium">{u.name}</p>
                                            <p className="text-xs text-gray-400 font-mono">{u.uniqueId}</p>
                                        </div>
                                        <button
                                            onClick={() => sendRequest(u._id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-gold/15 text-accent-gold rounded-lg text-sm hover:bg-accent-gold/25 transition-all"
                                        >
                                            <UserPlus className="w-4 h-4" /> Add
                                        </button>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {tabs.map((t) => {
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key
                                        ? 'bg-accent-gold text-dark-bg'
                                        : 'bg-dark-surface text-gray-300 hover:bg-dark-hover border border-dark-border'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {t.label}
                                {t.count > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${tab === t.key ? 'bg-dark-bg/20' : 'bg-accent-gold/20 text-accent-gold'
                                        }`}>
                                        {t.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : tab === 'friends' ? (
                    friends.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {friends.map((f) => {
                                const friend = f.user || f;
                                return (
                                    <motion.div
                                        key={f._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center justify-between p-4 bg-dark-surface border border-dark-border rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center">
                                                <UserCheck className="w-5 h-5 text-accent-gold" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{friend.name}</p>
                                                <p className="text-xs text-gray-400 font-mono">{friend.uniqueId}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFriend(f._id)}
                                            className="p-2 text-gray-400 hover:text-accent-red hover:bg-accent-red/10 rounded-lg transition-all"
                                            title="Remove friend"
                                        >
                                            <UserMinus className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState icon={Users} title="No friends yet" desc="Search for users above and send friend requests" />
                    )
                ) : (
                    requests.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {requests.map((r) => {
                                const from = r.requester || r;
                                return (
                                    <motion.div
                                        key={r._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center justify-between p-4 bg-dark-surface border border-dark-border rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center">
                                                <UserPlus className="w-5 h-5 text-accent-blue" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{from.name}</p>
                                                <p className="text-xs text-gray-400 font-mono">{from.uniqueId}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => acceptRequest(r._id)}
                                                className="p-2 text-accent-green hover:bg-accent-green/10 rounded-lg transition-all"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => rejectRequest(r._id)}
                                                className="p-2 text-accent-red hover:bg-accent-red/10 rounded-lg transition-all"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState icon={Clock} title="No pending requests" desc="You're all caught up" />
                    )
                )}
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, title, desc }) {
    return (
        <div className="text-center py-16">
            <Icon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-heading font-semibold text-white mb-1">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
        </div>
    );
}