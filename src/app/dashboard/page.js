'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) return <div className="flex items-center justify-center min-h-[80vh]"><div className="skeleton w-12 h-12 rounded-full" /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-heading font-bold mb-2">
                Welcome, <span className="text-gradient-gold">{user?.name}</span> 👋
            </h1>
            <p className="text-gray-400 light:text-gray-600">
                Your dashboard is being built in Phase 8. Stay tuned!
            </p>
        </div>
    );
}