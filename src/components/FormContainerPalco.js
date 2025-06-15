'use client';

export default function FormContainerPalco({ children, className = '', noBg = false }) {
  const baseClasses =
    'max-w-md w-full mx-auto p-8 mt-8 backdrop-blur-md shadow-xl rounded-2xl transition-all duration-300';
  const bgClass = noBg ? '' : 'bg-white/60';

  return <div className={`${baseClasses} ${bgClass} ${className}`}>{children}</div>;
}
