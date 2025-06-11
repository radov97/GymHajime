import Image from "next/image";

export default function HeaderMobile() {
  return (
    <header className="bg-[var(--color-palco)] p-4 shadow-md">
      <div className="flex items-center justify-between">
        <Image
          src="/palco-logo.png"
          alt="Palco logo"
          width={48}
          height={48}
          className="h-12 w-auto rounded shadow bg-[var(--color-palco-light)]"
          priority
        />
        <span className="text-sm text-[var(--color-palco-soft)] font-semibold">
          FindPalco
        </span>
      </div>
    </header>
  );
}
