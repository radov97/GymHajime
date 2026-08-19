'use client';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Header from './Header';
import HeaderMobile from './HeaderMobile';
import { BREAKPOINTS } from '@/lib/breakpoints';

export default function ResponsiveHeader() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS.mobileMax });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // 🛡️ prevent mismatch

  return isMobile ? <HeaderMobile /> : <Header />;
}
