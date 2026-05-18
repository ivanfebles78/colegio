import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { schoolConfig } from "@/lib/school-config";
import { LoginForm } from "./login-form";

export const metadata = { title: "Acceso administrativo" };

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <main className="min-h-screen surface-paper flex items-center justify-center p-6">
      <div className="card-elevated w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-xs uppercase tracking-[0.18em] text-accent-foreground/70 mb-2">
            Panel de administración
          </div>
          <h1 className="font-serif text-3xl text-primary tracking-tight">
            {schoolConfig.shortName}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Acceso para secretaría · gestiona stock, pedidos y reservas.
          </p>
        </div>
        <LoginForm />
        <p className="text-[11px] text-muted-foreground mt-6 text-center">
          Si has olvidado tu contraseña contacta con el responsable técnico del centro.
        </p>
      </div>
    </main>
  );
}
