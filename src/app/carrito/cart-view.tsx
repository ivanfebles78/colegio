"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, BookOpen, Shirt } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { formatEuro } from "@/lib/utils";
import { CheckoutForm } from "./checkout-form";

export function CartView() {
  const { lines, setQty, remove, subtotalCents } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="card-elevated p-10 text-center text-muted-foreground">Cargando…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="card-elevated p-12 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" strokeWidth={1.2} />
        <h2 className="text-xl font-medium mb-2">Tu cesta está vacía</h2>
        <p className="text-muted-foreground mb-6">
          Empieza por elegir el curso de tu hijo/a o explora el uniforme oficial.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#cursos"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <BookOpen className="h-4 w-4" /> Libros por curso
          </Link>
          <Link
            href="/uniforme"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-6 text-sm font-medium hover:bg-secondary"
          >
            <Shirt className="h-4 w-4" /> Uniforme
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = subtotalCents();

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
      <div className="card-elevated divide-y divide-border">
        {lines.map((l) => (
          <div key={l.key} className="p-5 flex gap-4 items-start">
            <div className="relative h-20 w-16 rounded-md bg-secondary/40 flex-shrink-0 overflow-hidden">
              {l.imageUrl ? (
                <Image
                  src={l.imageUrl}
                  alt={l.name}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                  unoptimized={l.imageUrl.startsWith("http")}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  {l.kind === "BOOK" ? (
                    <BookOpen className="h-6 w-6 text-muted-foreground/60" strokeWidth={1.2} />
                  ) : (
                    <Shirt className="h-6 w-6 text-muted-foreground/60" strokeWidth={1.2} />
                  )}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
                {l.kind === "BOOK" ? "Libro" : "Uniforme"}
              </div>
              <div className="font-medium line-clamp-2">{l.name}</div>
              {l.detail && (
                <div className="text-xs text-muted-foreground mt-0.5">{l.detail}</div>
              )}
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="inline-flex items-center rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setQty(l.key, l.quantity - 1)}
                    disabled={l.quantity <= 1}
                    className="h-8 w-8 grid place-items-center hover:bg-secondary disabled:opacity-40"
                    aria-label="Disminuir"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm tabular-nums">{l.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQty(l.key, l.quantity + 1)}
                    disabled={l.quantity >= l.stockAvailable}
                    className="h-8 w-8 grid place-items-center hover:bg-secondary disabled:opacity-40"
                    aria-label="Aumentar"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">
                    {formatEuro(l.unitPriceCents * l.quantity)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {formatEuro(l.unitPriceCents)} / ud.
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(l.key)}
                  aria-label="Quitar"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="card-elevated p-6 lg:sticky lg:top-24 self-start">
        <h2 className="font-medium text-lg mb-4">Resumen</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatEuro(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recogida</span>
            <span className="text-emerald-700 font-medium">Gratis · en colegio</span>
          </div>
          <div className="h-px bg-border my-3" />
          <div className="flex justify-between text-lg">
            <span className="font-medium">Total</span>
            <span className="font-semibold text-primary">{formatEuro(subtotal)}</span>
          </div>
        </div>

        <div className="mt-6">
          <CheckoutForm />
        </div>

        <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed">
          Al continuar al pago aceptas que se procese el cobro a través de Stripe y que
          recogerás el pedido en secretaría del colegio.
        </p>
      </aside>
    </div>
  );
}
