'use client';

export default function Badge({ children, color = '#f59e0b', bg = 'rgba(245, 158, 11, 0.1)', icon: Icon }) {
    return (
        <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
            style={{
                color,
                backgroundColor: bg,
                borderColor: `${color}40`,
            }}
        >
            {Icon && <Icon className="w-3 h-3" />}
            {children}
        </span>
    );
}