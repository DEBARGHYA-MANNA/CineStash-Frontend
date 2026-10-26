'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FolderOpen, Plus, Users, Film, X, Loader2, Trash2,
} from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function GroupsPage() {
    const router = useRouter();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [friends, setFriends] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [creating, setCreating] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [groupsRes, friendsRes] = await Promise.allSettled([
                api.get('/groups'),
                api.get('/friends'),
            ]);
            if (groupsRes.status === 'fulfilled') setGroups(groupsRes.value.data?.data || []);
            if (friendsRes.status === 'fulfilled') setFriends(friendsRes.value.data?.data || []);
        } catch {
            toast.error('Failed to load groups');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const toggleMember = (userId) => {
        setSelectedMembers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const createGroup = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Group name is required');
        setCreating(true);
        try {
            await api.post('/groups', {
                name: name.trim(),
                description: description.trim(),
                memberIds: selectedMembers,
            });
            toast.success('Group created');
            setShowCreate(false);
            setName('');
            setDescription('');
            setSelectedMembers([]);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create group');
        } finally {
            setCreating(false);
        }
    };

    const deleteGroup = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Delete this group vault?')) return;
        try {
            await api.delete(`/groups/${id}`);
            toast.success('Group deleted');
            fetchData();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
                        <FolderOpen className="inline w-8 h-8 text-accent-gold mr-2 -mt-1" />
                        Group Vaults
                    </h1>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-accent-gold text-dark-bg rounded-lg font-semibold hover:bg-accent-amber transition-all"
                    >
                        <Plus className="w-4 h-4" /> New Group
                    </button>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : groups.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groups.map((g, i) => (
                            <motion.div
                                key={g._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => router.push(`/groups/${g._id}`)}
                                className="relative p-5 bg-dark-surface border border-dark-border rounded-xl cursor-pointer hover:border-accent-gold/50 hover:bg-dark-hover transition-all group"
                            >
                                <button
                                    onClick={(e) => deleteGroup(g._id, e)}
                                    className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-accent-red hover:bg-accent-red/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <h3 className="text-lg font-heading font-semibold text-white mb-1 pr-8">{g.name}</h3>
                                {g.description && <p className="text-sm text-gray-400 mb-3 line-clamp-2">{g.description}</p>}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {g.members?.length || 0} members</span>
                                    <span className="flex items-center gap-1"><Film className="w-3.5 h-3.5" /> {g.items?.length || 0} items</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-heading font-semibold text-white mb-2">No group vaults yet</h3>
                        <p className="text-gray-400">Create a group to share watchlists with friends</p>
                    </div>
                )}

                {/* Create Modal */}
                <AnimatePresence>
                    {showCreate && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowCreate(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            >
                                <form onSubmit={createGroup} className="w-full max-w-md bg-dark-surface border border-dark-border rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-heading font-bold text-white">Create Group Vault</h2>
                                        <button type="button" onClick={() => setShowCreate(false)} className="p-1 text-gray-400 hover:text-white">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <input
                                        value={name} onChange={(e) => setName(e.target.value)}
                                        placeholder="Group name" required
                                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold mb-3"
                                    />
                                    <textarea
                                        value={description} onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Description (optional)" rows={2}
                                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold mb-4 resize-none"
                                    />
                                    {friends.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-400 mb-2">Invite friends:</p>
                                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                                {friends.map((f) => {
                                                    const friend = f.user || f;
                                                    const selected = selectedMembers.includes(friend._id);
                                                    return (
                                                        <button
                                                            key={friend._id} type="button" onClick={() => toggleMember(friend._id)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selected ? 'bg-accent-gold text-dark-bg' : 'bg-dark-bg text-gray-300 border border-dark-border hover:border-accent-gold/50'
                                                                }`}
                                                        >
                                                            {friend.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        type="submit" disabled={creating}
                                        className="w-full py-3 bg-accent-gold text-dark-bg rounded-lg font-semibold hover:bg-accent-amber transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        Create Group
                                    </button>
                                </form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}