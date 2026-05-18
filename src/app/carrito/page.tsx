import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartView } from "./cart-view";

export const metadata = { title: "Cesta" };

export default function CarritoPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="container-tight pt-12 pb-20">
          <h1 className="heading-display text-4xl md:text-5xl text-primary mb-2">Tu cesta</h1>
          <p className="text-muted-foreground mb-10">
            Revisa tu pedido. La recogida se realiza en secretaría del colegio.
          </p>
          <CartView />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
