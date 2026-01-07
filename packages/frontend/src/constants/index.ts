export const APP_NAME = 'IQ Didactic';
export const APP_DESCRIPTION = 'Enterprise Learning Management System';

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

// Theme
export const THEME_STORAGE_KEY = 'iq-didactic-theme';
export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];
