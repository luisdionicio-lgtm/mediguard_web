// ── Entidades de usuario ──────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  phone?: string;
  roles: string[];
  is_active: boolean;
  is_verified: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface GoogleCredential {
  credential: string;
  clientId: string;
  select_by?: string;
}

// ── Aprendizaje (Spring Boot) ─────────────────────────────────────────────────

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  status: EnrollmentStatus;
  completedAt?: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  enrollmentId: string;
  completedAt: string;
}

export interface Certificate {
  id: string;
  enrollmentId: string;
  userId: string;
  issuedAt: string;
  certificateUrl?: string;
}
