import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { defaultLocale, isLocale } from '@/i18n/i18n';

export default async function Home() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('NEXT_LOCALE')?.value;

  // Reuse the visitor's last explicit language choice. Unknown or modified
  // cookie values safely fall back to English instead of creating invalid URLs.
  const locale = savedLocale && isLocale(savedLocale) ? savedLocale : defaultLocale;

  redirect(`/${locale}`);
}
