'use client';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Header from './Header';
import HeaderMobile from './HeaderMobile';

export default function ResponsiveHeader() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // 🛡️ prevent mismatch

  return isMobile ? <HeaderMobile /> : <Header />;
}
