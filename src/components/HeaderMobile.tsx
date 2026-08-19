import Image from 'next/image';
import AuthNavigation from './AuthNavigation';

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
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-[var(--color-brand-soft)] font-semibold sm:inline">
            GymHajime
          </span>
          <AuthNavigation />
        </div>
      </div>
    </header>
  );
}
