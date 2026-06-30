import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Lock } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import CourseCard, { CourseCardSkeleton } from '../components/courses/CourseCard';
import CourseFilters from '../components/courses/CourseFilters';
import { authService } from '../services/authService';

const FREE_PREVIEW_LIMIT = 3;

const S = {
  page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' },
  hero: { padding: '48px 24px 32px', textAlign: 'center', background: 'linear-gradient(180deg,var(--surface) 0%,var(--bg) 100%)' },
  heroTitle: { fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 800, marginBottom: 8, lineHeight: 1.2 },
  heroSub: { color: 'var(--text-muted)', marginBottom: 24, fontSize: '1rem' },
  searchWrap: { maxWidth: 520, margin: '0 auto', position: 'relative' },
  searchInput: { width: '100%', padding: '13px 20px 13px 46px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' },
  searchIcon: { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' },
  body: { maxWidth: 1280, margin: '0 auto', padding: '24px 24px 60px', display: 'flex', gap: 28 },
  sidebar: { width: 260, flexShrink: 0, display: 'none' },
  grid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20, alignContent: 'start' },
  empty: { gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-disabled)' },
  mobileFab: { position: 'fixed', bottom: 24, right: 24, background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: '50%', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 20px rgba(13,158,117,0.35)', zIndex: 100 },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'flex-end' },
  modalInner: { background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: 24, width: '100%', maxHeight: '85vh', overflowY: 'auto' },
};

function useDebounce(val, ms = 350) {
  const [debounced, setDebounced] = useState(val);
  useEffect(() => { const t = setTimeout(() => setDebounced(val), ms); return () => clearTimeout(t); }, [val, ms]);
  return debounced;
}

export default function Courses() {
  const [rawSearch, setRawSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', level: '', duration: '', ordering: '-published_at' });
  const [showModal, setShowModal] = useState(false);
  const search = useDebounce(rawSearch);
  const loaderRef = useRef(null);

  const isAuthenticated = !!authService.getCurrentUser();
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useCourses({ ...filters, search });

  const allCourses = data?.pages.flatMap((p) => p.results ?? p) ?? [];
  const courses = isAuthenticated ? allCourses : allCourses.slice(0, FREE_PREVIEW_LIMIT);
  const lockedCount = isAuthenticated ? 0 : Math.max(0, allCourses.length - FREE_PREVIEW_LIMIT);
  const total = data?.pages[0]?.count ?? 0;

  // Infinite scroll via IntersectionObserver
  const onIntersect = useCallback(([entry]) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(onIntersect, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onIntersect]);

  return (
    <div style={S.page}>
      {/* Hero + búsqueda */}
      <div style={S.hero}>
        <h1 style={S.heroTitle}>
          Aprende a <span style={{ color: 'var(--brand)' }}>salvar vidas</span>
        </h1>
        <p style={S.heroSub}>Cursos de primeros auxilios para toda la comunidad</p>
        <div style={S.searchWrap}>
          <Search size={18} style={S.searchIcon} />
          <input
            style={S.searchInput}
            placeholder="Buscar cursos…"
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
          />
          {rawSearch && (
            <button onClick={() => setRawSearch('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
        </div>
        {total > 0 && <p style={{ color: 'var(--text-disabled)', fontSize: '0.82rem', marginTop: 12 }}>{total} cursos disponibles</p>}
      </div>

      <style>{`
        @media (min-width:768px) { .courses-sidebar { display:block !important; } .mobile-fab { display:none !important; } }
        @keyframes skeleton-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>

      <div style={S.body}>
        {/* Sidebar desktop */}
        <div style={{ ...S.sidebar, display: 'block' }} className="courses-sidebar">
          <CourseFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Grid */}
        <div style={{ flex: 1 }}>
          <div style={S.grid}>
            {isLoading
              ? Array.from({ length: 12 }, (_, i) => <CourseCardSkeleton key={i} />)
              : courses.length === 0
                ? <div style={S.empty}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>No encontramos cursos con esos filtros.</p>
                    <button onClick={() => { setFilters({ category: '', level: '', duration: '', ordering: '-published_at' }); setRawSearch(''); }}
                      style={{ marginTop: 14, padding: '8px 20px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                      Limpiar filtros
                    </button>
                  </div>
                : courses.map((c) => <CourseCard key={c.id} course={c} />)
            }

            {isFetchingNextPage && Array.from({ length: 3 }, (_, i) => <CourseCardSkeleton key={`sk${i}`} />)}
          </div>

          {/* Banner de acceso bloqueado */}
          {!isAuthenticated && lockedCount > 0 && (
            <div style={{ margin: '32px auto', maxWidth: 520, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 24px', textAlign: 'center' }}>
              <Lock size={32} style={{ color: 'var(--brand)', marginBottom: 12 }} />
              <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {lockedCount} curso{lockedCount > 1 ? 's' : ''} más disponible{lockedCount > 1 ? 's' : ''}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
                Inicia sesión para acceder al catálogo completo de primeros auxilios.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/login" className="btn btn-primary btn-sm">Iniciar sesión</Link>
                <Link to="/register" className="btn btn-outline btn-sm">Crear cuenta gratis</Link>
              </div>
            </div>
          )}

          <div style={{ display: 'none' }}>
          </div>

          {/* Infinite scroll trigger (solo para usuarios autenticados) */}
          {isAuthenticated && <div ref={loaderRef} style={{ height: 1, marginTop: 20 }} />}
        </div>
      </div>

      {/* FAB filtros mobile */}
      <button className="mobile-fab" style={S.mobileFab} onClick={() => setShowModal(true)}>
        <SlidersHorizontal size={22} />
      </button>

      {/* Modal filtros mobile */}
      {showModal && (
        <div style={S.modal} onClick={() => setShowModal(false)}>
          <div style={S.modalInner} onClick={(e) => e.stopPropagation()}>
            <CourseFilters filters={filters} onChange={setFilters} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
