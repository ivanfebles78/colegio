import { prisma } from "@/lib/prisma";
import { StockEditor } from "./stock-editor";
import { formatEuro } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { protectAdminPage } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gestión de productos" };

export default async function AdminProductosPage() {
  await protectAdminPage();
  const [books, items] = await Promise.all([
    prisma.book.findMany({
      orderBy: [{ stock: "asc" }, { title: "asc" }],
      include: { category: true, course: true },
    }),
    prisma.uniformItem.findMany({
      orderBy: { order: "asc" },
      include: { variants: { orderBy: { size: "asc" } } },
    }),
  ]);

  return (
    <div className="container-tight py-10">
      <h1 className="heading-display text-3xl text-primary mb-2">Productos</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Actualiza el stock. Al pasar un producto de 0 a {">"}0 se enviará automáticamente
        un aviso a quien lo haya reservado.
      </p>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-semibold uppercase tracking-[0.15em] text-sm text-primary">
            Libros
          </h2>
          <span className="text-xs text-muted-foreground">{books.length} en catálogo</span>
        </div>
        <div className="card-elevated overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Libro</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Curso</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Editorial / ISBN</th>
                <th className="text-right px-4 py-3">Precio</th>
                <th className="text-right px-4 py-3">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {books.map((b) => (
                <tr key={b.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="font-medium leading-snug">{b.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {b.category.name}
                      {b.exclusiveAtSchool && (
                        <Badge variant="accent" className="ml-2 text-[10px] py-0">Solo colegio</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs">
                    {b.course.shortName}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs">
                    <div>{b.publisher}</div>
                    {b.isbn && <div className="text-muted-foreground">{b.isbn}</div>}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatEuro(b.priceCents)}</td>
                  <td className="px-4 py-3 text-right">
                    <StockEditor kind="BOOK" id={b.id} currentStock={b.stock} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-semibold uppercase tracking-[0.15em] text-sm text-primary">
            Uniforme
          </h2>
          <span className="text-xs text-muted-foreground">{items.length} prendas</span>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card-elevated p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.section} · {item.gender === "UNISEX" ? "Unisex" : item.gender === "NINO" ? "Niño" : "Niña"} · Precio base {formatEuro(item.basePriceCents)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {item.variants.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-lg border border-border bg-card p-3 flex flex-col gap-1.5"
                  >
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Talla {v.size}
                    </div>
                    <StockEditor kind="UNIFORM" id={v.id} currentStock={v.stock} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
