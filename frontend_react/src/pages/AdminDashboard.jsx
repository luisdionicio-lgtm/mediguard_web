import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, BookOpen, Building2, Newspaper,
  LayoutDashboard, LogOut, RefreshCw, Check, X,
  ChevronRight, TrendingUp, Activity, Bell, Search,
  Moon, Sun, Eye, MapPin, Phone, Calendar, Tag,
} from 'lucide-react';
import adminApi from '../api/adminApi';
import springApi from '../api/springApi';
import { authService } from '../services/authService';
import '../styles/AdminDashboard.css';

/* ─── constantes ─────────────────────────────── */
const ROLE_OPTIONS = ['CIUDADANO', 'SOCORRISTA', 'COORDINADOR', 'ADMIN'];
const ROLE_META = {
  ADMIN:       { cls: 'rb-admin',  label: 'Admin' },
  COORDINADOR: { cls: 'rb-coord',  label: 'Coordinador' },
  SOCORRISTA:  { cls: 'rb-resp',   label: 'Socorrista' },
  CIUDADANO:   { cls: 'rb-cit',    label: 'Ciudadano' },
};
const NAV = [
  { id: 'overview',   label: 'Resumen',    icon: LayoutDashboard },
  { id: 'usuarios',   label: 'Usuarios',   icon: Users },
  { id: 'guias',      label: 'Guías',      icon: BookOpen },
  { id: 'hospitales', label: 'Hospitales', icon: Building2 },
  { id: 'noticias',   label: 'Noticias',   icon: Newspaper },
];

/* ─── helpers ────────────────────────────────── */
function fmtDate(raw) {
  if (!raw) return '—';
  return new Date(raw).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}
function Avatar({ name, size = 32 }) {
  const letter = (name?.[0] || '?').toUpperCase();
  return (
    <span className="adm-avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {letter}
    </span>
  );
}
function Badge({ role }) {
  const m = ROLE_META[role] || { cls: '', label: role };
  return <span className={`adm-badge ${m.cls}`}>{m.label}</span>;
}
function StatusDot({ active }) {
  return <span className={`adm-dot ${active ? 'dot-on' : 'dot-off'}`}>{active ? 'Activo' : 'Inactivo'}</span>;
}

