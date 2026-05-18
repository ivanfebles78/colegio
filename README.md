# Tienda del Centro Educativo Británico S21

Plataforma online para que las familias compren los libros oficiales y el uniforme del colegio. Pensada para reemplazar el goteo de pedidos por email/WhatsApp y centralizar todo el proceso (catálogo, carrito, pago, recogida y gestión de stock) en un único sitio profesional.

**Stack:** Next.js 14 (App Router, TypeScript) · PostgreSQL · Prisma · Tailwind CSS + shadcn/ui · Stripe (modo TEST) · Resend (email) · Twilio (SMS/WhatsApp, preparado).

---

## Demo para el director — qué impacta

| Funcionalidad | Por qué importa |
|---|---|
| **15 cursos reales** (Infantil 3-5 años, Primaria 1-6, ESO 1-4, Bachillerato Ciencias y Humanidades) | El director ve la estructura exacta de su colegio reflejada en la web. |
| **Catálogo de libros real**, extraído directamente de los PDFs oficiales (`britanicos21.es/informacion/libros/`) | ISBNs, editoriales y títulos correctos — el director reconoce su propio catálogo. |
| **Marca "venta exclusiva en el colegio"** para los libros TEKMAN/Milton/Santillana digitales | El sistema entiende los matices reales del colegio, no es una plantilla genérica. |
| **Uniforme con tallas y stock independiente** por talla | Refleja exactamente cómo funciona la tienda física (S, M, L, talla 38, talla 4 años…). |
| **Reservas para productos agotados** con elección de canal (email / SMS / WhatsApp) | Resuelve un dolor real: padres llamando una y otra vez preguntando "¿ya ha llegado?". |
| **Notificación automática** cuando secretaría repone stock | Cuando un admin pone stock de 0 a >0, la web notifica a quienes esperaban. |
| **Panel admin con stock editable y métricas** | El director ve que su secretaría puede operar la web sin tocar código. |
| **Stripe en modo TEST funcional** | Se puede hacer una compra completa en la demo con la tarjeta `4242 4242 4242 4242`. |
| **Branding plug-and-play** vía `.env` | Para hacer demo a otro colegio basta con cambiar 6 variables; cero cambios de código. |

---

## Arranque rápido (5 minutos)

### 1. Clonar e instalar dependencias

```bash
git clone <URL_DEL_REPO> britanico-shop
cd britanico-shop
npm install
```

### 2. Levantar PostgreSQL

```bash
docker compose up -d
```

Esto inicia Postgres 16 en `localhost:5432` con usuario `shop` / contraseña `shop` / base de datos `britanico_shop`. Persistencia automática en volumen Docker.

### 3. Variables de entorno

```bash
cp .env.example .env
```

Genera el hash bcrypt del admin (la contraseña por defecto del .env.example **no funciona** — hay que generar una propia):

```bash
npm run admin:hash -- TuContraseñaAquí
```

Copia el hash y el SESSION_SECRET que imprime el comando en tu `.env`.

### 4. Esquema + datos de prueba

```bash
npm run db:push     # crea las tablas
npm run db:seed     # carga 15 cursos, ~170 libros y catálogo de uniforme
```

### 5. Arrancar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El panel admin está en [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## Configurar Stripe (modo TEST)

