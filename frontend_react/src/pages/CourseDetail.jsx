import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Star, ChevronRight, PlayCircle, Award } from 'lucide-react';
import { useCourse } from '../hooks/useCourse';
import { useLessons } from '../hooks/useLessons';
import { useEnrollment } from '../hooks/useEnrollment';
import { useRatings } from '../hooks/useRatings';
import { useCertificate } from '../hooks/useCertificate';
import LevelBadge from '../components/courses/LevelBadge';
import LessonAccordion from '../components/courses/LessonAccordion';
import RatingStars from '../components/courses/RatingStars';
import ProgressBar from '../components/courses/ProgressBar';
import CertificateBanner from '../components/courses/CertificateBanner';
import { formatDuration } from '../components/courses/CourseCard';
import { useProgress } from '../hooks/useProgress';

const dark = 'var(--bg)', card = 'var(--surface)', border = 'var(--border)', muted = 'var(--text-muted)', text = 'var(--text-primary)';

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingMsg, setRatingMsg] = useState('');

  const { data: course, isLoading: loadingCourse } = useCourse(slug);
  const { data: lessons = [], isLoading: loadingLessons } = useLessons(slug);
  const { enrollment, enroll } = useEnrollment(course?.id);
  const { ratings, submitRating } = useRatings(slug);
  const { progressList, completedIds } = useProgress(enrollment?.id);
  const { data: certificate } = useCertificate(enrollment?.id);

  if (loadingCourse) {
    return (
      <div style={{ minHeight: '100vh', background: dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: muted }}>Cargando curso…</div>
      </div>
    );
  }
  if (!course) return <div style={{ minHeight: '100vh', background: dark, padding: 40, color: 'var(--error)', textAlign: 'center' }}>Curso no encontrado.</div>;

  const completedCount = progressList.filter((p) => p.completed).length;
  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const handleEnroll = async () => {
    await enroll.mutateAsync();
    navigate(`/courses/${slug}/learn`);
  };

  const handleRating = async (e) => {
    e.preventDefault();
    if (!ratingScore) return;
    try {
      await submitRating.mutateAsync({ score: ratingScore, comment: ratingComment });
      setRatingMsg('¡Gracias por tu reseña!');
      setRatingScore(0); setRatingComment('');
    } catch { setRatingMsg('Error al enviar reseña.'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: dark }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: muted, fontSize: '0.83rem', marginBottom: 24 }}>
          <Link to="/" style={{ color: muted, textDecoration: 'none' }}>Inicio</Link>
          <ChevronRight size={14} />
          <Link to="/courses" style={{ color: muted, textDecoration: 'none' }}>Cursos</Link>
          <ChevronRight size={14} />
          <span style={{ color: text }}>{course.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="course-detail-grid">
          <style>{`@media(min-width:900px){.course-detail-grid{grid-template-columns:1fr 320px!important;}}`}</style>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <LevelBadge level={course.level} size="md" />
                {course.category && (
                  <span style={{ background: 'var(--surface-2)', color: muted, borderRadius: 6, padding: '3px 10px', fontSize: '0.78rem', fontWeight: 600 }}>
                    {course.category.name}
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 800, color: text, lineHeight: 1.25, marginBottom: 12 }}>{course.title}</h1>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.97rem' }}>{course.description}</p>
            </div>

            {/* Lo que aprenderás */}
            {course.description && (
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 20 }}>
                <h2 style={{ color: text, fontWeight: 700, fontSize: '1.05rem', marginBottom: 14 }}>Lo que aprenderás</h2>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {course.description.split(/[.!?]\s+/).filter(s => s.length > 20).slice(0, 6).map((pt, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--success)', flexShrink: 0 }}>✓</span>{pt.trim()}.
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lecciones */}
            <div>
              <h2 style={{ color: text, fontWeight: 700, fontSize: '1.05rem', marginBottom: 12 }}>Contenido del curso</h2>
              {loadingLessons
                ? <div style={{ color: muted }}>Cargando lecciones…</div>
                : <LessonAccordion lessons={lessons} isEnrolled={!!enrollment} completedIds={completedIds} />
              }
            </div>

            {/* Progreso (si inscrito) */}
            {enrollment && (
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 20 }}>
                <h2 style={{ color: text, fontWeight: 700, marginBottom: 14, fontSize: '1rem' }}>Tu progreso</h2>
                <ProgressBar value={completedCount} max={lessons.length} label={`${completedCount} de ${lessons.length} lecciones`} />
              </div>
            )}

            {/* Certificado */}
            {certificate && <CertificateBanner certificate={certificate} courseName={course.title} />}

            {/* Ratings */}
            <div>
              <h2 style={{ color: text, fontWeight: 700, fontSize: '1.05rem', marginBottom: 16 }}>Valoraciones</h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--warning)' }}>
                  {course.rating_avg ? course.rating_avg.toFixed(1) : '—'}
                </span>
                <div>
                  <RatingStars rating={course.rating_avg ?? 0} size={18} />
                  <p style={{ color: muted, fontSize: '0.82rem', marginTop: 4 }}>{ratings.length} reseñas</p>
                </div>
              </div>

              {/* Lista reseñas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ratings.slice(0, 6).map((r) => (
                  <div key={r.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.88rem' }}>{r.user_name || 'Usuario'}</span>
                      <RatingStars rating={r.score} size={13} />
                    </div>
                    {r.comment && <p style={{ color: muted, fontSize: '0.85rem', lineHeight: 1.5 }}>{r.comment}</p>}
                  </div>
                ))}
              </div>

              {/* Formulario reseña */}
              {enrollment && !certificate && (
                <form onSubmit={handleRating} style={{ marginTop: 20, background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 20 }}>
                  <h3 style={{ color: text, fontWeight: 700, marginBottom: 12, fontSize: '0.97rem' }}>Deja tu reseña</h3>
                  <RatingStars rating={ratingScore} interactive onRate={setRatingScore} size={28} />
                  <textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    placeholder="Escribe tu comentario (opcional)…"
                    rows={3}
                    style={{ marginTop: 12, width: '100%', padding: 12, background: 'var(--bg)', border: `1px solid ${border}`, borderRadius: 10, color: text, resize: 'vertical', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                  {ratingMsg && <p style={{ color: ratingMsg.includes('Error') ? 'var(--error)' : 'var(--success)', fontSize: '0.82rem', marginTop: 6 }}>{ratingMsg}</p>}
                  <button type="submit" disabled={!ratingScore} style={{ marginTop: 12, padding: '9px 20px', background: ratingScore ? 'var(--success)' : 'var(--surface-2)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: ratingScore ? 'pointer' : 'not-allowed', fontSize: '0.88rem' }}>
                    Enviar reseña
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT — sticky card */}
          <div>
            <div style={{ position: 'sticky', top: 90, background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden' }}>
              {course.thumbnail_url
                ? <img src={course.thumbnail_url} alt={course.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                : <div style={{ aspectRatio: '16/9', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🩺</div>
              }
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { icon: <Clock size={16} />, label: 'Duración', value: formatDuration(course.duration_min) },
                    { icon: <BookOpen size={16} />, label: 'Lecciones', value: `${course.lesson_count ?? lessons.length}` },
                    { icon: <Star size={16} />, label: 'Valoración', value: course.rating_avg ? `${course.rating_avg.toFixed(1)} / 5` : 'Sin valorar' },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', color: muted, fontSize: '0.87rem', padding: '6px 0', borderBottom: `1px solid ${border}` }}>
                      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{icon}{label}</span>
                      <span style={{ color: text, fontWeight: 600 }}>{value}</span>
                    </div>
                  ))}
                </div>

                {enrollment && (
                  <ProgressBar value={pct} max={100} label="Progreso" color="var(--success)" />
                )}

                {/* CTA */}
                {certificate ? (
                  <button style={{ padding: '13px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Award size={18} /> Ver certificado
                  </button>
                ) : enrollment ? (
                  <button onClick={() => navigate(`/courses/${slug}/learn`)}
                    style={{ padding: '13px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <PlayCircle size={18} /> Continuar curso
                  </button>
                ) : (
                  <button onClick={handleEnroll} disabled={enroll.isPending}
                    style={{ padding: '13px', background: enroll.isPending ? 'var(--surface-2)' : 'var(--brand)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', cursor: enroll.isPending ? 'not-allowed' : 'pointer' }}>
                    {enroll.isPending ? 'Inscribiendo…' : 'Inscribirse gratis'}
                  </button>
                )}

                {enroll.isError && <p style={{ color: 'var(--error)', fontSize: '0.8rem', textAlign: 'center' }}>Error al inscribirse. Intenta de nuevo.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
