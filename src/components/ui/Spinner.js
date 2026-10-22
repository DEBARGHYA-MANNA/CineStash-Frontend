'use client';

import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-10 h-10',
        xl: 'w-16 h-16',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Loader2 className={`${sizes[size]} animate-spin text-accent-gold`} />
        </div>
    );
}