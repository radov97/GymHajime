// Validations
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const isNotEmptyString = (str) => str.trim().length > 0;
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter.');
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]]/.test(password)) {
    errors.push('Password must include at least one special character.');
  }

  return errors;
};
