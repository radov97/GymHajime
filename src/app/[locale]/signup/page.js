'use client';

import { useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import ClientOnly from '@/lib/ClientOnly';
import ButtonPalco from '@/components/ButtonPalco';
import InputPalco from '@/components/InputPalco';
import { ButtonRank, ButtonType, InputType } from '@/lib/enums';
import { isNotEmptyString, isValidEmail, validatePassword } from '@/lib/helperFunctions';

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

  const [error, setError] = useState('');
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('signup');

  async function handleSignup(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) setError(error.message);
    else router.push(`/${locale}/login`); // or redirect with locale
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
      setEmailErrorText('Please enter a valid email address.');
    }
  };

  const handleNameDebounced = (val) => {
    if (isNotEmptyString(val)) {
      setHasFullNameError(false);
      setFullNameErrorText('');
    } else {
      setHasFullNameError(true);
      setFullNameErrorText('Full name cannot be empty.');
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

  return (
    <div className="max-w-md mx-auto p-8 mt-8 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-[var(--color-palco-black)] mb-2 text-center cursor-default">
        {t('new-account')}
      </h2>
      <p className="mb-4 text-sm text-gray-600 text-center cursor-default">{t('sign-up-info')}</p>

      <button
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-2 border p-2 rounded mb-6 bg-white hover:bg-gray-50"
      >
        <Image src="/google-icon.png" alt="Google" width={40} height={40} />
        Sign up with Google
      </button>
      <ClientOnly>
        <form onSubmit={handleSignup} className="space-y-4">
          <InputPalco
            type={InputType.Email}
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onDebouncedChange={handleEmailDebounced}
            error={hasEmailError}
            errorText={emailErrorText}
          />

          <InputPalco
            type={InputType.Text}
            placeholder="Full Name"
            value={fullName}
            required
            onChange={(e) => setFullName(e.target.value)}
            onDebouncedChange={handleNameDebounced}
            error={hasFullNameError}
            errorText={fullNameErrorText}
          />

          <InputPalco
            type={InputType.Password}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onDebouncedChange={handlePasswordDebounced}
            showToggle
            error={hasPasswordError}
            errorText={passwordErrorText}
          />
          <ButtonPalco text={t('sign-up')} type={ButtonType.Submit} rank={ButtonRank.Primary} />
        </form>
      </ClientOnly>
      {error && <p className="text-red-600 mt-4">{error}</p>}

      <p className="mt-4 text-sm text-center cursor-default">
        {t('already-have-account')}{' '}
        <Link
          href={`/${locale}/login`}
          className="text-[var(--color-palco)] text-sm font-medium underline transition-all duration-200 ease-in-out hover:text-[17px]"
        >
          {t('sign-ip')}
        </Link>
      </p>
    </div>
  );
}
