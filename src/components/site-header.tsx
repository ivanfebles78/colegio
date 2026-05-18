"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { schoolConfig } from "@/lib/school-config";
import { useCart } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const count = useCart((s) => s.count());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span
            aria-hidden
            className="inline-grid h-10 w-10 place-items-center rounded-full border border-primary/30 bg-primary text-primary-foreground font-serif text-base"
          >
            ℋℬ
          </span>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Tienda oficial
            </div>
            <div className="font-medium tracking-tight">{schoolConfig.shortName}</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Inicio
          </Link>
          <Link href="/#cursos" className="text-foreground/80 hover:text-foreground transition-colors">
            Libros por curso
          </Link>
          <Link href="/uniforme" className="text-foreground/80 hover:text-foreground transition-colors">
            Uniforme
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/carrito"
            className="relative inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm hover:bg-secondary transition-colors"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Cesta</span>
            {mounted && count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-grid h-5 min-w-[20px] place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