1. Crea cuenta en [dashboard.stripe.com](https://dashboard.stripe.com) (gratis).
2. Asegúrate de estar en modo **TEST** (toggle arriba a la derecha).
3. Copia las claves desde `Developers → API keys`:
   - `STRIPE_SECRET_KEY` → `sk_test_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → `pk_test_...`
4. Para que los pagos se confirmen automáticamente en local, instala Stripe CLI:

```bash
brew install stripe/stripe-cli/stripe   # macOS
# Windows: descarga desde https://stripe.com/docs/stripe-cli

stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

El comando te dará un `whsec_...` que copias en `STRIPE_WEBHOOK_SECRET`.

**Tarjeta de prueba:** `4242 4242 4242 4242`, cualquier CVC, cualquier fecha futura.

> **Modo demo sin Stripe:** Si no tienes claves de Stripe configuradas, el checkout marca el pedido como `PAID` inmediatamente y muestra la pantalla de éxito. Útil para enseñar la web sin desplegar nada.

---

## Activar notificaciones reales

### Email (Resend) — recomendado para la demo

1. Crea cuenta en [resend.com](https://resend.com).
2. Verifica un dominio (o usa `onboarding@resend.dev` para pruebas).
3. Copia la API key en `RESEND_API_KEY` y el remitente en `NOTIFICATION_FROM_EMAIL`.

Sin `RESEND_API_KEY` la app sigue funcionando: los emails se logean en consola (modo stub).

### SMS y WhatsApp (Twilio) — preparado, **DESACTIVADO** por defecto

Cuando el colegio contrate Twilio:

```bash
# en .env
NOTIFICATIONS_SMS_ENABLED=true
NOTIFICATIONS_WHATSAPP_ENABLED=true
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_SMS_FROM=+34...
TWILIO_WHATSAPP_FROM=whatsapp:+...
```

Mientras estén desactivados, la opción aparece en el formulario de reserva pero no se envía nada (se guarda la preferencia para activarla más adelante).

---

## Hacer demo a otro colegio (rebrand express)

En `.env` cambia estas variables y reinicia:

```bash
NEXT_PUBLIC_SCHOOL_NAME="Colegio Ejemplo"
NEXT_PUBLIC_SCHOOL_SHORT_NAME="Ejemplo"
NEXT_PUBLIC_SCHOOL_LOCATION="Madrid"
NEXT_PUBLIC_SCHOOL_DOMAIN="colegio-ejemplo.es"
NEXT_PUBLIC_SCHOOL_PHONE="91 000 00 00"
NEXT_PUBLIC_SCHOOL_EMAIL="info@colegio-ejemplo.es"
NEXT_PUBLIC_SCHOOL_PRIMARY_HSL="220 50% 20%"   # azul corporativo (HSL: hue saturation lightness)
NEXT_PUBLIC_SCHOOL_ACCENT_HSL="35 80% 55%"     # dorado/naranja
# IMPORTANTE: los colores van en formato HSL, no hex. Conversor: oklch.com
```

Los colores se aplican al instante. Para el catálogo, el admin puede:
1. Editar precios y stock de los libros existentes desde `/admin/productos`.
2. Borrar el catálogo y volver a importar uno propio (modificando `src/data/books-britanico.ts` y ejecutando `npm run db:reset`).

---

## Estructura del proyecto

```
britanico-shop/
├── prisma/
│   ├── schema.prisma         # 9 modelos (Course, BookCategory, Book, UniformItem,
│   │                         #  UniformVariant, Order, OrderItem, StockReservation)
│   └── seed.ts               # carga inicial
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home con hero editorial y cursos por nivel
│   │   ├── curso/[slug]/     # detalle de curso (libros agrupados por asignatura)
│   │   ├── uniforme/         # catálogo de uniforme con filtros
│   │   ├── carrito/          # cesta + checkout
│   │   ├── checkout/exito/   # confirmación del pedido
│   │   ├── admin/            # panel (dashboard, productos, pedidos, reservas)
│   │   └── api/              # routes:
│   │       ├── stripe/checkout/    # crear sesión de pago
│   │       ├── stripe/webhook/     # marcar pedidos como pagados, descontar stock
│   │       ├── reservas/           # guardar reservas de stock
│   │       └── admin/              # auth + actualizar stock
│   ├── components/
│   │   ├── ui/               # primitivos shadcn (button, card, dialog, etc.)
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   ├── book-card.tsx
│   │   ├── uniform-item-card.tsx
│   │   ├── add-to-cart-button.tsx
│   │   └── reservation-dialog.tsx
│   ├── data/
│   │   ├── courses.ts        # 15 cursos
│   │   ├── books-britanico.ts # ~170 libros (13 cursos reales + 4 orientativos)
│   │   └── uniform.ts        # 22 prendas con variantes por talla
│   └── lib/
│       ├── prisma.ts
│       ├── stripe.ts
│       ├── school-config.ts  # ← branding del colegio (cambiar aquí o vía .env)
│       ├── cart-store.ts     # Zustand + persistencia
│       ├── admin-auth.ts     # JWT (jose) + bcrypt
│       └── notifications/    # email (Resend) + sms/whatsapp (Twilio, preparados)
├── scripts/
│   └── generate-admin-hash.ts
├── docker-compose.yml        # Postgres 16
├── .env.example
└── tailwind.config.ts
```

---

## Despliegue en producción (Vercel + Neon/Supabase)

1. **Base de datos:** crea proyecto gratuito en [Neon](https://neon.tech) o [Supabase](https://supabase.com). Copia la URL en `DATABASE_URL`.
2. **Vercel:** importa el repo, añade todas las variables de `.env`.
3. **Stripe webhook en producción:** crea un endpoint en `Developers → Webhooks → Add endpoint` apuntando a `https://TU_DOMINIO/api/stripe/webhook`, suscríbete a `checkout.session.completed`, copia el `whsec_` en `STRIPE_WEBHOOK_SECRET`.
4. **Migrar la BD:** desde local con el `DATABASE_URL` de producción, ejecuta `npm run db:push && npm run db:seed`.
5. **Listo.** La home estará viva con HTTPS, HTTP/3 y CDN global incluidos.

---

## Datos de prueba

Tras `npm run db:seed`:

- **15 cursos** disponibles
- **~170 libros** (13 cursos con datos reales del Británico S21, 4 cursos de Bachillerato con catálogo orientativo)
- **22 prendas de uniforme** con tallas y stock variable
- Algunos productos están **agotados a propósito** para probar el flujo de reservas (busca el "Estuche de tres pisos" o talla XS de "Falda de vestir").

### Flujo completo para probar en 3 minutos

1. Entra en [/](http://localhost:3000), elige un curso, añade un libro al carrito.
2. Ve a [/uniforme](http://localhost:3000/uniforme), filtra por "Niña", añade una falda.
3. Intenta añadir el "Estuche de tres pisos" → te ofrece reservar. Rellena el formulario.
4. Ve a tu cesta y completa el checkout (tarjeta `4242 4242 4242 4242`).
5. Entra en [/admin/login](http://localhost:3000/admin/login) con tus credenciales.
6. En `Productos`, pon stock a 5 en el estuche → la reserva se notifica automáticamente.
7. En `Pedidos` verás tu pedido con su número (`BR-2026-0001`).

---

## Próximos pasos sugeridos

- [ ] Subida de imágenes reales de uniforme (ahora son placeholders con iconos)
- [ ] Multi-admin (extender `AdminUser` en Prisma — el esquema ya lo contempla)
- [ ] Estadísticas por curso (ventas, libros más demandados)
- [ ] Edición de precios desde admin (hoy se editan en código + seed)
- [ ] Exportación CSV de pedidos para conciliar con secretaría
- [ ] Login de padres con historial multi-hijo (cuando el director lo pida)

---

## Licencia y autoría

Proyecto desarrollado a medida para el Centro Educativo Británico S21. Estructura general y stack abiertos para reutilización en otros colegios mediante cambio de branding.
