'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import InputPalco from '@/components/InputPalco';
import ButtonPalco from '@/components/ButtonPalco';
import GoogleButtonPalco from '@/components/GoogleButtonPalco';
import Link from 'next/link';
import { ButtonRank, ButtonType, InputType } from '@/lib/enums';
import { isNotEmptyString } from '@/lib/helperFunctions';
import { useLocale, useTranslations } from 'next-intl';
import FormContainerPalco from '@/components/FormContainerPalco';
import ClientOnly from '@/lib/ClientOnly';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const locale = useLocale();
  const t = useTranslations('login');

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
    // await supabase.auth.signInWithOAuth({ provider: 'google' });
    // check here what to do
  }

  return (
    <FormContainerPalco>
      <h2 className="text-2xl font-bold text-[var(--color-palco-black)] mb-2 text-center cursor-default">
        {t('login')}
      </h2>
      <p className="mb-4 text-sm text-gray-600 text-center cursor-default">
        {t('welcome-message')}
      </p>
      <GoogleButtonPalco text={t('google-sign-in')} onClick={signInWithGoogle} />

      <ClientOnly>
        <form onSubmit={handleLogin} className="space-y-4">
          <InputPalco
            type={InputType.Email}
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputPalco
            type={InputType.Password}
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            showToggle
          />

          <button
            type="button"
            onClick={() => {
              // TODO: Open your modal logic here
            }}
            className="text-[var(--color-palco)] text-sm font-medium hover:underline text-left cursor-pointer"
          >
            {t('forgot-password')}
          </button>

          <ButtonPalco
            type={ButtonType.Submit}
            rank={ButtonRank.Primary}
            text={t('login')}
            loading={loading}
            className="mt-2"
          />
        </form>
      </ClientOnly>
      {errorParam && <p className="text-red-600 mt-4">{decodeURIComponent(errorParam)}</p>}

      <p className="mt-4 text-sm text-center cursor-default">
        {t('new-user')}{' '}
        <Link
          href={`/${locale}/signup`}
          className="text-[var(--color-palco)] text-sm font-medium hover:underline"
        >
          {t('sign-up')}
        </Link>
      </p>
    </FormContainerPalco>
  );
}
