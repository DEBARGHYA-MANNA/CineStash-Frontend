'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Film, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                            <Film className="w-7 h-7 text-dark-bg" />
                        </div>
                        <h1 className="text-2xl font-heading font-bold">Welcome Back</h1>
                        <p className="text-sm text-gray-400 light:text-gray-600 mt-1">
                            Sign in to your CineStash vault
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition-colors text-sm ${isDark
                                            ? 'bg-dark-surface border-dark-border focus:border-accent-gold text-white placeholder-gray-500'
                                            : 'bg-light-surface border-light-border focus:border-accent-burgundy text-gray-900 placeholder-gray-400'
                                        }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-dark-surface light:bg-light-surface border border-dark-border light:border-light-border focus:border-accent-gold light:focus:border-accent-burgundy focus:outline-none transition-colors text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-accent-gold light:text-accent-burgundy hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-gradient-gold text-dark-bg font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 light:text-gray-600 mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-accent-gold light:text-accent-burgundy font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}