import { useState, useEffect } from 'react';
import { Mail, User, BookOpen, PhoneCall } from 'lucide-react';
import { authService } from '../services/authService';
import { emergencyService } from '../services/emergencyService';
import { getApiErrorMessage } from '../services/errorService';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import Field from '../components/ui/Field';
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
  medico: 'Médico/a',
  vecino: 'Vecino/a',
  otro: 'Otro',
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ first_name: '', last_name: '', phone: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
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
        setProfileForm({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          phone: profileData.phone || '',
        });
        setContacts(contactData);
      } catch (error) {
        console.error("Error fetching profile", error);
        setError(getApiErrorMessage(error, 'No se pudo cargar el perfil.'));
      }
    };
    fetchProfile();
  }, []);

  const resetProfileForm = (profileData = profile) => {
    setProfileForm({
      first_name: profileData?.first_name || '',
      last_name: profileData?.last_name || '',
      phone: profileData?.phone || '',
    });
    setProfileError('');
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileForm.first_name.trim() || !profileForm.last_name.trim()) {
      setProfileError('El nombre y el apellido son obligatorios.');
      return;
    }
    if (profileForm.phone.trim() && !/^\+?\d{7,15}$/.test(profileForm.phone.trim())) {
      setProfileError('Ingresa un teléfono válido. Ejemplo: +51999888777');
      return;
    }

    setIsProfileSaving(true);
    try {
      const updatedProfile = await authService.updateProfile({
        first_name: profileForm.first_name.trim(),
        last_name: profileForm.last_name.trim(),
        phone: profileForm.phone.trim(),
      });
      setProfile(updatedProfile);
      resetProfileForm(updatedProfile);
      setIsEditingProfile(false);
      setProfileSuccess('Perfil actualizado correctamente.');
    } catch (err) {
      setProfileError(getApiErrorMessage(err, 'No se pudo actualizar el perfil.'));
    } finally {
      setIsProfileSaving(false);
    }
  };

  const cancelProfileEdit = () => {
    resetProfileForm();
    setIsEditingProfile(false);
  };

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
      return 'Ingresa un teléfono válido. Ejemplo: +51999888777';
    }

    if (contactForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email.trim())) {
      return 'Ingresa un correo de contacto válido.';
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
        <Alert variant="error">{error}</Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner center large label="Cargando perfil…" />
      </div>
    );
  }

  const nameToDisplay = profile.nombre ? profile.nombre : `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  const initials = nameToDisplay ? nameToDisplay.substring(0, 2).toUpperCase() : 'US';

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-header">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-title">
          <h1>{nameToDisplay}</h1>
          <p>
            <Mail size={18} />
            {profile.email}
          </p>
        </div>
        <div className="profile-badge">Estudiante / Ciudadano</div>
      </div>

      <div className="profile-grid">
        {/* Información personal */}
        <section className="profile-section">
          <div className="profile-section-header">
            <User size={22} />
            <h2>Información Personal</h2>
          </div>
          {profileError && <Alert variant="error">{profileError}</Alert>}
          {profileSuccess && <Alert variant="success">{profileSuccess}</Alert>}

          {isEditingProfile ? (
            <form onSubmit={handleProfileSubmit} className="contact-form">
              <div className="contact-form-grid">
                <Field
                  label="Nombre"
                  name="first_name"
                  value={profileForm.first_name}
                  onChange={handleProfileChange}
                />
                <Field
                  label="Apellido"
                  name="last_name"
                  value={profileForm.last_name}
                  onChange={handleProfileChange}
                />
                <Field
                  label="Teléfono"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  placeholder="+51999888777"
                />
              </div>
              <div className="contact-form-actions">
                <button type="submit" className="btn btn-primary" disabled={isProfileSaving}>
                  {isProfileSaving ? 'Guardando…' : 'Guardar perfil'}
                </button>
                <button type="button" className="btn btn-outline" onClick={cancelProfileEdit} disabled={isProfileSaving}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
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
                  <span className="info-label">Email</span>
                  <span className="info-value">{profile.email}</span>
                </li>
              </ul>
              <button
                type="button"
                className="btn btn-outline btn-full"
                style={{ marginTop: '1rem' }}
                onClick={() => { setProfileSuccess(''); setIsEditingProfile(true); }}
              >
                Editar información personal
              </button>
            </>
          )}
        </section>

        {/* Progreso educativo */}
        <section className="profile-section">
          <div className="profile-section-header">
            <BookOpen size={22} />
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
          <button type="button" className="btn btn-outline btn-full" style={{ marginTop: '1rem' }}>
            Ver Historial de Cursos
          </button>
        </section>

        {/* Contactos de emergencia */}
        <section className="profile-section full">
          <div className="profile-section-header danger">
            <PhoneCall size={22} />
            <h2>Mis Contactos de Emergencia</h2>
          </div>

          {contactError && <Alert variant="error">{contactError}</Alert>}
          {contactSuccess && <Alert variant="success">{contactSuccess}</Alert>}

          <div className="contact-grid">
            {contacts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                No hay contactos de emergencia registrados.
              </p>
            ) : contacts.map((contact) => (
              <div key={contact.id} className="contact-card">
                <div>
                  <div className="contact-card-top">
                    <div>
                      <p className="contact-name">{contact.name}</p>
                      <p className="contact-rel">
                        {relationshipLabels[contact.relationship] || contact.relationship || 'Otro'}
                        {contact.is_primary ? ' — Principal' : ''}
                      </p>
                    </div>
                    <span className="contact-phone">{contact.phone}</span>
                  </div>
                  {contact.email && <p className="contact-note">{contact.email}</p>}
                  {contact.notes && <p className="contact-note">{contact.notes}</p>}
                </div>
                <div className="contact-actions">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => handleEditContact(contact)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-emergency btn-sm"
                    onClick={() => handleDeleteContact(contact.id)}
                    disabled={deletingContactId === contact.id}
                  >
                    {deletingContactId === contact.id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleContactSubmit} className="contact-form">
            <h3>{editingContactId ? 'Editar contacto' : 'Añadir nuevo contacto'}</h3>

            <div className="contact-form-grid">
              <Field
                label="Nombre"
                name="name"
                value={contactForm.name}
                onChange={handleContactChange}
                placeholder="Nombre completo"
              />
              <Field
                label="Teléfono"
                name="phone"
                value={contactForm.phone}
                onChange={handleContactChange}
                placeholder="+51999888777"
              />
              <Field label="Relación" as="select" name="relationship" value={contactForm.relationship} onChange={handleContactChange}>
                <option value="familiar">Familiar</option>
                <option value="amigo">Amigo/a</option>
                <option value="medico">Médico/a</option>
                <option value="vecino">Vecino/a</option>
                <option value="otro">Otro</option>
              </Field>
              <Field
                label="Email opcional"
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleContactChange}
                placeholder="contacto@correo.com"
              />
            </div>

            <Field
              label="Notas"
              name="notes"
              value={contactForm.notes}
              onChange={handleContactChange}
              placeholder="Disponibilidad u observaciones"
            />

            <label className="contact-form-check">
              <input type="checkbox" name="is_primary" checked={contactForm.is_primary} onChange={handleContactChange} />
              Contacto principal
            </label>

            <div className="contact-form-actions">
              <button type="submit" className="btn btn-primary" disabled={isContactSaving}>
                {isContactSaving ? 'Guardando…' : editingContactId ? 'Guardar cambios' : 'Añadir contacto'}
              </button>
              {editingContactId && (
                <button type="button" className="btn btn-outline" onClick={resetContactForm} disabled={isContactSaving}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
