'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import {
    Film,
    Search,
    List,
    Sparkles,
    Sun,
    Moon,
    LogOut,
    LogIn,
    UserPlus,
    Menu,
    X,
    LayoutDashboard,
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, user, logout } = useAuth();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => pathname === path;
    const isDark = theme === 'dark';

    const navLinks = isAuthenticated
        ? [
            { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/search', label: 'Search', icon: Search },
            { href: '/watchlist', label: 'Watchlist', icon: List },
            { href: '/recommendations', label: 'Discover', icon: Sparkles },
        ]
        : [];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${isDark
                    ? 'bg-dark-bg/80 border-dark-border/50'
                    : 'bg-light-bg/80 border-light-border/50'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Film className="w-5 h-5 text-dark-bg" />
                        </div>
                        <span className="text-xl font-heading font-bold text-gradient-gold">
                            CineStash
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.href)
                                            ? 'bg-accent-gold/10 text-accent-gold'
                                            : isDark
                                                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
                                }`}
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-accent-gold" />
                            ) : (
                                <Moon className="w-5 h-5 text-accent-burgundy" />
                            )}
                        </button>

                        {/* Auth Buttons */}
                        {isAuthenticated ? (
                            <div className="hidden md:flex items-center gap-3">
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Hi,{' '}
                                    <span className={`font-semibold ${isDark ? 'text-accent-gold' : 'text-accent-burgundy'}`}>
                                        {user?.name}
                                    </span>
                                </span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-accent-red hover:bg-accent-red/10 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    href="/auth/login"
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDark
                                            ? 'text-gray-300 hover:text-white hover:bg-white/10'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                                        }`}
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-gold text-dark-bg hover:opacity-90 transition-all"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
                                }`}
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div
                    className={`md:hidden border-t backdrop-blur-xl animate-slide-down ${isDark
                            ? 'border-dark-border/50 bg-dark-bg/95'
                            : 'border-light-border/50 bg-light-bg/95'
                        }`}
                >
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(link.href)
                                            ? 'bg-accent-gold/10 text-accent-gold'
                                            : isDark
                                                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}

                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    logout();
                                    setMobileOpen(false);
                                }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-accent-red hover:bg-accent-red/10 w-full transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-black/5'
                                        }`}
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Link>
                                <Link
                                    href="/auth/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-gradient-gold text-dark-bg"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}