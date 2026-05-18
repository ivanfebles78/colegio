"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs hover:bg-secondary"
      aria-label="Cerrar sesión"
    >
      <LogOut className="h-3.5 w-3.5" />
      Salir
    </button>
  );
}
