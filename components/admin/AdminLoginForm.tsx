"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Shield } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        router.push("/admin/statistiques");
        router.refresh();
        return;
      }

      setError("Code incorrect.");
    } catch {
      setError("Code incorrect.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card-base border-scout-forest/10 px-6 py-8 sm:px-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-scout-forest/10 text-scout-forest">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="font-display text-xl font-bold text-scout-charcoal">
            Espace administrateur
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Accès réservé à Thomas Fadi Abdallah.
          </p>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <div>
            <label
              htmlFor="admin-code"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Code administrateur
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="admin-code"
                type="password"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-scout-charcoal outline-none transition-colors focus:border-scout-forest focus:ring-2 focus:ring-scout-forest/10"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Vérification..." : "Entrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
