'use client';

import { useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import ClientOnly from '@/lib/ClientOnly';
import ButtonPalco from '@/components/ButtonPalco';
import InputPalco from '@/components/InputPalco';
import { ButtonRank, ButtonType, InputType } from '@/lib/enums';
import { isNotEmptyString, isValidEmail, useValidatedPassword } from '@/lib/helperFunctions';
import FormContainerPalco from '@/components/FormContainerPalco';
import GoogleButtonPalco from '@/components/GoogleButtonPalco';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [hasEmailError, setHasEmailError] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState('');

  const [fullName, setFullName] = useState('');
  const [hasFullNameError, setHasFullNameError] = useState(false);
  const [fullNameErrorText, setFullNameErrorText] = useState('');

  const [password, setPassword] = useState('');
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState('');

  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isFullNameTouched, setIsFullNameTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const validatePassword = useValidatedPassword();

  async function handleSignup(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/confirmed`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName },
      },
    });

    setIsLoading(false);

    if (error) {
      console.error(error.message);
      setError(true);
    } else {
      router.push(`/${locale}/login`);
    }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  const handleEmailDebounced = (val) => {
    if (isValidEmail(val)) {
      setHasEmailError(false);
      setEmailErrorText('');
    } else {
      setHasEmailError(true);
      setEmailErrorText(t('validations.has-email-error'));
    }
  };

  const handleNameDebounced = (val) => {
    if (isNotEmptyString(val)) {
      setHasFullNameError(false);
      setFullNameErrorText('');
    } else {
      setHasFullNameError(true);
      setFullNameErrorText(t('validations.has-full-name-error'));
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
    isFullNameTouched &&
    isPasswordTouched &&
    !hasEmailError &&
    !hasFullNameError &&
    !hasPasswordError &&
    email.trim() !== '' &&
    fullName.trim() !== '' &&
    password.trim() !== '' &&
    !isTyping;

  return (
    <FormContainerPalco>
      <h2 className="text-2xl font-bold text-[var(--color-palco-black)] mb-2 text-center cursor-default">
        {t('signup.new-account')}
      </h2>
      <p className="mb-4 text-sm text-gray-600 text-center cursor-default">
        {t('signup.sign-up-info')}
      </p>
      <GoogleButtonPalco text={t('signup.google-button')} onClick={signInWithGoogle} />

      <ClientOnly>
        <form onSubmit={handleSignup} className="space-y-4">
          <InputPalco
            type={InputType.Email}
            placeholder={t('signup.email')}
            required
            value={email}
            onChange={(e) => {
              if (!isEmailTouched) setIsEmailTouched(true);
              setEmail(e.target.value);
            }}
            onDebouncedChange={handleEmailDebounced}
            error={hasEmailError}
            errorText={emailErrorText}
            setIsTyping={setIsTyping}
          />

          <InputPalco
            type={InputType.Text}
            placeholder={t('signup.full-name')}
            value={fullName}
            required
            onChange={(e) => {
              if (!isFullNameTouched) setIsFullNameTouched(true);
              setFullName(e.target.value);
            }}
            onDebouncedChange={handleNameDebounced}
            error={hasFullNameError}
            errorText={fullNameErrorText}
            setIsTyping={setIsTyping}
          />

          <InputPalco
            type={InputType.Password}
            placeholder={t('signup.password')}
            required
            value={password}
            onChange={(e) => {
              if (!isPasswordTouched) setIsPasswordTouched(true);
              setPassword(e.target.value);
            }}
            onDebouncedChange={handlePasswordDebounced}
            showToggle
            error={hasPasswordError}
            errorText={passwordErrorText}
            setIsTyping={setIsTyping}
          />
          <ButtonPalco
            text={t('signup.sign-up')}
            type={ButtonType.Submit}
            rank={ButtonRank.Primary}
            disabled={!isFormValid}
            loading={isLoading}
          />
        </form>
      </ClientOnly>
      {error && <p className="text-red-600 mt-4">{t('signup.signup-error')}</p>}

      <p className="mt-4 text-sm text-center cursor-default">
        {t('signup.already-have-account')}{' '}
        <Link
          href={`/${locale}/login`}
          className="text-[var(--color-palco)] text-sm font-medium underline transition-all duration-200 ease-in-out hover:text-[17px]"
        >
          {t('signup.sign-ip')}
        </Link>
      </p>
    </FormContainerPalco>
  );
}
