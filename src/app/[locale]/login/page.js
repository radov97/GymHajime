'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import InputPalco from '@/components/InputPalco';
import ButtonPalco from '@/components/ButtonPalco';
import GoogleButtonPalco from '@/components/GoogleButtonPalco';
import Link from 'next/link';
import { ButtonRank, ButtonType, InputType } from '@/lib/enums';
import { isNotEmptyString, isValidEmail, useValidatedPassword } from '@/lib/helperFunctions';
import { useLocale, useTranslations } from 'next-intl';
import FormContainerPalco from '@/components/FormContainerPalco';
import ClientOnly from '@/lib/ClientOnly';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [hasEmailError, setHasEmailError] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState('');

  const [password, setPassword] = useState('');
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState('');

  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const locale = useLocale();
  const t = useTranslations();
  const validatePassword = useValidatedPassword();

  const handleEmailDebounced = (val) => {
    if (isValidEmail(val)) {
      setHasEmailError(false);
      setEmailErrorText('');
    } else {
      setHasEmailError(true);
      setEmailErrorText(t('validations.has-email-error'));
    }
  };

  const handlePasswordDebounced = (val) => {
    const errors = validatePassword(val);

    if (errors.length === 0) {
      setHasPasswordError(false);
      setPasswordErrorText('');
    } else {
      setHasPasswordError(true);
      setPasswordErrorText(errors[0]); // Show the first error for clarity
    }
  };

  const isFormValid =
    isEmailTouched &&
    isPasswordTouched &&
    !hasEmailError &&
    !hasPasswordError &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    !isTyping;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error(error.message);
      alert('Something went wrong. Please try again later.');
    } else {
      router.push('/');
    }

    setLoading(false);
  };

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  return (
    <FormContainerPalco>
      <h2 className="text-2xl font-bold text-[var(--color-palco-black)] mb-2 text-center cursor-default">
        {t('login.login')}
      </h2>
      <p className="mb-4 text-sm text-gray-600 text-center cursor-default">
        {t('login.welcome-message')}
      </p>
      <GoogleButtonPalco text={t('login.google-sign-in')} onClick={signInWithGoogle} />

      <ClientOnly>
        <form onSubmit={handleLogin} className="space-y-4">
          <InputPalco
            type={InputType.Email}
            placeholder={t('login.email')}
            value={email}
            onChange={(e) => {
              if (!isEmailTouched) setIsEmailTouched(true);
              setEmail(e.target.value);
            }}
            onDebouncedChange={handleEmailDebounced}
            error={hasEmailError}
            errorText={emailErrorText}
            required
            setIsTyping={setIsTyping}
          />
          <InputPalco
            type={InputType.Password}
            placeholder={t('login.password')}
            value={password}
            onChange={(e) => {
              if (!isPasswordTouched) setIsPasswordTouched(true);
              setPassword(e.target.value);
            }}
            onDebouncedChange={handlePasswordDebounced}
            error={hasPasswordError}
            errorText={passwordErrorText}
            required
            showToggle
            setIsTyping={setIsTyping}
          />

          <button
            type="button"
            onClick={() => {
              // TODO: Open your modal logic here
            }}
            className="text-[var(--color-palco)] text-sm font-medium hover:underline text-left cursor-pointer"
          >
            {t('login.forgot-password')}
          </button>

          <ButtonPalco
            type={ButtonType.Submit}
            rank={ButtonRank.Primary}
            text={t('login.login')}
            loading={loading}
            disabled={!isFormValid}
          />
        </form>
      </ClientOnly>

      {errorParam && <p className="text-red-600 mt-4">{decodeURIComponent(errorParam)}</p>}

      <p className="mt-4 text-sm text-center cursor-default">
        {t('login.new-user')}{' '}
        <Link
          href={`/${locale}/signup`}
          className="text-[var(--color-palco)] text-sm font-medium hover:underline"
        >
          {t('login.sign-up')}
        </Link>
      </p>
    </FormContainerPalco>
  );
}
