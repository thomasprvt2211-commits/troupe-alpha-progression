import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-display text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-500">Page introuvable</p>
      <Link href="/" className="btn-primary mt-6">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
