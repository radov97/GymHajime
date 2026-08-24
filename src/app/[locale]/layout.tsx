import '../../styles/globals.css';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { isLocale, locales, type Locale } from '@/i18n/i18n';
import ResponsiveHeader from '@/components/ResponsiveHeader';

export const metadata: Metadata = {
  title: 'GymHajime',
  description: 'Personalised workout planning and fitness tracking across web and mobile.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  other: {
    'theme-color': '#f97316',
  },
};

// Statically define supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// ✅ Load local messages (e.g. from /messages/en.json)
async function loadMessages(locale: Locale) {
  try {
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    return messages;
  } catch (err) {
    console.error(`❌ Could not load messages for locale "${locale}"`, err);
    notFound();
  }
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await loadMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex h-dvh flex-col overflow-hidden">
        <ResponsiveHeader />
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </NextIntlClientProvider>
  );
}
