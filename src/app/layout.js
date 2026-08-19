import '../styles/globals.css';

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

export default function RootLayout({ children, params }) {
  const locale = params?.locale || 'en'; // default fallback

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
