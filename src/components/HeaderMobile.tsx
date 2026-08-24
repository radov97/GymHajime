import AuthNavigation from './AuthNavigation';
import BrandLogo from './BrandLogo';
import HajimeInfo from './HajimeInfo';

export default function HeaderMobile() {
  return (
    <header className="shrink-0 border-b border-orange-600/40 bg-[var(--color-brand)] px-3 py-2 shadow-sm">
      <div className="flex h-10 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <BrandLogo
            width={40}
            height={40}
            className="h-9 w-9 rounded-md bg-[var(--color-brand-light)] shadow-sm ring-1 ring-white/30"
            priority
          />
          <span className="hidden truncate text-base font-black tracking-tight text-white min-[430px]:block">
            GymHajime
          </span>
        </div>
        <div className="flex min-w-0 shrink items-center justify-end gap-0.5">
          <HajimeInfo iconOnly />
          <AuthNavigation />
        </div>
      </div>
    </header>
  );
}
