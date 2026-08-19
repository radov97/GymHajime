import type { ReactNode } from 'react';
import AuthenticatedShell from '@/components/AuthenticatedShell';

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
