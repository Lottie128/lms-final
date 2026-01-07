// User & Auth Types
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  MODERATOR = 'MODERATOR',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  teacherId: string;
  teacher?: User;
  thumbnail?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  lessons?: Lesson[];
  enrollments?: Enrollment[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  content: string;
  videoUrl?: string;
  order: number;
  duration?: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Assignment Types
export interface Assignment {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  dueDate?: Date;
  maxPoints: number;
  createdAt: Date;
  updatedAt: Date;
  submissions?: Submission[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  fileUrls?: string[];
  grade?: number;
  feedback?: string;
  submittedAt: Date;
  gradedAt?: Date;
}

// Enrollment & Progress
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number;
}

export interface Progress {
  id: string;
  studentId: string;
  lessonId: string;
  completed: boolean;
  timeSpent: number;
  lastAccessedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignUpForm extends LoginForm {
  name: string;
  role: UserRole;
}

export interface CourseForm {
  title: string;
  description: string;
  category: string;
  thumbnail?: File;
}

export interface LessonForm {
  title: string;
  description?: string;
  content: string;
  videoUrl?: string;
  order: number;
}

export interface AssignmentForm {
  title: string;
  description: string;
  dueDate?: string;
  maxPoints: number;
}