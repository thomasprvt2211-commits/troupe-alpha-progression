"use client";

import { useEffect, useState } from "react";
import { Database, RefreshCw } from "lucide-react";
import {
  testSupabaseConnection,
  type SupabaseConnectionTestResult,
} from "@/src/lib/supabase/diagnostics";

export default function SupabaseDiagnosticsCard() {
  const [testResult, setTestResult] = useState<SupabaseConnectionTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [autoTestDone, setAutoTestDone] = useState(false);

  const runTest = async () => {
    setIsTesting(true);
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    if (autoTestDone || typeof window === "undefined") return;

    setAutoTestDone(true);
    void runTest();
  }, [autoTestDone]);

  return (
    <section className="card-base mb-8 border-dashed border-amber-200 bg-amber-50/40">
      <div className="mb-4 flex items-center gap-2 border-b border-amber-100 pb-4">
        <Database className="h-5 w-5 text-scout-forest" />
        <h3 className="font-display font-semibold text-scout-charcoal">
          Diagnostic Supabase (temporaire)
        </h3>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">Supabase configuré</dt>
          <dd className="font-medium text-scout-charcoal">
            {testResult ? (testResult.configured ? "Oui" : "Non") : "—"}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">URL Supabase utilisée</dt>
          <dd className="max-w-full break-all font-medium text-scout-charcoal">
            {testResult?.url ?? "—"}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">URL valide</dt>
          <dd className="font-medium text-scout-charcoal">
            {testResult ? (testResult.urlValid ? "Oui" : "Non") : "—"}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">Clé anon présente</dt>
          <dd className="font-medium text-scout-charcoal">
            {testResult ? (testResult.keyPresent ? "Oui" : "Non") : "—"}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">Résultat du test API</dt>
          <dd className="font-medium text-scout-charcoal">
            {testResult?.result ?? (isTesting ? "Test en cours..." : "—")}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">Badges en base</dt>
          <dd className="font-medium text-scout-charcoal">
            {testResult?.success ? testResult.count : "—"}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">Message d&apos;erreur exact</dt>
          <dd className="max-w-full break-all font-medium text-scout-charcoal">
            {testResult?.error ?? "—"}
          </dd>
        </div>
        {testResult?.success && (
          <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2">
            <p className="text-xs leading-relaxed text-green-900">
              La connexion Supabase via l&apos;API Next.js fonctionne. Les badges
              devraient se synchroniser entre appareils.
            </p>
          </div>
        )}
        {testResult?.networkTests && testResult.networkTests.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Tests réseau serveur (Vercel → Supabase)
            </p>
            {testResult.networkTests.map((test) => (
              <div
                key={test.url}
                className={`rounded-xl border px-3 py-2 ${
                  test.success
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <p className="text-xs font-semibold text-scout-charcoal">
                  {test.label} — {test.success ? "OK" : "Échec"}
                  {test.status !== null ? ` (HTTP ${test.status})` : ""}
                </p>
                <p className="max-w-full break-all text-[11px] text-gray-500">
                  {test.url}
                </p>
                {test.body && (
                  <p className="mt-1 max-w-full break-all text-[11px] text-gray-600">
                    Réponse : {test.body}
                  </p>
                )}
                {test.errorMessage && (
                  <p className="mt-1 max-w-full break-all text-[11px] text-red-800">
                    Erreur : {test.errorName ? `${test.errorName} — ` : ""}
                    {test.errorMessage}
                  </p>
                )}
                {test.errorCause && (
                  <p className="max-w-full break-all text-[11px] text-red-800">
                    Cause : {test.errorCause}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {testResult && !testResult.success && testResult.error && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-white/70 px-3 py-2">
            <p className="text-xs leading-relaxed text-amber-950">
              <span className="font-semibold">Conseil : </span>
              Vérifiez que le projet Supabase est actif, que la table{" "}
              <code className="text-[11px]">member_badges</code> existe (voir{" "}
              <code className="text-[11px]">supabase/schema.sql</code>), et que les
              variables Vercel sont correctes, puis redéployez.
            </p>
          </div>
        )}
      </dl>

      <button
        type="button"
        onClick={() => void runTest()}
        disabled={isTesting}
        className="btn-secondary mt-5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${isTesting ? "animate-spin" : ""}`} />
        {isTesting ? "Test en cours..." : "Tester la connexion Supabase"}
      </button>
    </section>
  );
}
