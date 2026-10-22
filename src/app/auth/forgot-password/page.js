'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Film, Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await forgotPassword(email);
        setLoading(false);
        if (result.success) {
            setSent(true);
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
                        <div className="w-14 h-14 rounded-xl bg-accent-gold/10 flex items-center justify-center mx-auto mb-4">
                            {sent ? (
                                <CheckCircle className="w-7 h-7 text-accent-green" />
                            ) : (
                                <Mail className="w-7 h-7 text-accent-gold" />
                            )}
                        </div>
                        <h1 className="text-2xl font-heading font-bold">
                            {sent ? 'Check Your Email' : 'Forgot Password?'}
                        </h1>
                        <p className="text-sm text-gray-400 light:text-gray-600 mt-2">
                            {sent
                                ? 'If an account exists with that email, a reset link has been sent.'
                                : 'Enter your email and we\'ll send you a reset link.'}
                        </p>
                    </div>

                    {!sent ? (
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
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-surface light:bg-light-surface border border-dark-border light:border-light-border focus:border-accent-gold light:focus:border-accent-burgundy focus:outline-none transition-colors text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg bg-gradient-gold text-dark-bg font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <p className="text-sm text-gray-400 light:text-gray-600 mb-4">
                                Also check your server console if email is not configured.
                            </p>
                        </div>
                    )}

                    <Link
                        href="/auth/login"
                        className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400 light:text-gray-600 hover:text-accent-gold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}