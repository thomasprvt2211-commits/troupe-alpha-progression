"use client";

import { useEffect, useState } from "react";
import { Database, RefreshCw } from "lucide-react";
import { getSupabaseDiagnostics } from "@/src/lib/supabase/config";
import {
  testSupabaseConnection,
  type SupabaseConnectionTestResult,
} from "@/src/lib/supabase/diagnostics";

export default function SupabaseDiagnosticsCard() {
  const diagnostics = getSupabaseDiagnostics();
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
            {diagnostics.configured ? "Oui" : "Non"}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">URL Supabase utilisée</dt>
          <dd className="max-w-full break-all font-medium text-scout-charcoal">
            {diagnostics.url}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">URL valide</dt>
          <dd className="font-medium text-scout-charcoal">
            {diagnostics.urlValid ? "Oui" : "Non"}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">Clé anon présente</dt>
          <dd className="font-medium text-scout-charcoal">
            {diagnostics.anonKeyPresent ? "Oui" : "Non"}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">Résultat du test fetch</dt>
          <dd className="font-medium text-scout-charcoal">
            {testResult?.result ?? (isTesting ? "Test en cours..." : "—")}
          </dd>
        </div>
        {testResult?.statusCode !== null && testResult?.statusCode !== undefined && (
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-gray-500">Code HTTP</dt>
            <dd className="font-medium text-scout-charcoal">{testResult.statusCode}</dd>
          </div>
        )}
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-gray-500">Message d&apos;erreur exact</dt>
          <dd className="max-w-full break-all font-medium text-scout-charcoal">
            {testResult?.errorDetail ?? "—"}
          </dd>
        </div>
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
