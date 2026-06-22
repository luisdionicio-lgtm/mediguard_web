import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Menu } from 'lucide-react';
import { useCourse } from '../hooks/useCourse';
import { useLessons } from '../hooks/useLessons';
import { useEnrollment } from '../hooks/useEnrollment';
import { useProgress } from '../hooks/useProgress';
import { useCertificate } from '../hooks/useCertificate';
import MediaPlayer from '../components/courses/MediaPlayer';
import QuizBlock from '../components/courses/QuizBlock';
import ProgressBar from '../components/courses/ProgressBar';
import CertificateBanner from '../components/courses/CertificateBanner';
import { formatDuration } from '../components/courses/CourseCard';

const LAST_LESSON_KEY = (slug) => `mediguard_last_lesson_${slug}`;

export default function CourseLearn() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const { data: course } = useCourse(slug);
  const { data: lessons = [] } = useLessons(slug);
  const { enrollment } = useEnrollment(course?.id);
  const { progressList, completedIds, complete } = useProgress(enrollment?.id);
  const { data: certificate } = useCertificate(enrollment?.id);

  // Restore last viewed lesson
  useEffect(() => {
    if (lessons.length === 0) return;
    const saved = localStorage.getItem(LAST_LESSON_KEY(slug));
    const found = lessons.find((l) => l.id === saved);
    setActiveLessonId(found?.id ?? lessons[0].id);
  }, [lessons, slug]);

  // Redirect if not enrolled
  useEffect(() => {
    if (course && !enrollment) navigate(`/courses/${slug}`, { replace: true });
  }, [course, enrollment, slug, navigate]);

  const activeLesson = lessons.find((l) => l.id === activeLessonId);
  const activeIndex = lessons.findIndex((l) => l.id === activeLessonId);
  const prev = activeIndex > 0 ? lessons[activeIndex - 1] : null;
  const next = activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : null;

  const selectLesson = (lesson) => {
    setActiveLessonId(lesson.id);
    localStorage.setItem(LAST_LESSON_KEY(slug), lesson.id);
    setSidebarOpen(false);
  };

  const handleComplete = async (score = 100) => {
    if (!activeLesson || !enrollment) return;
    await complete.mutateAsync({ lessonId: activeLesson.id, score });
    if (!next) {
      setJustCompleted(true);
    } else {
      selectLesson(next);
    }
  };

  const completedCount = progressList.filter((p) => p.completed).length;
  const isCurrentDone = completedIds.has(activeLessonId);

  const dark = 'var(--bg)', card = 'var(--surface)', border = 'var(--border)', muted = 'var(--text-muted)', txt = 'var(--text-primary)';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: dark, color: txt }}>
      <style>{`
        @media(max-width:899px){.learn-sidebar{transform:${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'};position:fixed;z-index:200;height:100%;box-shadow:4px 0 30px rgba(0,0,0,0.5);transition:transform 0.25s;}}
        @media(min-width:900px){.learn-sidebar{position:relative!important;transform:none!important;flex-shrink:0;}}
        .learn-content::-webkit-scrollbar{width:6px} .learn-content::-webkit-scrollbar-track{background:var(--bg)} .learn-content::-webkit-scrollbar-thumb{background:var(--surface-2);border-radius:3px}
      `}</style>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 199 }} />}

      {/* SIDEBAR */}
      <div className="learn-sidebar" style={{ width: 280, background: card, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${border}` }}>
          <Link to={`/courses/${slug}`} style={{ color: 'var(--success)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={14} /> Volver al curso
          </Link>
          <p style={{ color: txt, fontWeight: 700, fontSize: '0.9rem', marginTop: 8, lineHeight: 1.3 }}>{course?.title}</p>
          <div style={{ marginTop: 10 }}>
            <ProgressBar value={completedCount} max={lessons.length} showPercent />
          </div>
        </div>

        {/* Lesson list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {lessons.map((lesson, idx) => {
            const done = completedIds.has(lesson.id);
            const active = lesson.id === activeLessonId;
            return (
              <div key={lesson.id} onClick={() => selectLesson(lesson)}
                style={{ padding: '10px 16px', cursor: 'pointer', background: active ? 'rgba(34,197,94,0.08)' : 'transparent', borderLeft: `3px solid ${active ? 'var(--success)' : 'transparent'}`, display: 'flex', alignItems: 'flex-start', gap: 10, transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                {done ? <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} /> : <Circle size={16} color="var(--border-strong)" style={{ flexShrink: 0, marginTop: 2 }} />}
                <div>
                  <p style={{ color: active ? 'var(--success)' : done ? 'var(--text-muted)' : 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: active ? 700 : 400, lineHeight: 1.35 }}>
                    {idx + 1}. {lesson.title}
                  </p>
                  <p style={{ color: 'var(--text-disabled)', fontSize: '0.73rem', marginTop: 2 }}>{formatDuration(lesson.duration_min)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="learn-content" style={{ flex: 1, overflowY: 'auto' }}>
        {/* Top bar mobile */}
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, background: dark, zIndex: 10 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="learn-menu-btn" style={{ background: 'none', border: 'none', color: muted, cursor: 'pointer', padding: 4 }}>
            <Menu size={20} />
          </button>
          <p style={{ color: muted, fontSize: '0.83rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeLesson?.title}
          </p>
          <span style={{ color: 'var(--text-disabled)', fontSize: '0.78rem', flexShrink: 0 }}>{activeIndex + 1}/{lessons.length}</span>
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px 60px' }}>
          {activeLesson ? (
            <>
              {/* Media */}
              {activeLesson.media_url && (
                <div style={{ marginBottom: 28 }}>
                  <MediaPlayer mediaType={activeLesson.media_type} mediaUrl={activeLesson.media_url} title={activeLesson.title} />
                </div>
              )}

              {/* Title */}
              <h1 style={{ fontSize: 'clamp(1.2rem,3vw,1.7rem)', fontWeight: 800, marginBottom: 16, color: txt }}>{activeLesson.title}</h1>

              {/* Content HTML from TipTap */}
              {activeLesson.content && (
                <div
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem', marginBottom: 28 }}
                  dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                />
              )}

              {/* Quiz */}
              {activeLesson.quizzes?.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ color: txt, fontWeight: 700, marginBottom: 14, fontSize: '1rem' }}>📝 Evaluación</h2>
                  {activeLesson.quizzes.map((quiz) => (
                    <QuizBlock key={quiz.id} quiz={quiz} onComplete={(score) => handleComplete(score)} />
                  ))}
                </div>
              )}

              {/* Certificado al completar */}
              {justCompleted && (
                <div style={{ marginBottom: 28 }}>
                  <CertificateBanner certificate={certificate} courseName={course?.title} />
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', borderTop: `1px solid ${border}`, paddingTop: 20 }}>
                <button onClick={() => prev && selectLesson(prev)} disabled={!prev}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: prev ? card : 'transparent', border: `1px solid ${border}`, borderRadius: 10, color: prev ? 'var(--text-secondary)' : 'var(--border-strong)', cursor: prev ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '0.87rem' }}>
                  <ChevronLeft size={16} /> Anterior
                </button>

                {!isCurrentDone && (
                  <button onClick={() => handleComplete()} disabled={complete.isPending}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: complete.isPending ? 'not-allowed' : 'pointer', fontSize: '0.87rem' }}>
                    <CheckCircle2 size={16} /> {complete.isPending ? 'Guardando…' : 'Marcar completada'}
                  </button>
                )}

                {isCurrentDone && <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.87rem', fontWeight: 600 }}><CheckCircle2 size={16} /> Completada</span>}

                <button onClick={() => next && selectLesson(next)} disabled={!next}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: next ? 'var(--brand)' : 'transparent', border: `1px solid ${next ? 'var(--brand)' : border}`, borderRadius: 10, color: next ? '#fff' : 'var(--border-strong)', cursor: next ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '0.87rem' }}>
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: muted }}>Selecciona una lección para comenzar.</div>
          )}
        </div>
      </div>
    </div>
  );
}
