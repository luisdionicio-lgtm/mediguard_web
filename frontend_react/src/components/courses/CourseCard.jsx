import { Link } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';
import LevelBadge from './LevelBadge';
import RatingStars from './RatingStars';

/* Acentos por categoría — deben ser hex literales porque se les
   concatena alpha (`color + '60'`), algo imposible con var(). */
const ACCENTS = ['#dc2626','#22c55e','#3b82f6','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#10b981'];

function accent(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

export function formatDuration(min) {
  if (!min) return '—';
  const h = Math.floor(min / 60), m = min % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'min' : ''}`.trim() : `${m}min`;
}

export default function CourseCard({ course }) {
  const color = accent(course.category?.id || course.id);
  const desc = (course.description || '').slice(0, 80) + ((course.description?.length || 0) > 80 ? '…' : '');

  return (
    <Link to={`/courses/${course.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="course-card"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = ''; }}
      >
        {/* Thumbnail */}
        <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--bg)', overflow: 'hidden' }}>
          {course.thumbnail_url
            ? <img src={course.thumbnail_url} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg,${color}20,${color}50)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🩺</div>
          }
          <div style={{ position: 'absolute', top: 10, right: 10 }}><LevelBadge level={course.level} /></div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px' }}>
          <span style={{ background: color + '20', color, border: `1px solid ${color}40`, borderRadius: 6, padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {course.category?.name || 'General'}
          </span>

          <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.97rem', marginTop: 8, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.title}
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginTop: 4, lineHeight: 1.5 }}>{desc || 'Sin descripción.'}</p>

          <div style={{ display: 'flex', gap: 14, marginTop: 10, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} />{formatDuration(course.duration_min)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={13} />{course.lesson_count ?? 0} lecciones</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <RatingStars rating={course.rating_avg ?? 0} size={13} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              {course.rating_avg ? course.rating_avg.toFixed(1) : 'Sin valorar'}
            </span>
          </div>

          <div style={{ marginTop: 14, padding: '9px 0', background: color, borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.88rem', textAlign: 'center' }}>
            Ver curso
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CourseCardSkeleton() {
  const pulse = { animation: 'skeleton-pulse 1.4s ease-in-out infinite', background: 'var(--surface-2)', borderRadius: 6 };
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ aspectRatio: '16/9', ...pulse }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ width: 70, height: 20, ...pulse }} />
        <div style={{ width: '85%', height: 18, ...pulse }} />
        <div style={{ width: '100%', height: 14, ...pulse }} />
        <div style={{ width: '60%', height: 14, ...pulse }} />
        <div style={{ width: '100%', height: 36, marginTop: 6, ...pulse, borderRadius: 10 }} />
      </div>
    </div>
  );
}
