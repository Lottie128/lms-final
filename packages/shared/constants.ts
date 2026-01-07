export const APP_NAME = 'IQ Didactic';
export const APP_DESCRIPTION = 'Enterprise Learning Management System';

// API Configuration
export const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001/api';
export const API_TIMEOUT = 30000;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Course Categories
export const COURSE_CATEGORIES = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Data Science',
  'Languages',
  'Mathematics',
  'Science',
  'Arts',
  'Other',
] as const;

// File Upload
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Theme
export const THEME_STORAGE_KEY = 'iq-didactic-theme';
export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  MY_COURSES: '/my-courses',
  ASSIGNMENTS: '/assignments',
  PROFILE: '/profile',
  ADMIN: '/admin',
} as const;

// Roles & Permissions
export const ROLE_PERMISSIONS = {
  ADMIN: ['*'],
  TEACHER: ['course:create', 'course:update', 'course:delete', 'assignment:grade'],
  STUDENT: ['course:enroll', 'assignment:submit'],
  MODERATOR: ['course:moderate', 'content:review'],
} as const;