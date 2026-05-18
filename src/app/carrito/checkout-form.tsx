"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutForm() {
  const lines = useCart((s) => s.lines);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(e.currentTarget);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: data.get("parentName"),
          childName: data.get("childName"),
          contactEmail: data.get("contactEmail"),
          contactPhone: data.get("contactPhone"),
          customerNotes: data.get("customerNotes"),
          lines: lines.map((l) => ({
            kind: l.kind,
            refId: l.refId,
            quantity: l.quantity,
            unitPriceCents: l.unitPriceCents,
            name: l.name,
            detail: l.detail,
          })),
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Error en el checkout");

      // Stripe checkout URL — fuera de Stripe configurado se usa página de éxito directamente.
      window.location.href = body.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error en el pago");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="parentName">Padre / madre</Label>
        <Input id="parentName" name="parentName" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="childName">Alumno/a</Label>
        <Input id="childName" name="childName" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contactEmail">Email de contacto</Label>
        <Input id="contactEmail" name="contactEmail" type="email" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contactPhone">Teléfono móvil <span className="text-xs text-muted-foreground">(opcional)</span></Label>
        <Input id="contactPhone" name="contactPhone" type="tel" />
      </div>
      <Button type="submit" disabled={loading || lines.length === 0} className="w-full mt-1" size="lg">
        {loading ? "Procesando..." : "Continuar al pago"}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </Button>
    </form>
  );
}
