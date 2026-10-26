'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Film, LayoutDashboard, Search, Bookmark, Sparkles,
    Users, FolderOpen, Gift, Menu, X, Sun, Moon, LogOut, LogIn,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
    { href: '/recommendations', label: 'Recs', icon: Sparkles },
    { href: '/friends', label: 'Friends', icon: Users },
    { href: '/groups', label: 'Groups', icon: FolderOpen },
    { href: '/referral', label: 'Referral', icon: Gift },
];

export default function Navbar() {
    const pathname = usePathname();
    const { isDark, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setDrawerOpen(false);
    }, [pathname]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                        ? 'bg-dark-bg/90 backdrop-blur-xl border-b border-dark-border shadow-lg shadow-black/20'
                        : 'bg-transparent'
                    }`}
            >
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <Film className="w-7 h-7 text-accent-gold" />
                        <span className="text-xl font-heading font-bold text-white hidden sm:block">
                            Cine<span className="text-accent-gold">Stash</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = pathname === link.href || pathname.startsWith(link.href + '/');
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active
                                            ? 'bg-accent-gold/15 text-accent-gold'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {isAuthenticated ? (
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-xs text-gray-400 font-mono">{user?.uniqueId}</span>
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-lg text-gray-400 hover:text-accent-red hover:bg-accent-red/10 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-accent-gold text-dark-bg rounded-lg text-sm font-semibold hover:bg-accent-amber transition-all"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                        )}

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Side Drawer */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-50 lg:hidden"
                            onClick={() => setDrawerOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="fixed top-0 right-0 bottom-0 w-72 bg-dark-surface border-l border-dark-border z-50 lg:hidden overflow-y-auto"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-dark-border">
                                <span className="font-heading font-bold text-white">Menu</span>
                                <button onClick={() => setDrawerOpen(false)} className="p-1 text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 flex flex-col gap-1">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    const active = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active
                                                    ? 'bg-accent-gold/15 text-accent-gold'
                                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                            {isAuthenticated && (
                                <div className="p-4 border-t border-dark-border">
                                    <p className="text-xs text-gray-500 mb-2 font-mono">{user?.uniqueId}</p>
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 text-accent-red text-sm hover:underline"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}