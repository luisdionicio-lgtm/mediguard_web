import { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, max = 5, interactive = false, onRate, size = 15 }) {
  const [hover, setHover] = useState(null);
  const display = hover ?? Math.round(rating);

  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < display;
        return (
          <Star
            key={i}
            size={size}
            fill={filled ? 'var(--warning)' : 'none'}
            color={filled ? 'var(--warning)' : 'var(--border-strong)'}
            style={{ cursor: interactive ? 'pointer' : 'default', transition: 'transform 0.1s' }}
            onMouseEnter={() => interactive && setHover(i + 1)}
            onMouseLeave={() => interactive && setHover(null)}
            onClick={() => interactive && onRate?.(i + 1)}
          />
        );
      })}
    </div>
  );
}
