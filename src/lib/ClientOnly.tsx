'use client';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export default function ClientOnly({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return children;
}
