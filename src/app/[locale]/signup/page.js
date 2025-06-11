'use client';

import { useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import ClientOnly from '@/lib/ClientOnly';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const locale = useLocale();

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

  return (
    <div className="max-w-md mx-auto p-8 mt-8 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-[var(--color-palco-black)] mb-2 text-center">
        New Account
      </h2>
      <p className="mb-4 text-sm text-gray-600 text-center">
        Sign up with Google or your email address
      </p>

      <button
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-2 border p-2 rounded mb-6 bg-white hover:bg-gray-50"
      >
        <Image src="/google-icon.png" alt="Google" width={40} height={40} />
        Sign up with Google
      </button>
      <ClientOnly>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none"
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 pr-10 rounded focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-600 hover:text-black"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--color-palco)] text-white font-semibold py-2 rounded hover:opacity-90"
          >
            Sign Up
          </button>
        </form>
      </ClientOnly>
      {error && <p className="text-red-600 mt-4">{error}</p>}

      <p className="mt-4 text-sm text-center">
        Already have an account?{' '}
        <Link href={`/${locale}/login`} className="text-[var(--color-palco)] font-medium underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
