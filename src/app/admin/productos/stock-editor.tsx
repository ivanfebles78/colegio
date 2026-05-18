"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function StockEditor({
  kind,
  id,
  currentStock,
}: {
  kind: "BOOK" | "UNIFORM";
  id: string;
  currentStock: number;
}) {
  const [value, setValue] = useState(currentStock);
  const [saving, setSaving] = useState(false);
  const dirty = value !== currentStock;

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id, newStock: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      if (data.notified > 0) {
        toast.success(
          `Stock actualizado. ${data.notified} ${data.notified === 1 ? "persona avisada" : "personas avisadas"}.`,
        );
      } else {
        toast.success("Stock actualizado");
      }
      currentStock = value;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
      setValue(currentStock);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <Input
        type="number"
        min={0}
        max={9999}
        value={value}
        onChange={(e) => setValue(Math.max(0, parseInt(e.target.value || "0", 10)))}
        className={cn(
          "h-8 w-20 text-right px-2 text-sm tabular-nums",
          currentStock === 0 && "border-destructive/40",
        )}
      />
      <button
        type="button"
        onClick={save}
        disabled={!dirty || saving}
        className={cn(
          "h-8 w-8 grid place-items-center rounded-md transition-colors",
          dirty && !saving ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground",
        )}
        aria-label="Guardar stock"
      >
        <Save className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
