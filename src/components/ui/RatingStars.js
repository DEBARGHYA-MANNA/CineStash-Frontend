'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

export default function RatingStars({ rating = 0, max = 5, size = 'md', interactive = false, onChange }) {
    const [hover, setHover] = useState(0);

    const sizes = {
        sm: 'w-3 h-3',
        md: 'w-5 h-5',
        lg: 'w-7 h-7',
    };

    const displayRating = interactive && hover > 0 ? hover : rating;

    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => {
                const starValue = i + 1;
                const filled = starValue <= Math.floor(displayRating);
                const half = !filled && starValue - 0.5 <= displayRating;

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onMouseEnter={() => interactive && setHover(starValue)}
                        onMouseLeave={() => interactive && setHover(0)}
                        onClick={() => interactive && onChange && onChange(starValue)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                    >
                        <Star
                            className={`${sizes[size]} ${filled || half ? 'fill-accent-gold text-accent-gold' : 'text-gray-600'
                                }`}
                        />
                    </button>
                );
            })}
        </div>
    );
}