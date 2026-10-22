'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Film, User, Mail, Lock, Eye, EyeOff, Loader2, Gift } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) return;
        setLoading(true);
        const result = await register(name, email, password, referralCode);
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
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                            <Film className="w-7 h-7 text-dark-bg" />
                        </div>
                        <h1 className="text-2xl font-heading font-bold">Create Your Vault</h1>
                        <p className="text-sm text-gray-400 light:text-gray-600 mt-1">
                            Start tracking your content journey
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Debarghya Manna"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-surface light:bg-light-surface border border-dark-border light:border-light-border focus:border-accent-gold light:focus:border-accent-burgundy focus:outline-none transition-colors text-sm"
                                />
                            </div>
                        </div>

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
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-surface light:bg-light-surface border border-dark-border light:border-light-border focus:border-accent-gold light:focus:border-accent-burgundy focus:outline-none transition-colors text-sm"
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
                                    placeholder="Min 6 characters"
                                    required
                                    minLength={6}
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

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Referral Code <span className="text-gray-500">(optional)</span>
                            </label>
                            <div className="relative">
                                <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                    placeholder="CINE-XXXXX"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-surface light:bg-light-surface border border-dark-border light:border-light-border focus:border-accent-gold light:focus:border-accent-burgundy focus:outline-none transition-colors text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-gradient-gold text-dark-bg font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 light:text-gray-600 mt-6">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-accent-gold light:text-accent-burgundy font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}