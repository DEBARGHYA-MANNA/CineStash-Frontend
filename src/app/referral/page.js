'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Share2, Award, Users, TrendingUp } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

const TIER_CONFIG = {
  bronze:     { color: 'text-amber-700', bg: 'bg-amber-700/15', border: 'border-amber-700/30', next: 5 },
  silver:     { color: 'text-gray-300',   bg: 'bg-gray-300/15',  border: 'border-gray-300/30',  next: 10 },
  gold:       { color: 'text-accent-gold', bg: 'bg-accent-gold/15', border: 'border-accent-gold/30', next: 25 },
  platinum:   { color: 'text-blue-300',   bg: 'bg-blue-300/15',  border: 'border-blue-300/30',  next: 50 },
  diamond:    { color: 'text-purple-400', bg: 'bg-purple-400/15', border: 'border-purple-400/30', next: null },
};

export default function ReferralPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/users/referral')
      .then((res) => setData(res.data?.data))
      .catch(() => toast.error('Failed to load referral info'))
      .finally(() => setLoading(false));
  }, []);

  const copyCode = () => {
    if (!data?.referralCode) return;
    navigator.clipboard.writeText(data.referralCode);
    setCopied(true);
    toast.success('Code copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    const link = `${window.location.origin}/auth/register?ref=${data?.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="h-8 w-48 skeleton rounded mb-8" />
          <div className="h-40 skeleton rounded-xl mb-6" />
          <div className="h-32 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const tier = TIER_CONFIG[data.referralTier] || TIER_CONFIG.bronze;
  const progress = tier.next ? Math.min((data.referralCount / tier.next) * 100, 100) : 100;

  return (
    <div className="min-h-screen bg-dark-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-heading font-bold text-white mb-8"
        >
          <Gift className="inline w-8 h-8 text-accent-gold mr-2 -mt-1" />
          Referral Program
        </motion.h1>

        {/* Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 bg-dark-surface border border-dark-border rounded-2xl mb-6"
        >
          <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-mono font-bold text-accent-gold tracking-wider">{data.referralCode}</span>
            <button onClick={copyCode} className="p-2 bg-accent-gold/15 text-accent-gold rounded-lg hover:bg-accent-gold/25 transition-all">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm text-gray-300 hover:text-white hover:border-accent-gold/50 transition-all"
          >
            <Share2 className="w-4 h-4" /> Copy Invite Link
          </button>
        </motion.div>

        {/* Tier & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        >
          <div className={`p-5 border rounded-xl ${tier.bg} ${tier.border}`}>
            <Award className={`w-6 h-6 ${tier.color} mb-2`} />
            <p className="text-sm text-gray-400">Current Tier</p>
            <p className={`text-2xl font-heading font-bold capitalize ${tier.color}`}>{data.referralTier}</p>
          </div>
          <div className="p-5 bg-dark-surface border border-dark-border rounded-xl">
            <Users className="w-6 h-6 text-accent-blue mb-2" />
            <p className="text-sm text-gray-400">Referrals</p>
            <p className="text-2xl font-heading font-bold text-white">{data.referralCount}</p>
          </div>
        </motion.div>

        {/* Progress */}
        {tier.next && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="p-5 bg-dark-surface border border-dark-border rounded-xl mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress to next tier</span>
              <span className="text-sm text-white font-medium">{data.referralCount}/{tier.next}</span>
            </div>
            <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-accent-gold rounded-full"
              />
            </div>
          </motion.div>
        )}

        {/* Referred Users */}
        {data.referredUsers?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="p-5 bg-dark-surface border border-dark-border rounded-xl"
          >
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Referred Users
            </h3>
            <div className="flex flex-col gap-2">
              {data.referredUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between px-3 py-2 bg-dark-bg rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{u.uniqueId}</p>
                  </div>
                  <span className="text-xs text-accent-green">Joined</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}