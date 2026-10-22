'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Film, Search, List, Sparkles, Users, Star, ArrowRight, Play, Clapperboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    icon: Search,
    title: 'Search Everything',
    desc: 'Movies, TV shows, anime, games, and books — all in one place.',
  },
  {
    icon: List,
    title: 'Track Your Watchlist',
    desc: 'Organize what you want to watch, are watching, and have watched.',
  },
  {
    icon: Star,
    title: 'Rate & Review',
    desc: 'Rate your favorites and add personal notes to remember your thoughts.',
  },
  {
    icon: Sparkles,
    title: 'Smart Recommendations',
    desc: 'Discover new content based on your taste and trending picks.',
  },
  {
    icon: Users,
    title: 'Group Vaults',
    desc: 'Create shared watchlists with friends and track what everyone has watched.',
  },
  {
    icon: Play,
    title: 'Episode Tracking',
    desc: 'Never lose track of where you left off in any series or anime.',
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 cinematic-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-gold/5 via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/10 border border-accent-gold/20 mb-8">
              <Film className="w-4 h-4 text-accent-gold" />
              <span className="text-sm text-accent-gold font-medium">Your Personal Content Vault</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black mb-6 leading-tight">
              Track Every
              <span className="text-gradient-gold"> Story </span>
              You Love
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 light:text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Movies, series, anime, games, books — search, save, rate, and discover.
              Share your vault with friends and never forget what you watched.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-gold text-dark-bg font-semibold text-lg hover:opacity-90 transition-all hover-glow"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-gold text-dark-bg font-semibold text-lg hover:opacity-90 transition-all hover-glow"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 px-8 py-4 rounded-xl border border-dark-border light:border-light-border text-gray-300 light:text-gray-700 font-medium text-lg hover:bg-white/5 light:hover:bg-black/5 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Everything You Need, <span className="text-gradient-gold">One Vault</span>
            </h2>
            <p className="text-gray-400 light:text-gray-600 max-w-xl mx-auto">
              From discovery to tracking to sharing — CineStash has it all.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 hover-glow group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center mb-4 group-hover:bg-accent-gold/20 transition-colors">
                    <Icon className="w-6 h-6 text-accent-gold" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 light:text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="relative py-24 px-4">
          <div className="max-w-3xl mx-auto text-center glass-card p-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Ready to Build Your Vault?
            </h2>
            <p className="text-gray-400 light:text-gray-600 mb-8">
              Join thousands of content lovers tracking their watch history.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-gold text-dark-bg font-semibold text-lg hover:opacity-90 transition-all hover-glow"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-dark-border/50 light:border-light-border/50 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-accent-gold" />
            <span className="font-heading font-bold text-gradient-gold">CineStash</span>
          </div>

          <p className="text-sm text-gray-500 flex items-center gap-1">
            © {new Date().getFullYear()} CineStash. Built with
            <Clapperboard size={16} className="text-accent-gold" />
            by Debarghya.
          </p>
        </div>
      </footer>
    </div>
  );
}