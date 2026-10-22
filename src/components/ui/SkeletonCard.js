'use client';

export default function SkeletonCard() {
    return (
        <div className="rounded-xl overflow-hidden">
            <div className="skeleton aspect-[2/3] w-full rounded-xl" />
            <div className="mt-3 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
            </div>
        </div>
    );
}

export function SkeletonGrid({ count = 10 }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}