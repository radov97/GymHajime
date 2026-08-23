import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Supabase's Node build includes optional, dynamically loaded Realtime dependencies. Keeping the
  // package external lets the Node.js runtime load them normally instead of asking webpack to
  // statically analyze those dynamic imports in API route bundles.
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default withNextIntl(nextConfig);
