'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import Input from '@/components/Input';
import Button from '@/components/Button';
import GoogleButton from '@/components/GoogleButton';
import Link from 'next/link';
import { ButtonRank, ButtonType, InputType, LoginFailureCodes } from '@/lib/enums';
import { isValidEmail, useValidatedPassword } from '@/lib/helperFunctions';
import { useLocale, useTranslations } from 'next-intl';
import FormContainer from '@/components/FormContainer';
import ClientOnly from '@/lib/ClientOnly';
import ModalPopup from '@/components/ModalPopup';
import { Loader } from 'lucide-react';

export default function LoginPage() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
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
  const [loginErrorText, setLoginErrorText] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const validatePassword = useValidatedPassword();

  useEffect(() => {
    // Keep authenticated users out of the login route when they enter or paste
    // it manually. replace() also prevents Back from returning to the login page.
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace(`/${locale}/dashboard`);
        return;
      }

      setIsCheckingSession(false);
    });
  }, [locale, router]);

  // Avoid briefly exposing the login form while an existing session is checked.
  if (isCheckingSession) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center" role="status">
        <Loader className="h-10 w-10 animate-spin text-[var(--color-brand)]" aria-hidden="true" />
        <span className="sr-only">Checking session...</span>
      </main>
    );
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
    isPasswordTouched &&
    !hasEmailError &&
    !hasPasswordError &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    !isTyping;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setLoginErrorText('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      switch (error.code) {
        case LoginFailureCodes.EmailNotConfirmed:
          setLoginErrorText(t('validations.login-error-email-not-confirmed'));
          break;
        case LoginFailureCodes.InvalidCredentials:
          setLoginErrorText(t('validations.login-error-invalid-credentials'));
          break;
        default:
          console.error(error.message);
          setLoginErrorText(t('validations.signup-error'));
          break;
      }
    } else {
      router.push(`/${locale}/dashboard`);
    }

    setLoading(false);
  };

  async function signInWithGoogle() {
    setLoading(true);
    setLoginErrorText('');
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`; // go to dashboard when ready

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('Google login error:', error.message);
      setLoginErrorText(t('validations.signup-error'));
    }
    setLoading(false);
  }

  return (
    <>
      <FormContainer>
        <h2 className="text-2xl font-bold text-[var(--color-brand-ink)] mb-2 text-center cursor-default">
          {t('login.login')}
        </h2>
        <p className="mb-4 text-sm text-gray-600 text-center cursor-default">
          {t('login.welcome-message')}
        </p>
        <GoogleButton text={t('login.google-sign-in')} onClick={signInWithGoogle} />

        <ClientOnly>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type={InputType.Email}
              placeholder={t('login.email')}
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (!isEmailTouched) setIsEmailTouched(true);
                setEmail(e.target.value);
              }}
              onDebouncedChange={handleEmailDebounced}
              error={hasEmailError}
              errorText={emailErrorText}
              required
              setIsTyping={setIsTyping}
            />
            <Input
              type={InputType.Password}
              placeholder={t('login.password')}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
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

            <Button
              text={t('login.forgot-password')}
              type={ButtonType.Button}
              rank={ButtonRank.Link}
              onClick={() => setShowForgotModal(true)}
              className="!w-auto !border-0 !bg-transparent !p-0 text-left font-medium hover:underline"
            />

            <Button
              type={ButtonType.Submit}
              rank={ButtonRank.Primary}
              text={t('login.login')}
              loading={loading}
              disabled={!isFormValid}
            />
          </form>
        </ClientOnly>

        {loginErrorText && <p className="text-red-600 mt-4">{loginErrorText}</p>}

        <p className="mt-4 text-sm text-center cursor-default">
          {t('login.new-user')}{' '}
          <Link
            href={`/${locale}/signup`}
            className="text-[var(--color-brand)] text-sm font-medium hover:underline"
          >
            {t('login.sign-up')}
          </Link>
        </p>
      </FormContainer>
      {/* Forgot Password Modal */}
      <ModalPopup
        isOpen={showForgotModal}
        title={'Forgot Password'}
        buttons={[
          {
            text: 'Cancel',
            onClick: () => setShowForgotModal(false),
            rank: ButtonRank.Secondary,
            type: ButtonType.Button,
          },
          {
            text: 'Send',
            onClick: () => {
              alert('Reset link sent'); // Replace with real logic
              setShowForgotModal(false);
            },
            type: ButtonType.Button,
            rank: ButtonRank.Primary,
          },
        ]}
      >
        <p className="text-sm text-gray-600 mb-2">{'Add instructions here'}</p>

        <Input type="email" placeholder={t('login.email')} onChange={() => {}} />
      </ModalPopup>
    </>
  );
}
