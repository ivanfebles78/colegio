import Link from "next/link";
import { ShoppingBag, Package, BellRing, LayoutDashboard } from "lucide-react";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { schoolConfig } from "@/lib/school-config";
import { LogoutButton } from "./logout-button";

export const dynamic = "force-dynamic";

/**
 * El layout NO bloquea el acceso. Cada página protegida llama a
 * `protectAdminPage()` en su propio servidor. Esto permite que /admin/login
 * use el mismo layout sin entrar en bucle de redirect.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <header className="border-b border-border/60 bg-card">
        <div className="container-tight h-16 flex items-center justify-between">
          <Link href={admin ? "/admin" : "/admin/login"} className="flex items-center gap-3">
            <span className="inline-grid h-9 w-9 place-items-center rounded-full border border-primary/30 bg-primary text-primary-foreground font-serif">
              ℋℬ
            </span>
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Panel admin
              </div>
              <div className="font-medium tracking-tight">{schoolConfig.shortName}</div>
            </div>
          </Link>

          {admin && (
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <NavLink href="/admin" icon={<LayoutDashboard className="h-4 w-4" />}>
                Resumen
              </NavLink>
              <NavLink href="/admin/productos" icon={<Package className="h-4 w-4" />}>
                Productos
              </NavLink>
              <NavLink href="/admin/pedidos" icon={<ShoppingBag className="h-4 w-4" />}>
                Pedidos
              </NavLink>
              <NavLink href="/admin/reservas" icon={<BellRing className="h-4 w-4" />}>
                Reservas
              </NavLink>
            </nav>
          )}

          <div className="flex items-center gap-3">
            {admin && (
              <>
                <span className="hidden sm:block text-xs text-muted-foreground">
                  {admin.username}
                </span>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-foreground/80 hover:bg-secondary"
    >
      {icon}
      {children}
    </Link>
  );
}
