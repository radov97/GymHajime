'use client';
import { useTranslations } from 'next-intl';

// Validations
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const isNotEmptyString = (str) => str.trim().length > 0;

export const useValidatedPassword = () => {
  const t = useTranslations('validations');

  return (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push(t('password-error-1'));
    }

    if (!/[A-Z]/.test(password)) {
      errors.push(t('password-error-2'));
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]]/.test(password)) {
      errors.push(t('password-error-3'));
    }

    return errors;
  };
};
