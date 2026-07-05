"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Shield } from "lucide-react";

export default function AdminPanelHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Shield className="h-5 w-5 text-scout-forest" />
          <h1 className="font-display text-2xl font-bold text-scout-charcoal">
            Panneau administrateur
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Statistiques et suivi interne — Troupe Alpha
        </p>
      </div>
      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={isLoggingOut}
        className="btn-secondary self-start disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
        {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
      </button>
    </div>
  );
}
