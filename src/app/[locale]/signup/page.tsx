'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import ClientOnly from '@/lib/ClientOnly';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { ButtonRank, ButtonType, InputType } from '@/lib/enums';
import { isNotEmptyString, isValidEmail, useValidatedPassword } from '@/lib/helperFunctions';
import FormContainer from '@/components/FormContainer';
import GoogleButton from '@/components/GoogleButton';
import { Loader } from 'lucide-react';

export default function SignUpPage() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
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

  useEffect(() => {
    // Keep authenticated users out of the signup route when they enter or paste
    // it manually. replace() also prevents Back from returning to signup.
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace(`/${locale}/dashboard`);
        return;
      }

      setIsCheckingSession(false);
    });
  }, [locale, router]);

  // Avoid briefly exposing the signup form while an existing session is checked.
  if (isCheckingSession) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center" role="status">
        <Loader className="h-10 w-10 animate-spin text-[var(--color-brand)]" aria-hidden="true" />
        <span className="sr-only">Checking session...</span>
      </main>
    );
  }

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
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
    setIsLoading(true);
    setError(false);
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`; // go to dashboard when ready
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (oauthError) {
      console.error('Google sign up error:', oauthError.message);
      setError(true);
    }
    setIsLoading(false);
  }

  const handleEmailDebounced = (val: string) => {
    if (isValidEmail(val)) {
      setHasEmailError(false);
      setEmailErrorText('');
    } else {
      setHasEmailError(true);
      setEmailErrorText(t('validations.has-email-error'));
    }
  };

  const handleNameDebounced = (val: string) => {
    if (isNotEmptyString(val)) {
      setHasFullNameError(false);
      setFullNameErrorText('');
    } else {
      setHasFullNameError(true);
      setFullNameErrorText(t('validations.has-full-name-error'));
    }
  };

  const handlePasswordDebounced = (val: string) => {
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
    <FormContainer>
      <h2 className="text-2xl font-bold text-[var(--color-brand-ink)] mb-2 text-center cursor-default">
        {t('signup.new-account')}
      </h2>
      <p className="mb-4 text-sm text-gray-600 text-center cursor-default">
        {t('signup.sign-up-info')}
      </p>
      <GoogleButton text={t('signup.google-button')} onClick={signInWithGoogle} />

      <ClientOnly>
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            type={InputType.Email}
            placeholder={t('signup.email')}
            required
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (!isEmailTouched) setIsEmailTouched(true);
              setEmail(e.target.value);
            }}
            onDebouncedChange={handleEmailDebounced}
            error={hasEmailError}
            errorText={emailErrorText}
            setIsTyping={setIsTyping}
          />

          <Input
            type={InputType.Text}
            placeholder={t('signup.full-name')}
            value={fullName}
            required
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (!isFullNameTouched) setIsFullNameTouched(true);
              setFullName(e.target.value);
            }}
            onDebouncedChange={handleNameDebounced}
            error={hasFullNameError}
            errorText={fullNameErrorText}
            setIsTyping={setIsTyping}
          />

          <Input
            type={InputType.Password}
            placeholder={t('signup.password')}
            required
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (!isPasswordTouched) setIsPasswordTouched(true);
              setPassword(e.target.value);
            }}
            onDebouncedChange={handlePasswordDebounced}
            showToggle
            error={hasPasswordError}
            errorText={passwordErrorText}
            setIsTyping={setIsTyping}
          />
          <Button
            text={t('signup.sign-up')}
            type={ButtonType.Submit}
            rank={ButtonRank.Primary}
            disabled={!isFormValid}
            loading={isLoading}
          />
        </form>
      </ClientOnly>
      {error && <p className="text-red-600 mt-4">{t('validations.signup-error')}</p>}

      <p className="mt-4 text-sm text-center cursor-default">
        {t('signup.already-have-account')}{' '}
        <Link
          href={`/${locale}/login`}
          className="text-[var(--color-brand)] text-sm font-medium hover:underline"
        >
          {t('signup.sign-in')}
        </Link>
      </p>
    </FormContainer>
  );
}
