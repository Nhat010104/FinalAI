import { VALIDATION, MESSAGES } from './constants'

export const validateEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email)
}

export const validatePassword = (password) => {
  return password.length >= VALIDATION.MIN_PASSWORD_LENGTH
}

export const validateName = (name) => {
  return name.trim().length >= VALIDATION.MIN_NAME_LENGTH
}

export const validateLoginForm = (formData) => {
  if (!formData.email || !formData.password) {
    return { valid: false, error: MESSAGES.LOGIN.EMPTY_FIELDS }
  }

  if (!validateEmail(formData.email)) {
    return { valid: false, error: MESSAGES.LOGIN.INVALID_EMAIL }
  }

  return { valid: true }
}

export const validateRegisterForm = (formData) => {
  if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
    return { valid: false, error: MESSAGES.REGISTER.EMPTY_FIELDS }
  }

  if (!validateName(formData.name)) {
    return { valid: false, error: `Tên phải có ít nhất ${VALIDATION.MIN_NAME_LENGTH} ký tự` }
  }

  if (!validateEmail(formData.email)) {
    return { valid: false, error: MESSAGES.REGISTER.INVALID_EMAIL }
  }

  if (!validatePassword(formData.password)) {
    return { valid: false, error: MESSAGES.REGISTER.PASSWORD_TOO_SHORT }
  }

  if (formData.password !== formData.confirmPassword) {
    return { valid: false, error: MESSAGES.REGISTER.PASSWORDS_NOT_MATCH }
  }

  return { valid: true }
}

export const validatePostForm = (formData) => {
  if (!formData.title?.trim() || !formData.content?.trim()) {
    return { valid: false, error: MESSAGES.POST.EMPTY_TITLE }
  }

  return { valid: true }
}