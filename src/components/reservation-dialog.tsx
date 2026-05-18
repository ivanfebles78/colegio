"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BellRing } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ReservationTarget {
  kind: "BOOK" | "UNIFORM";
  refId?: string;
  productName: string;
  productDetail?: string;
}

export function ReservationDialog({
  target,
  triggerLabel = "Avisarme cuando llegue",
  variant = "outline",
}: {
  target: ReservationTarget;
  triggerLabel?: string;
  variant?: "default" | "outline" | "secondary";
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: target.kind,
          refId: target.refId,
          productName: target.productName,
          productDetail: target.productDetail,
          parentName: data.get("parentName"),
          childName: data.get("childName"),
          contactEmail: data.get("contactEmail"),
          contactPhone: data.get("contactPhone"),
          notifyEmail: data.get("notifyEmail") === "on",
          notifySms: data.get("notifySms") === "on",
          notifyWhatsapp: data.get("notifyWhatsapp") === "on",
          requestNotes: data.get("requestNotes") || undefined,
        }),
      });
      if (!res.ok) throw new Error("Error al guardar la reserva");
      toast.success("Reserva registrada", {
        description: "Te avisaremos en cuanto tengamos stock.",
      });
      setOpen(false);
    } catch (err) {
      toast.error("No hemos podido registrar tu reserva. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm">
          <BellRing className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Avisarme cuando vuelva a estar disponible</DialogTitle>
          <DialogDescription>
            Producto: <strong>{target.productName}</strong>
            {target.productDetail ? ` — ${target.productDetail}` : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="parentName">Nombre del padre / madre</Label>
              <Input id="parentName" name="parentName" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="childName">Nombre del alumno/a</Label>
              <Input id="childName" name="childName" required />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="contactEmail">Correo electrónico</Label>
            <Input id="contactEmail" name="contactEmail" type="email" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="contactPhone">Teléfono móvil (para SMS/WhatsApp)</Label>
            <Input id="contactPhone" name="contactPhone" type="tel" placeholder="+34 600 00 00 00" />
          </div>
          <div className="rounded-lg border border-border bg-secondary/40 p-3 grid gap-2 text-sm">
            <div className="font-medium text-foreground">¿Cómo quieres que te avisemos?</div>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="notifyEmail" defaultChecked />
              Por email
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="notifySms" />
              Por SMS <span className="text-muted-foreground text-xs">(se activará próximamente)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="notifyWhatsapp" />
              Por WhatsApp <span className="text-muted-foreground text-xs">(se activará próximamente)</span>
            </label>
          </div>
          {target.kind === "BOOK" && !target.refId ? (
            <div className="grid gap-1.5">
              <Label htmlFor="requestNotes">¿Qué libro estás buscando?</Label>
              <Textarea id="requestNotes" name="requestNotes" placeholder="Describe el libro o referencia..." />
            </div>
          ) : null}
          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : "Reservar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
