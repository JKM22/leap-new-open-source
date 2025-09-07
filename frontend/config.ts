// API Configuration
// The backend URL is automatically configured by Encore in development and production
export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:4000' 
  : '';

// Feature flags
export const FEATURES = {
  REAL_TIME_COLLABORATION: false,
  CODE_DEPLOYMENT: false,
  ADVANCED_TEMPLATES: true,
  USER_AUTHENTICATION: false
};

// Code generation settings
export const CODE_GEN = {
  DEFAULT_FRAMEWORK: 'react',
  DEFAULT_STYLE: 'functional',
  INCLUDE_TESTS_BY_DEFAULT: true,
  MAX_PROMPT_LENGTH: 500
};

// UI Configuration
export const UI = {
  SIDEBAR_WIDTH: 256,
  THEME: 'dark',
  ACCENT_COLOR: '#eab308', // yellow-500
  ANIMATION_DURATION: 200
};
