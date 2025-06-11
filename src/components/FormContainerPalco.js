'use client';

export default function FormContainerPalco({ children }) {
  return (
    <div className="max-w-md w-full mx-auto p-8 mt-8 bg-white/60 backdrop-blur-md shadow-xl rounded-2xl transition-all duration-300">
      {children}
    </div>
  );
}