/* ═══════════════════════════════════════════════
   SECCIÓN: OVERVIEW
═══════════════════════════════════════════════ */
function SectionOverview({ users, guides, hospitals, news, onNavigate }) {
  const total    = users.length;
  const admins   = users.filter(u => u.roles?.includes('ADMIN')).length;
  const socorr   = users.filter(u => u.roles?.includes('SOCORRISTA')).length;
  const coords   = users.filter(u => u.roles?.includes('COORDINADOR')).length;
  const citizens = users.filter(u => u.roles?.includes('CIUDADANO')).length;

  const DAY = 86_400_000;
  const now = Date.now();
  const newUsers30 = users.filter(u => u.created_at && now - new Date(u.created_at) < 30 * DAY).length;
  const activeHosp = hospitals.filter(h => h.is_active ?? h.active).length;
  const pubNews    = news.filter(n => n.is_active ?? n.active).length;

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const METRICS = [
    { key: 'u', icon: Users,     label: 'Usuarios',   value: total,            delta: newUsers30 ? `+${newUsers30}` : null, up: true, deltaLabel: 'nuevos · 30d',     accent: 'm-green' },
    { key: 'g', icon: BookOpen,  label: 'Guías',      value: guides.length,    delta: null,                                            deltaLabel: 'primeros auxilios', accent: 'm-blue' },
    { key: 'h', icon: Building2, label: 'Hospitales', value: hospitals.length, delta: `${activeHosp}`,                                 deltaLabel: 'activos',          accent: 'm-amber' },
    { key: 'n', icon: Newspaper, label: 'Noticias',   value: news.length,      delta: `${pubNews}`,                                    deltaLabel: 'publicadas',       accent: 'm-teal' },
  ];

  const ROLES = [
    { role: 'CIUDADANO',   count: citizens },
    { role: 'SOCORRISTA',  count: socorr },
    { role: 'COORDINADOR', count: coords },
    { role: 'ADMIN',       count: admins },
  ];

  const QUICK = [
    { id: 'usuarios',   icon: Users,     label: 'Gestionar usuarios', sub: `${total} registrados` },
    { id: 'guias',      icon: BookOpen,  label: 'Ver guías',          sub: `${guides.length} activas` },
    { id: 'hospitales', icon: Building2, label: 'Hospitales',         sub: `${hospitals.length} centros` },
    { id: 'noticias',   icon: Newspaper, label: 'Noticias',           sub: `${news.length} artículos` },
  ];

  return (
    <div className="adm-section">
      <div className="adm-ov-head">
        <div>
          <h2 className="adm-section-title">Resumen general</h2>
          <p className="adm-section-sub">Estado actual del sistema</p>
        </div>
        <span className="adm-ov-live"><span className="adm-live-dot" /> En vivo</span>
      </div>

      {/* franja de métricas — sin cajas, separadas por líneas */}
      <div className="adm-metric-strip stagger">
        {METRICS.map(m => (
          <div key={m.key} className={`adm-metric ${m.accent}`}>
            <div className="adm-metric-top">
              <m.icon size={15} strokeWidth={2} />
              <span className="adm-metric-label">{m.label}</span>
            </div>
            <p className="adm-metric-val">{m.value}</p>
            <p className="adm-metric-delta">
              {m.delta && <span className={`adm-delta-pill${m.up ? ' up' : ''}`}>{m.delta}</span>}
              <span>{m.deltaLabel}</span>
            </p>
          </div>
        ))}
      </div>

      {/* accesos rápidos */}
      <div className="adm-quick stagger">
        {QUICK.map(q => (
          <button key={q.id} className="adm-quick-btn" onClick={() => onNavigate(q.id)}>
            <span className="adm-quick-icon"><q.icon size={16} strokeWidth={2} /></span>
            <span className="adm-quick-txt">
              <span className="adm-quick-label">{q.label}</span>
              <span className="adm-quick-sub">{q.sub}</span>
            </span>
            <ChevronRight size={14} className="adm-quick-arrow" />
          </button>
        ))}
      </div>

      {/* bento asimétrico: roles (ancho) + registros */}
      <div className="adm-bento">
        <div className="adm-panel">
          <div className="adm-panel-head">
            <h3 className="adm-panel-title"><TrendingUp size={15} /> Distribución de roles</h3>
            <span className="adm-panel-meta">{total} usuarios</span>
          </div>
          <div className="adm-role-dist">
            {ROLES.map(r => {
              const pct = total ? Math.round(r.count / total * 100) : 0;
              return (
                <div key={r.role} className="adm-dist-row">
                  <Badge role={r.role} />
                  <div className="adm-dist-bar-wrap">
                    <div className="adm-dist-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="adm-dist-pct">{pct}%</span>
                  <span className="adm-dist-count">{r.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="adm-panel">
          <div className="adm-panel-head">
            <h3 className="adm-panel-title"><Activity size={15} /> Últimos registros</h3>
            <button className="adm-panel-link" onClick={() => onNavigate('usuarios')}>Ver todos</button>
          </div>
          <div className="adm-recent-list">
            {recentUsers.map(u => (
              <div key={u.id} className="adm-recent-row">
                <Avatar name={u.first_name} size={34} />
                <div className="adm-recent-info">
                  <p className="adm-recent-name">{u.first_name} {u.last_name}</p>
                  <p className="adm-recent-email">{u.email}</p>
                </div>
                <div className="adm-recent-roles">
                  {(u.roles || []).slice(0, 1).map(r => <Badge key={r} role={r} />)}
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && <p className="adm-empty">Sin usuarios aún</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECCIÓN: USUARIOS
═══════════════════════════════════════════════ */
function SectionUsuarios({ users, loading, onRefresh }) {
  const [search,      setSearch]      = useState('');
  const [editingId,   setEditingId]   = useState(null);
  const [pendingRoles, setPending]    = useState([]);
  const [saving,      setSaving]      = useState(false);
  const [saveMsg,     setSaveMsg]     = useState({});

  const filtered = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = u => { setEditingId(u.id); setPending(u.roles || []); setSaveMsg({}); };
  const cancelEdit = () => { setEditingId(null); setPending([]); };
  const toggleRole = r => setPending(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  const saveRoles = async (userId) => {
    if (!pendingRoles.length) return;
    setSaving(true);
    try {
      await adminApi.put(`users/${userId}/roles/`, { roles: pendingRoles });
      setSaveMsg({ [userId]: 'ok' });
      setTimeout(() => { setSaveMsg({}); setEditingId(null); onRefresh(); }, 1000);
    } catch {
      setSaveMsg({ [userId]: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <div>
          <h2 className="adm-section-title">Usuarios</h2>
          <p className="adm-section-sub">{users.length} registrados · gestiona roles y accesos</p>
        </div>
        <button className="adm-btn-refresh" onClick={onRefresh} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Actualizar
        </button>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={14} className="adm-search-icon" />
          <input
            className="adm-search"
            placeholder="Buscar por nombre o correo…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-loading"><RefreshCw size={18} className="spin" /> Cargando…</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Usuario</th><th>Teléfono</th><th>Roles</th>
                <th>Verificado</th><th>Registro</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className={editingId === u.id ? 'row-editing' : ''}>
                  <td>
                    <div className="adm-user-cell">
                      <Avatar name={u.first_name} size={34} />
                      <div>
                        <p className="adm-user-name">{u.first_name} {u.last_name}</p>
                        <p className="adm-user-email">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="adm-muted">{u.phone || '—'}</td>
                  <td>
                    {editingId === u.id ? (
                      <div className="adm-role-toggles">
                        {ROLE_OPTIONS.map(r => (
                          <button key={r} type="button"
                            className={`adm-rtog ${pendingRoles.includes(r) ? 'on' : ''}`}
                            onClick={() => toggleRole(r)}>
                            {pendingRoles.includes(r) && <Check size={10} />} {r}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="adm-badges">{(u.roles || []).map(r => <Badge key={r} role={r} />)}</div>
                    )}
                  </td>
                  <td><StatusDot active={u.is_verified} /></td>
                  <td className="adm-muted">{fmtDate(u.created_at)}</td>
                  <td>
                    {editingId === u.id ? (
                      <div className="adm-acts">
                        <button className="adm-btn adm-btn-save"
                          onClick={() => saveRoles(u.id)}
                          disabled={saving || !pendingRoles.length}>
                          {saving ? <RefreshCw size={12} className="spin" /> : <Check size={12} />}
                          {saveMsg[u.id] === 'ok' ? 'Guardado' : 'Guardar'}
                        </button>
                        <button className="adm-btn adm-btn-ghost" onClick={cancelEdit}>
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button className="adm-btn adm-btn-edit" onClick={() => startEdit(u)}>
                        Editar roles <ChevronRight size={12} />
                      </button>
                    )}
                    {saveMsg[u.id] === 'error' && <p className="adm-err-txt">Error al guardar</p>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="adm-empty">No se encontraron usuarios</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECCIÓN: GUÍAS
═══════════════════════════════════════════════ */
function SectionGuias({ guides, loading }) {
  const [search, setSearch] = useState('');
  const filtered = guides.filter(g =>
    `${g.title} ${g.category}`.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <div>
          <h2 className="adm-section-title">Guías de primeros auxilios</h2>
          <p className="adm-section-sub">{guides.length} guías disponibles</p>
        </div>
      </div>
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={14} className="adm-search-icon" />
          <input className="adm-search" placeholder="Buscar guía…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="adm-table-wrap">
        {loading ? <div className="adm-loading"><RefreshCw size={18} className="spin" /> Cargando…</div> : (
          <table className="adm-table">
            <thead><tr><th>#</th><th>Título</th><th>Categoría</th><th>Descripción</th><th>Creado</th></tr></thead>
            <tbody>
              {filtered.map(g => (
                <tr key={g.id}>
                  <td className="adm-muted adm-id">#{g.id}</td>
                  <td>
                    <div className="adm-content-cell">
                      <div className="adm-content-icon"><BookOpen size={14} /></div>
                      <span className="adm-content-title">{g.title}</span>
                    </div>
                  </td>
                  <td><span className="adm-tag"><Tag size={10} />{g.category}</span></td>
                  <td className="adm-muted adm-desc">{g.description?.slice(0, 80)}{g.description?.length > 80 ? '…' : ''}</td>
                  <td className="adm-muted">{fmtDate(g.created_at)}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="adm-empty">No se encontraron guías</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECCIÓN: HOSPITALES
═══════════════════════════════════════════════ */
function SectionHospitales({ hospitals, loading }) {
  const [search, setSearch] = useState('');
  const filtered = hospitals.filter(h =>
    `${h.name} ${h.address}`.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <div>
          <h2 className="adm-section-title">Hospitales y centros de salud</h2>
          <p className="adm-section-sub">{hospitals.length} registros · {hospitals.filter(h => h.is_active ?? h.active).length} activos</p>
        </div>
      </div>
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={14} className="adm-search-icon" />
          <input className="adm-search" placeholder="Buscar hospital…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="adm-table-wrap">
        {loading ? <div className="adm-loading"><RefreshCw size={18} className="spin" /> Cargando…</div> : (
          <table className="adm-table">
            <thead><tr><th>#</th><th>Nombre</th><th>Dirección</th><th>Teléfono</th><th>Horario</th><th>Estado</th></tr></thead>
            <tbody>
              {filtered.map(h => (
                <tr key={h.id}>
                  <td className="adm-muted adm-id">#{h.id}</td>
                  <td>
                    <div className="adm-content-cell">
                      <div className="adm-content-icon ci-amber"><Building2 size={14} /></div>
                      <span className="adm-content-title">{h.name}</span>
                    </div>
                  </td>
                  <td className="adm-muted"><MapPin size={11} style={{marginRight:4,verticalAlign:'middle'}} />{h.address}</td>
                  <td className="adm-muted"><Phone size={11} style={{marginRight:4,verticalAlign:'middle'}} />{h.phone || '—'}</td>
                  <td className="adm-muted">{h.operating_hours || h.operatingHours || '—'}</td>
                  <td><StatusDot active={h.is_active ?? h.active} /></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="adm-empty">No se encontraron hospitales</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECCIÓN: NOTICIAS
═══════════════════════════════════════════════ */
function SectionNoticias({ news, loading }) {
  const [search, setSearch] = useState('');
  const filtered = news.filter(n =>
    `${n.title} ${n.summary}`.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="adm-section">
      <div className="adm-section-head">
        <div>
          <h2 className="adm-section-title">Noticias</h2>
          <p className="adm-section-sub">{news.length} artículos · {news.filter(n => n.is_active ?? n.active).length} publicados</p>
        </div>
      </div>
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={14} className="adm-search-icon" />
          <input className="adm-search" placeholder="Buscar noticia…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="adm-table-wrap">
        {loading ? <div className="adm-loading"><RefreshCw size={18} className="spin" /> Cargando…</div> : (
          <table className="adm-table">
            <thead><tr><th>#</th><th>Título</th><th>Resumen</th><th>Publicado</th><th>Estado</th></tr></thead>
            <tbody>
              {filtered.map(n => (
                <tr key={n.id}>
                  <td className="adm-muted adm-id">#{n.id}</td>
                  <td>
                    <div className="adm-content-cell">
                      <div className="adm-content-icon ci-teal"><Newspaper size={14} /></div>
                      <span className="adm-content-title">{n.title}</span>
                    </div>
                  </td>
                  <td className="adm-muted adm-desc">{n.summary?.slice(0, 90)}{n.summary?.length > 90 ? '…' : ''}</td>
                  <td className="adm-muted"><Calendar size={11} style={{marginRight:4,verticalAlign:'middle'}} />{fmtDate(n.published_date || n.publishedDate)}</td>
                  <td><StatusDot active={n.is_active ?? n.active} /></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="adm-empty">No se encontraron noticias</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [section,   setSection]  = useState('overview');
  const [theme,     setTheme]    = useState(localStorage.getItem('theme') || 'light');
  const [sideOpen,  setSideOpen] = useState(true);

  const [users,     setUsers]     = useState([]);
  const [guides,    setGuides]    = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [news,      setNews]      = useState([]);

  const [loadUsers,  setLoadUsers]  = useState(true);
  const [loadContent, setLoadContent] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoadUsers(true);
    try { const r = await adminApi.get('users/'); setUsers(r.data); } catch { /**/ }
    finally { setLoadUsers(false); }
  }, []);

  const fetchContent = useCallback(async () => {
    setLoadContent(true);
    try {
      const [g, h, n] = await Promise.all([
        springApi.get('guides/'),
        springApi.get('hospitals/'),
        springApi.get('news/'),
      ]);
      setGuides(Array.isArray(g.data) ? g.data : g.data?.results || []);
      setHospitals(Array.isArray(h.data) ? h.data : h.data?.results || []);
      setNews(Array.isArray(n.data) ? n.data : n.data?.results || []);
    } catch { /**/ }
    finally { setLoadContent(false); }
  }, []);

  useEffect(() => { fetchUsers(); fetchContent(); }, [fetchUsers, fetchContent]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login', { replace: true });
  };

  const SECTION_MAP = {
    overview:   <SectionOverview  users={users} guides={guides} hospitals={hospitals} news={news} onNavigate={setSection} />,
    usuarios:   <SectionUsuarios  users={users} loading={loadUsers} onRefresh={fetchUsers} />,
    guias:      <SectionGuias     guides={guides} loading={loadContent} />,
    hospitales: <SectionHospitales hospitals={hospitals} loading={loadContent} />,
    noticias:   <SectionNoticias  news={news} loading={loadContent} />,
  };

  return (
    <div className={`adm-root${sideOpen ? '' : ' side-closed'}`}>

      {/* ── Sidebar ── */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <Shield size={18} strokeWidth={2.5} />
          {sideOpen && <span>Medi<em>Guard</em> <small>Admin</small></span>}
        </div>

        <nav className="adm-nav">
          {sideOpen && <span className="adm-nav-label">Secciones</span>}
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`adm-nav-item ${section === id ? 'active' : ''}`}
              onClick={() => setSection(id)}
              title={!sideOpen ? label : undefined}
            >
              <Icon size={16} />
              {sideOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-foot">
          {sideOpen && (
            <div className="adm-sidebar-user">
              <Avatar name={currentUser.first_name} size={32} />
              <div className="adm-su-info">
                <p className="adm-su-name">{currentUser.first_name} {currentUser.last_name}</p>
                <p className="adm-su-email">{currentUser.email}</p>
              </div>
            </div>
          )}
          <button className="adm-logout" onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={15} />
            {sideOpen && <span>Salir</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="adm-body">

        {/* Top navbar */}
        <header className="adm-topbar">
          <button className="adm-toggle" onClick={() => setSideOpen(p => !p)} aria-label="Toggle sidebar">
            <span /><span /><span />
          </button>

          <div className="adm-topbar-breadcrumb">
            <Shield size={13} className="adm-topbar-shield" />
            <span>Admin</span>
            <ChevronRight size={12} className="adm-topbar-sep" />
            <span className="adm-topbar-current">{NAV.find(n => n.id === section)?.label}</span>
          </div>

          <div className="adm-topbar-right">
            <button className="adm-topbar-btn" title="Notificaciones"><Bell size={16} /></button>
            <button className="adm-topbar-btn" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} title="Cambiar tema">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button className="adm-topbar-btn" onClick={() => navigate('/')} title="Ver sitio">
              <Eye size={16} />
            </button>
            <div className="adm-topbar-avatar">
              <Avatar name={currentUser.first_name} size={30} />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="adm-content">
          {SECTION_MAP[section]}
        </main>
      </div>
    </div>
  );
}
