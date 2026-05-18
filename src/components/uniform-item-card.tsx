"use client";

import { useState } from "react";
import Image from "next/image";
import { Shirt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "./add-to-cart-button";
import { ReservationDialog } from "./reservation-dialog";
import { formatEuro, cn } from "@/lib/utils";

export interface UniformVariantData {
  id: string;
  size: string;
  stock: number;
  priceCents: number | null;
  sku: string;
}

export interface UniformItemData {
  id: string;
  name: string;
  description: string | null;
  section: string;
  gender: "UNISEX" | "NINO" | "NINA";
  basePriceCents: number;
  imageUrl: string | null;
  variants: UniformVariantData[];
}

const sectionTones: Record<string, string> = {
  DEPORTE: "from-emerald-900 to-emerald-700 text-emerald-50",
  VESTIR: "from-slate-800 to-slate-600 text-slate-50",
  CALZADO: "from-zinc-900 to-zinc-700 text-zinc-50",
  ABRIGO: "from-emerald-950 to-emerald-800 text-emerald-50",
  COMPLEMENTOS: "from-amber-800 to-amber-600 text-amber-50",
};

export function UniformItemCard({ item }: { item: UniformItemData }) {
  const [selectedId, setSelectedId] = useState<string | null>(
    item.variants.find((v) => v.stock > 0)?.id ?? item.variants[0]?.id ?? null,
  );

  const selected = item.variants.find((v) => v.id === selectedId) ?? null;
  const price = selected?.priceCents ?? item.basePriceCents;
  const tone = sectionTones[item.section] ?? "from-slate-700 to-slate-500 text-slate-50";

  return (
    <article className="card-elevated overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/40">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4"
          />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-br flex items-center justify-center", tone)}>
            <Shirt className="h-20 w-20 opacity-40" strokeWidth={1} />
          </div>
        )}
        <div className="absolute left-3 top-3 z-10">
          <Badge variant="outline" className="bg-card/95 backdrop-blur">
            {prettySection(item.section)}
          </Badge>
        </div>
        {item.gender !== "UNISEX" && (
          <div className="absolute right-3 top-3 z-10">
            <Badge variant="outline" className="bg-card/95 backdrop-blur">
              {item.gender === "NINO" ? "Niño" : "Niña"}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-medium text-lg leading-snug">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{item.description}</p>
        )}

        <div className="mt-4">
          <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">
            Talla
          </div>
          <div className="flex flex-wrap gap-1.5">
            {item.variants.map((v) => {
              const isSelected = v.id === selectedId;
              const isOut = v.stock <= 0;
              return (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => setSelectedId(v.id)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : isOut
                        ? "border-border bg-muted text-muted-foreground line-through"
                        : "border-border bg-card hover:border-primary/40",
                  )}
                  title={isOut ? "Agotado" : `${v.stock} en stock`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div>
            <div className="text-xl font-semibold text-primary">{formatEuro(price)}</div>
            {selected && selected.stock > 0 && (
              <div className="text-[11px] text-muted-foreground">{selected.stock} en stock</div>
            )}
            {selected && selected.stock <= 0 && (
              <div className="text-[11px] text-destructive">Sin stock en esta talla</div>
            )}
          </div>
          {selected && selected.stock > 0 ? (
            <AddToCartButton
              size="sm"
              line={{
                key: `uniform-${selected.id}`,
                kind: "UNIFORM",
                refId: selected.id,
                name: item.name,
                detail: `Talla ${selected.size}`,
                imageUrl: item.imageUrl ?? undefined,
                unitPriceCents: price,
                stockAvailable: selected.stock,
              }}
            />
          ) : (
            <ReservationDialog
              target={{
                kind: "UNIFORM",
                refId: selected?.id,
                productName: item.name,
                productDetail: selected ? `Talla ${selected.size}` : undefined,
              }}
              triggerLabel="Reservar"
            />
          )}
        </div>
      </div>
    </article>
  );
}

function prettySection(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}
