import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  // Supabase's Node build includes optional, dynamically loaded Realtime dependencies. Keeping the
  // package external lets the Node.js runtime load them normally instead of asking webpack to
  // statically analyze those dynamic imports in API route bundles.
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    // Exercise images are served from this project's public Supabase Storage endpoint.
    remotePatterns: supabaseUrl ? [new URL('/storage/v1/object/public/**', supabaseUrl)] : [],
  },
};

export default withNextIntl(nextConfig);
