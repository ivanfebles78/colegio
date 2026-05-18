"use client";

import { useState } from "react";
import { UniformItemCard, type UniformItemData } from "@/components/uniform-item-card";
import { cn } from "@/lib/utils";

type GenderFilter = "ALL" | "UNISEX" | "NINO" | "NINA";
type SectionFilter = "ALL" | "DEPORTE" | "VESTIR" | "CALZADO" | "ABRIGO";

const sections: { key: SectionFilter; label: string }[] = [
  { key: "ALL", label: "Todo el uniforme" },
  { key: "DEPORTE", label: "Deporte" },
  { key: "VESTIR", label: "Vestir" },
  { key: "CALZADO", label: "Calzado" },
  { key: "ABRIGO", label: "Abrigo" },
];

const genders: { key: GenderFilter; label: string }[] = [
  { key: "ALL", label: "Todos" },
  { key: "UNISEX", label: "Unisex" },
  { key: "NINO", label: "Niño" },
  { key: "NINA", label: "Niña" },
];

export function UniformGrid({ items }: { items: UniformItemData[] }) {
  const [section, setSection] = useState<SectionFilter>("ALL");
  const [gender, setGender] = useState<GenderFilter>("ALL");

  const filtered = items.filter((i) => {
    if (section !== "ALL" && i.section !== section) return false;
    if (gender !== "ALL") {
      // Mostrar UNISEX para cualquier filtro de género; filtrar género específico.
      if (gender === "NINO" && !(i.gender === "NINO" || i.gender === "UNISEX")) return false;
      if (gender === "NINA" && !(i.gender === "NINA" || i.gender === "UNISEX")) return false;
      if (gender === "UNISEX" && i.gender !== "UNISEX") return false;
    }
    return true;
  });

  return (
    <div>
      <div className="card-elevated p-4 md:p-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {sections.map((s) => (
            <FilterChip
              key={s.key}
              active={section === s.key}
              onClick={() => setSection(s.key)}
            >
              {s.label}
            </FilterChip>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">Filtrar:</span>
          {genders.map((g) => (
            <FilterChip
              key={g.key}
              active={gender === g.key}
              onClick={() => setGender(g.key)}
            >
              {g.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-5">
        Mostrando {filtered.length} de {items.length} prendas
      </div>

      {filtered.length === 0 ? (
        <div className="card-elevated p-10 text-center text-muted-foreground">
          No hay prendas que coincidan con el filtro actual.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <UniformItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-foreground/80 hover:bg-secondary/70 border border-border",
      )}
    >
      {children}
    </button>
  );
}
