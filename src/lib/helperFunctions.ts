'use client';
import { useTranslations } from 'next-intl';

// Validations
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const isNotEmptyString = (str: string) => str.trim().length > 0;

export const useValidatedPassword = () => {
  const t = useTranslations('validations');

  return (password: string): string[] => {
    const errors: string[] = [];

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
