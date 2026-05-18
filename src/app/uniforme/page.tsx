import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { UniformGrid } from "./uniform-grid";
import type { UniformItemData } from "@/components/uniform-item-card";

export const dynamic = "force-dynamic";
export const metadata = { title: "Uniforme oficial" };

export default async function UniformePage() {
  const items = await prisma.uniformItem.findMany({
    orderBy: { order: "asc" },
    include: { variants: { orderBy: { size: "asc" } } },
  });

  const data: UniformItemData[] = items.map((i) => ({
    id: i.id,
    name: i.name,
    description: i.description,
    section: i.section,
    gender: i.gender,
    basePriceCents: i.basePriceCents,
    imageUrl: i.imageUrl,
    variants: i.variants.map((v) => ({
      id: v.id,
      size: v.size,
      stock: v.stock,
      priceCents: v.priceCents,
      sku: v.sku,
    })),
  }));

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border/40">
          <div className="container-tight pt-12 pb-10">
            <div className="text-xs uppercase tracking-[0.2em] text-accent-foreground/70 mb-3">
              Uniforme oficial · 2025–2026
            </div>
            <h1 className="heading-display text-4xl md:text-5xl text-primary mb-3">
              Uniforme del colegio
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Prendas de chándal, vestir, calzado y abrigo. Filtra por niño o niña, elige la talla
              y comprueba la disponibilidad en tiempo real. Si una talla está agotada, podemos
              avisarte cuando vuelva a estar disponible.
            </p>
          </div>
        </section>

        <section className="container-tight py-12">
          <UniformGrid items={data} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
