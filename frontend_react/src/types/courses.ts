export type CourseLevel = 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
export type MediaType = 'VIDEO' | 'AUDIO' | 'PDF' | 'IMAGEN' | 'NINGUNO';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent?: string;
  icon_url?: string;
}

export interface Course {
  id: string;
  category: Category;
  category_id?: string;
  author?: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail_url?: string;
  level: CourseLevel;
  duration_min: number;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at?: string;
  rating_avg?: number;
  lesson_count?: number;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  question: string;
  options: { key: string; text: string }[];
  correct_option: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  course: string;
  title: string;
  content?: string;
  media_url?: string;
  media_type: MediaType;
  order_index: number;
  duration_min: number;
  is_free: boolean;
  created_at: string;
  quizzes: Quiz[];
}

export interface CourseRating {
  id: string;
  user: string;
  user_name?: string;
  course: string;
  score: number;
  comment?: string;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user: string;
  course: string;
  enrolled_at: string;
  completed_at?: string;
}

export interface LessonProgress {
  id: string;
  enrollment_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  attempts: number;
  last_seen_at: string;
}

export interface Certificate {
  id: string;
  enrollment_id: string;
  code: string;
  issued_at: string;
}

export interface CourseFilters {
  category?: string;
  level?: CourseLevel | '';
  search?: string;
  ordering?: string;
  duration?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string | null;
  previous?: string | null;
}
