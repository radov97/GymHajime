import '../../styles/globals.css';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n/i18n';
import ResponsiveHeader from '@/components/ResponsiveHeader';

export const metadata = {
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
async function loadMessages(locale) {
  try {
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    return messages;
  } catch (err) {
    console.error(`❌ Could not load messages for locale "${locale}"`, err);
    notFound();
  }
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await loadMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ResponsiveHeader />
      {children}
    </NextIntlClientProvider>
  );
}
