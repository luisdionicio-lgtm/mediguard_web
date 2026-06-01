import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { emergencyService } from '../services/emergencyService';
import { getApiErrorMessage } from '../services/errorService';
import '../styles/Profile.css';

const emptyContactForm = {
  name: '',
  phone: '',
  relationship: 'otro',
  email: '',
  notes: '',
  is_primary: false,
};

const relationshipLabels = {
  familiar: 'Familiar',
  amigo: 'Amigo/a',
  medico: 'Medico/a',
  vecino: 'Vecino/a',
  otro: 'Otro',
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const [contactForm, setContactForm] = useState(emptyContactForm);
  const [editingContactId, setEditingContactId] = useState(null);
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');
  const [isContactSaving, setIsContactSaving] = useState(false);
  const [deletingContactId, setDeletingContactId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileData, contactData] = await Promise.all([
          authService.getProfile(),
          emergencyService.getContacts(),
        ]);
        setProfile(profileData);
        setContacts(contactData);
      } catch (error) {
        console.error("Error fetching profile", error);
        setError(getApiErrorMessage(error, 'No se pudo cargar el perfil.'));
      }
    };
    fetchProfile();
  }, []);

  const resetContactForm = () => {
    setContactForm(emptyContactForm);
    setEditingContactId(null);
    setContactError('');
  };

  const refreshContacts = async () => {
    const contactData = await emergencyService.getContacts();
    setContacts(contactData);
  };

  const handleContactChange = (event) => {
    const { name, value, type, checked } = event.target;
    setContactForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditContact = (contact) => {
    setContactForm({
      name: contact.name || '',
      phone: contact.phone || '',
      relationship: contact.relationship || 'otro',
      email: contact.email || '',
      notes: contact.notes || '',
      is_primary: Boolean(contact.is_primary),
    });
    setEditingContactId(contact.id);
    setContactError('');
    setContactSuccess('');
  };

  const validateContactForm = () => {
    if (!contactForm.name.trim()) {
      return 'El nombre del contacto es obligatorio.';
    }

    if (!/^\+?\d{7,15}$/.test(contactForm.phone.trim())) {
      return 'Ingresa un telefono valido. Ejemplo: +51999888777';
    }

    if (contactForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email.trim())) {
      return 'Ingresa un correo de contacto valido.';
    }

    return '';
  };

  const buildContactPayload = () => ({
    name: contactForm.name.trim(),
    phone: contactForm.phone.trim(),
    relationship: contactForm.relationship,
    email: contactForm.email.trim() || null,
    notes: contactForm.notes.trim(),
    is_primary: contactForm.is_primary,
  });

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setContactError('');
    setContactSuccess('');

    const validationError = validateContactForm();
    if (validationError) {
      setContactError(validationError);
      return;
    }

    setIsContactSaving(true);
    try {
      if (editingContactId) {
        await emergencyService.updateContact(editingContactId, buildContactPayload());
        setContactSuccess('Contacto actualizado correctamente.');
      } else {
        await emergencyService.createContact(buildContactPayload());
        setContactSuccess('Contacto creado correctamente.');
      }
      resetContactForm();
      await refreshContacts();
    } catch (err) {
      setContactError(getApiErrorMessage(err, 'No se pudo guardar el contacto.'));
    } finally {
      setIsContactSaving(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    setContactError('');
    setContactSuccess('');
    setDeletingContactId(contactId);

    try {
      await emergencyService.deleteContact(contactId);
      setContactSuccess('Contacto eliminado correctamente.');
      if (editingContactId === contactId) {
        resetContactForm();
      }
      await refreshContacts();
    } catch (err) {
      setContactError(getApiErrorMessage(err, 'No se pudo eliminar el contacto.'));
    } finally {
      setDeletingContactId(null);
    }
  };

  if (error) {
    return (
      <div className="profile-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="error-message" style={{ color: '#EF4444' }}>{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="animate-fade-in">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--teal-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="badge-pulse"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
        </div>
      </div>
    );
  }

  const nameToDisplay = profile.nombre ? profile.nombre : `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  const initials = nameToDisplay ? nameToDisplay.substring(0, 2).toUpperCase() : 'US';

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-header">
        <div className="profile-avatar">
          {initials}
        </div>
        <div className="profile-title">
          <h1>{nameToDisplay}</h1>
          <p>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            {profile.email}
          </p>
        </div>
        <div className="profile-badge">
          Estudiante / Ciudadano
        </div>
      </div>

      <div className="profile-grid">
        {/* Section: Personal Info */}
        <div className="profile-section">
          <div className="profile-section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <h2>Información Personal</h2>
          </div>
          <ul className="info-list">
            <li>
              <span className="info-label">Nombre Completo</span>
              <span className="info-value">{nameToDisplay}</span>
            </li>
            <li>
              <span className="info-label">Teléfono</span>
              <span className="info-value">{profile.phone || 'No registrado'}</span>
            </li>
            <li>
              <span className="info-label">Miembro desde</span>
              <span className="info-value">Reciente</span>
            </li>
          </ul>
        </div>

        {/* Section: Learning Progress */}
        <div className="profile-section">
          <div className="profile-section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <h2>Mi Progreso Educativo</h2>
          </div>
          <ul className="info-list">
            <li>
              <span className="info-label">Cursos Completados</span>
              <span className="info-value">0</span>
            </li>
            <li>
              <span className="info-label">Certificados Obtenidos</span>
              <span className="info-value">Ninguno</span>
            </li>
            <li>
              <span className="info-label">Guías Leídas</span>
              <span className="info-value">2</span>
            </li>
          </ul>
          <button className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--teal-primary)', color: 'var(--teal-primary)', width: '100%', marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '600', transition: 'all 0.3s' }} onMouseOver={(e) => { e.target.style.backgroundColor = 'var(--teal-primary)'; e.target.style.color = 'white' }} onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--teal-primary)' }}>
            Ver Historial de Cursos
          </button>
        </div>

        {/* Section: Emergency Contacts */}
        <div className="profile-section" style={{ gridColumn: '1 / -1' }}>
          <div className="profile-section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red-emergency)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92z"></path></svg>
            <h2>Mis Contactos de Emergencia</h2>
          </div>

          {(contactError || contactSuccess) && (
            <div style={{ color: contactError ? '#EF4444' : 'var(--teal-primary)', marginTop: '1rem', fontWeight: 600 }}>
              {contactError || contactSuccess}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            {contacts.length === 0 ? (
              <p style={{ color: 'var(--blue-light)', margin: 0 }}>No hay contactos de emergencia registrados.</p>
            ) : contacts.map((contact) => (
              <div key={contact.id} style={{ padding: '1.25rem', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', display: 'grid', gap: '1rem', backgroundColor: 'var(--white)', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: '700', color: 'var(--blue-deep)', margin: '0 0 0.25rem 0' }}>{contact.name}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--blue-light)', margin: 0 }}>
                        {relationshipLabels[contact.relationship] || contact.relationship || 'Otro'}
                        {contact.is_primary ? ' - Principal' : ''}
                      </p>
                    </div>
                    <span style={{ color: 'var(--teal-primary)', fontWeight: '600', backgroundColor: 'var(--teal-surface)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{contact.phone}</span>
                  </div>
                  {contact.email && <p style={{ fontSize: '0.85rem', color: 'var(--blue-light)', margin: '0.75rem 0 0' }}>{contact.email}</p>}
                  {contact.notes && <p style={{ fontSize: '0.85rem', color: 'var(--blue-light)', margin: '0.5rem 0 0' }}>{contact.notes}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn" onClick={() => handleEditContact(contact)} style={{ backgroundColor: 'transparent', border: '1px solid var(--teal-primary)', color: 'var(--teal-primary)', padding: '0.55rem 0.9rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                    Editar
                  </button>
                  <button type="button" className="btn" onClick={() => handleDeleteContact(contact.id)} disabled={deletingContactId === contact.id} style={{ backgroundColor: 'transparent', border: '1px solid var(--red-emergency)', color: 'var(--red-emergency)', padding: '0.55rem 0.9rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                    {deletingContactId === contact.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleContactSubmit} style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--gray-200)', display: 'grid', gap: '1rem' }}>
            <h3 style={{ color: 'var(--blue-deep)', margin: 0, fontSize: '1.1rem' }}>
              {editingContactId ? 'Editar contacto' : 'Añadir nuevo contacto'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input name="name" className="form-input" value={contactForm.name} onChange={handleContactChange} placeholder="Nombre completo" />
              </div>
              <div className="form-group">
                <label className="form-label">Telefono</label>
                <input name="phone" className="form-input" value={contactForm.phone} onChange={handleContactChange} placeholder="+51999888777" />
              </div>
              <div className="form-group">
                <label className="form-label">Relacion</label>
                <select name="relationship" className="form-input" value={contactForm.relationship} onChange={handleContactChange}>
                  <option value="familiar">Familiar</option>
                  <option value="amigo">Amigo/a</option>
                  <option value="medico">Medico/a</option>
                  <option value="vecino">Vecino/a</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Email opcional</label>
                <input name="email" className="form-input" value={contactForm.email} onChange={handleContactChange} placeholder="contacto@correo.com" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notas</label>
              <input name="notes" className="form-input" value={contactForm.notes} onChange={handleContactChange} placeholder="Disponibilidad u observaciones" />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--blue-deep)', fontWeight: 600 }}>
              <input type="checkbox" name="is_primary" checked={contactForm.is_primary} onChange={handleContactChange} />
              Contacto principal
            </label>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" disabled={isContactSaving}>
                {isContactSaving ? 'Guardando...' : editingContactId ? 'Guardar cambios' : 'Añadir contacto'}
              </button>
              {editingContactId && (
                <button type="button" className="btn btn-secondary" onClick={resetContactForm} disabled={isContactSaving}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
