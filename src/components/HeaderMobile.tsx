import Image from 'next/image';

export default function HeaderMobile() {
  return (
    <header className="bg-[var(--color-brand)] p-4 shadow-md">
      <div className="flex items-center justify-between">
        <Image
          src="/gymhajime-logo.png"
          alt="GymHajime logo"
          width={48}
          height={48}
          className="h-12 w-auto rounded shadow bg-[var(--color-brand-light)]"
          priority
        />
        <span className="text-sm text-[var(--color-brand-soft)] font-semibold">GymHajime</span>
      </div>
    </header>
  );
}
