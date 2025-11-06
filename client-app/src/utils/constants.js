// Validation patterns
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MIN_NAME_LENGTH: 2
}

// UI Messages
export const MESSAGES = {
  LOGIN: {
    EMPTY_FIELDS: 'Vui lòng điền đầy đủ thông tin',
    INVALID_EMAIL: 'Email không hợp lệ',
    SUCCESS: 'Đăng nhập thành công!'
  },
  REGISTER: {
    EMPTY_FIELDS: 'Vui lòng điền đầy đủ thông tin',
    INVALID_EMAIL: 'Email không hợp lệ',
    PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 6 ký tự',
    PASSWORDS_NOT_MATCH: 'Mật khẩu không khớp',
    SUCCESS: 'Đăng ký thành công!'
  },
  POST: {
    EMPTY_TITLE: 'Vui lòng nhập tiêu đề',
    EMPTY_CONTENT: 'Vui lòng nhập nội dung',
    EMPTY_COMMENT: 'Vui lòng nhập bình luận'
  }
}

// Default values
export const DEFAULTS = {
  POSTS_PER_PAGE: 10,
  SEARCH_DEBOUNCE: 300
}

// API endpoints (if using backend)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout'
  },
  VAT: {
    GET_ALL: '/api/vat',
    GET_BY_ID: '/api/vat/:id',
    UPLOAD: '/api/vat/upload',
    PUBLISH: '/api/vat/:id/publish'
  },
  POSTS: {
    GET_ALL: '/api/posts',
    CREATE: '/api/posts',
    UPDATE: '/api/posts/:id',
    DELETE: '/api/posts/:id'
  }
}