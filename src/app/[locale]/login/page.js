'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import InputPalco from '@/components/InputPalco';
import ButtonPalco from '@/components/ButtonPalco';
import GoogleButtonPalco from '@/components/GoogleButtonPalco';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfafb] px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-xl text-center">
        <h1 className="text-3xl font-bold mb-2">Sign in</h1>
        <p className="text-gray-600 mb-6">Hey there... Welcome back!</p>

        <GoogleButtonPalco className="mb-6" />

        <form onSubmit={handleLogin} className="space-y-4">
          <InputPalco
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputPalco
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="text-right text-sm">
            <button
              type="button"
              onClick={() => {
                // TODO: Open your modal logic here
              }}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Forgot your password?
            </button>
          </div>

          <ButtonPalco type="submit" text="Sign in" loading={loading} className="mt-2" />
        </form>

        <p className="mt-6 text-sm text-gray-700">
          New User?{' '}
          <Link href="/signup" className="text-blue-700 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

        {errorParam && (
          <p className="mt-4 text-sm text-red-500">{decodeURIComponent(errorParam)}</p>
        )}
      </div>
    </div>
  );
}
