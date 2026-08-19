import Image from 'next/image';
import AuthNavigation from './AuthNavigation';

export default function HeaderMobile() {
  return (
    <header className="bg-[var(--color-brand)] p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center gap-1">
          <Image
            src="/gymhajime-logo.png"
            alt="GymHajime logo"
            width={48}
            height={48}
            className="h-12 w-auto rounded shadow bg-[var(--color-brand-light)]"
            priority
          />
          <span className="text-xs font-semibold tracking-wide text-[var(--color-brand-soft)]">
            GymHajime
          </span>
        </div>
        <AuthNavigation />
      </div>
    </header>
  );
}
