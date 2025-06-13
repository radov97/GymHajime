'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import Image from 'next/image';

export default function AuthConfirmedRedirect() {
  const router = useRouter();

  useEffect(() => {
    const baseLang = navigator.language?.split('-')[0] || 'en';
    router.replace(`/${baseLang}/auth/confirmed`);
  }, [router]);

  return (
    <>
      <header className="bg-[var(--color-palco)] px-6 py-4 shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/palco-logo.png"
              alt="Palco logo"
              width={120}
              height={120}
              className="h-20 w-auto rounded-md shadow-lg bg-[var(--color-palco-light)]"
              priority
            />
            <div className="text-[var(--color-palco-soft)]">
              <h1 className="text-2xl font-bold leading-tight cursor-default">FindPalco</h1>
              <p className="text-sm font-medium text-[var(--color-palco-accent)] cursor-default">
                {'Connect Beyond Travel'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin duration-1000 w-28 h-28 mx-auto text-[var(--color-palco)]" />
      </div>
    </>
  );
}
