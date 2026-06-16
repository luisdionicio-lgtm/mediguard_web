import { useState } from 'react';
import { ChevronDown, Video, FileText, Headphones, Image, AlignLeft, Lock, CheckCircle2 } from 'lucide-react';
import { formatDuration } from './CourseCard';

const MEDIA_ICONS = { VIDEO: Video, PDF: FileText, AUDIO: Headphones, IMAGEN: Image, NINGUNO: AlignLeft };

export default function LessonAccordion({ lessons = [], isEnrolled = false, completedIds = new Set(), activeLesson, onSelectLesson }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '14px 18px', background: 'var(--surface)', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem' }}
      >
        <span>📚 Contenido del curso ({lessons.length} lecciones)</span>
        <ChevronDown size={18} style={{ transition: '0.2s', transform: open ? 'rotate(180deg)' : '' }} />
      </button>

      {open && (
        <div>
          {lessons.map((lesson, idx) => {
            const Icon = MEDIA_ICONS[lesson.media_type] || AlignLeft;
            const locked = !isEnrolled && !lesson.is_free;
            const done = completedIds.has(lesson.id);
            const active = activeLesson === lesson.id;

            return (
              <div
                key={lesson.id}
                onClick={() => !locked && onSelectLesson?.(lesson)}
                style={{
                  padding: '12px 18px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: locked ? 'not-allowed' : 'pointer',
                  background: active ? 'rgba(34,197,94,0.08)' : 'transparent',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!locked && !active) e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ color: 'var(--text-disabled)', fontSize: '0.78rem', minWidth: 20 }}>{idx + 1}</span>

                {done
                  ? <CheckCircle2 size={16} color="var(--success)" />
                  : locked
                    ? <Lock size={14} color="var(--text-disabled)" />
                    : <Icon size={15} color={active ? 'var(--success)' : 'var(--text-muted)'} />
                }

                <span style={{ flex: 1, color: locked ? 'var(--text-disabled)' : active ? 'var(--success)' : 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: active ? 600 : 400 }}>
                  {lesson.title}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {lesson.is_free && (
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 4, padding: '1px 6px', fontSize: '0.68rem', fontWeight: 700 }}>
                      GRATIS
                    </span>
                  )}
                  <span style={{ color: 'var(--text-disabled)', fontSize: '0.78rem' }}>{formatDuration(lesson.duration_min)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
