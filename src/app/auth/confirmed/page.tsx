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
      <header className="bg-[var(--color-brand)] px-6 py-4 shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/gymhajime-logo.png"
              alt="GymHajime logo"
              width={120}
              height={120}
              className="h-20 w-auto rounded-md shadow-lg bg-[var(--color-brand-light)]"
              priority
            />
            <div className="text-[var(--color-brand-soft)]">
              <h1 className="text-2xl font-bold leading-tight cursor-default">GymHajime</h1>
              <p className="text-sm font-semibold text-[var(--color-brand-dark)] cursor-default">
                {'Train with purpose'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin duration-1000 w-28 h-28 mx-auto text-[var(--color-brand)]" />
      </div>
    </>
  );
}
