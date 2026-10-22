'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className={`${maxWidth} w-full rounded-2xl border pointer-events-auto ${isDark
                                    ? 'bg-dark-surface border-dark-border'
                                    : 'bg-light-surface border-light-border'
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {title && (
                                <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-dark-border' : 'border-light-border'
                                    }`}>
                                    <h3 className="text-lg font-heading font-bold">{title}</h3>
                                    <button
                                        onClick={onClose}
                                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                                            }`}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            <div className="p-5">{children}</div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}