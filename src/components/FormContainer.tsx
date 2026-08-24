'use client';

import type { HTMLAttributes, ReactNode } from 'react';

export interface FormContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  className?: string;
  noBg?: boolean;
}

export default function FormContainer({
  children,
  className = '',
  noBg = false,
  ...props
}: FormContainerProps) {
  const baseClasses =
    'max-w-md w-full mx-auto p-8 mt-8 backdrop-blur-md shadow-xl rounded-2xl transition-all duration-300';
  const bgClass = noBg ? '' : 'bg-white/60';

  return (
    <div className={`${baseClasses} ${bgClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
