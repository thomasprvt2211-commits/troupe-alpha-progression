import Image from "next/image";

const LOGO_PATH = "/images/branding/sdl-logo-groupe-sscc-batroun.png";

export default function FloatingGroupLogo() {
  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-40 md:bottom-auto md:right-4 md:top-1/2 md:-translate-y-1/2"
      aria-label="Logo Groupe SSCC Batroun"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200/80 bg-white p-1.5 shadow-card">
        <Image
          src={LOGO_PATH}
          alt="Logo Groupe SSCC Batroun"
          width={52}
          height={52}
          className="h-[52px] w-[52px] object-contain"
          priority={false}
        />
      </div>
    </div>
  );
}
