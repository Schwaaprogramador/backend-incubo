# CLAUDE.md - Proyecto Incubo E-commerce

Este archivo sirve como documentación y contexto para Claude Code en futuras sesiones de desarrollo.

## Descripcion General

Proyecto de e-commerce completo con panel de administracion y pagina web publica. Backend API REST con MongoDB e integracion de Mercado Pago (Checkout Pro) para pagos en Colombia (COP).

## Estructura del Proyecto

```
Incubo/
├── backend-incubo/        # API REST (Express + TypeScript) - Puerto 3100
├── admin-panel-incubo/    # Panel de administracion (Preact + Vite)
└── in-cubo-web-page/      # Pagina web publica (Astro + Preact) - Puerto 4321
```

---

## Backend API (backend-incubo)

### Stack Tecnologico
- **Framework:** Express 5.1.0
- **Lenguaje:** TypeScript 5.9.3
- **Base de Datos:** MongoDB + Mongoose 9.0.0
- **Autenticacion:** JWT (jsonwebtoken 9.0.3) + bcrypt 6.0.0
- **Pagos:** Mercado Pago SDK 2.11.0 — Checkout Pro
- **Uploads:** Multer 2.0.2 + sharp (convierte a WebP) + file-type (validacion magic bytes)
- **Seguridad:** helmet, express-rate-limit, express-mongo-sanitize

### Estructura de Directorios
```
backend-incubo/
├── app.ts                      # Punto de entrada (carga dotenv primero)
├── .env                        # Variables de entorno
├── .env.example                # Plantilla de variables
├── src/
│   ├── Server.ts              # Configuracion Express, CORS, static files
│   ├── Routes.ts              # Rutas principales
│   ├── MongoConfig.ts         # Conexion a MongoDB
│   ├── MercadoPagoConfig.ts   # Configuracion cliente MP
│   ├── Usuarios/
│   ├── Productos/
│   ├── Categorias/
│   ├── Relatos/
│   ├── Contacto/
│   ├── Pedidos/               # Modulo pedidos
│   │   ├── Pedidos.modelo.ts
│   │   ├── Pedidos.controller.ts
│   │   ├── Pedidos.service.ts
│   │   └── Pedidos.routes.ts
│   ├── MercadoPago/
│   │   ├── MercadoPago.controller.js  # crearPago + recibirWebhook
│   │   ├── MercadoPago.service.js     # createPreference (Checkout Pro)
│   │   ├── MercadoPago.routes.js
│   │   └── TypesMercadoPago.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   └── config/
│       └── multer.config.ts
└── uploads/productos/
```

### Endpoints API

#### Usuarios (/usuarios)
```
POST   /login                 # Login publico - retorna JWT
POST   /registro-cliente      # Registro de comprador publico
GET    /verificar             # Verificar token (protegido)
GET    /                      # Obtener todos (admin)
GET    /:id                   # Obtener por ID (admin)
POST   /                      # Crear usuario (admin)
PUT    /:id                   # Actualizar (admin)
DELETE /:id                   # Eliminar (admin)
```

#### Productos (/productos)
```
GET    /                      # Obtener todos (publico)
GET    /:id                   # Obtener por ID (publico)
POST   /                      # Crear con imagen (admin)
POST   /:id/imagenes          # Subir imagenes adicionales (admin)
PUT    /:id                   # Actualizar (admin)
DELETE /:id                   # Eliminar (admin)
DELETE /:id/imagenes/:indice  # Eliminar imagen por indice (admin)
```

#### Categorias (/categorias)
```
GET    /activas        # Obtener activas (publico)
GET    /               # Obtener todas (admin)
GET    /:id            # Obtener por ID (admin)
POST   /               # Crear (admin)
PUT    /:id            # Actualizar (admin)
DELETE /:id            # Eliminar (admin)
```

#### Pedidos (/pedidos)
```
GET    /               # Obtener todos (admin)
GET    /:id            # Obtener por ID (admin)
PUT    /:id/estado     # Actualizar estado (admin)
```

#### Mercado Pago (/mercadopago)
```
POST   /crear-pago     # Crear preferencia Checkout Pro (publico)
POST   /webhook        # Recibir notificaciones de pago (publico, validado con firma)
```

### Modelos MongoDB

#### Producto
```typescript
{
  nombre: String,       // required
  precio: Number,       // required, COP
  stock: Number,        // default: 0
  descripcion: String,
  img: String,          // legacy - URL imagen unica
  imagenes: [String],   // array de URLs /uploads/productos/
  categoria: String,
  subcategoria: String,
  activo: Boolean,      // default: true
}
```

#### Pedido
```typescript
{
  usuario: {
    nombre, apellido, email, telefono,
    direccion: { calle, numero, codigoPostal }
  },
  items: [{ productoId, nombre, precio, cantidad }],
  total: Number,
  estado: "pendiente" | "pagado" | "fallido" | "cancelado",
  mpPreferenceId: String,
  mpPaymentId: String,
}
```

#### Usuario
```typescript
{
  email: String,        // unique, lowercase, required
  password: String,     // hashed con bcrypt
  nombre: String,
  apellido: String,
  telefono: String,
  direccion: { calle, numero, codigoPostal },
  rol: "admin" | "usuario" | "cliente",  // default: "cliente"
  activo: Boolean,      // default: true
}
```

#### Categoria
```typescript
{
  nombre: String,       // unique, required
  descripcion: String,
  activo: Boolean,
  subcategorias: [{ nombre: String, activo: Boolean }]
}
```

### Variables de Entorno (.env)
```
MONGO_URI=mongodb://localhost:27017/backend_incubo
MP_ACCESS_TOKEN=tu_access_token_mercadopago     # TEST-... en dev, APP_USR-... en prod
MP_WEBHOOK_SECRET=tu_clave_secreta_webhook_mp   # Desde dashboard MP > Webhooks
PUBLIC_MERCADOPAGO=tu_public_key_mercadopago
JWT_SECRET=string_random_seguro_64_chars
WEB_URL=http://localhost:4321                   # https://incubo.shop en prod
ADMIN_URL=http://localhost:5173                 # https://admin.incubo.shop en prod
ADMIN_EMAIL=admin@incubo.com
ADMIN_PASSWORD=password_seguro
ADMIN_NOMBRE=Administrador
```

### Comandos
```bash
pnpm run dev          # Inicia servidor con tsx watch
pnpm run create-admin # Crea usuario administrador inicial
```

---

## Seguridad implementada (Server.ts)

El orden de middlewares en `Server.ts` es importante:

```
express.json({ limit: "1mb" })        // 6. Limita payload a 1MB
express.urlencoded({ limit: "1mb" })  // 6. Idem para form-urlencoded
helmet({ crossOriginResourcePolicy }) // 2. Headers HTTP de seguridad
mongoSanitize()                       // 5. Elimina $ y . de inputs (NoSQL injection)
rateLimit /usuarios/login             // 1. Max 10 intentos / 15 min
rateLimit /mercadopago/crear-pago     // 1. Max 5 requests / 1 min
rateLimit global                      // 1. Max 120 requests / 1 min por IP
CORS                                  //    Solo origenes permitidos
```

### Validacion de archivos subidos (multer.config.ts)
- `file-type` verifica magic bytes reales del buffer antes de procesar con sharp
- Si el tipo no coincide con JPG/PNG/GIF/WebP → `400` sin tocar disco
- Protege contra archivos disfrazados con MIME falso

### Nginx — autoindex off
El archivo `nginx.conf` en la raiz del repo contiene la configuracion completa.
La seccion critica para seguridad en `/uploads/`:
```nginx
location /uploads/ {
    autoindex off;   # Evita listado publico de archivos
    proxy_pass http://localhost:3100;
}
```
Para aplicar en el server:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/incubo
sudo ln -s /etc/nginx/sites-available/incubo /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Pendiente (hacer en el server)
- Verificar que `JWT_SECRET` en `.env` sea un string aleatorio de 64+ caracteres
- Confirmar que `.env` esta en `.gitignore` y nunca fue commiteado con tokens reales

---

## Integracion Mercado Pago

### Tipo: Checkout Pro
El flujo usa `Preference` del SDK → devuelve `init_point` → redirige al usuario a la pagina de MP.
No es Bricks ni Checkout API — el usuario abandona el sitio para pagar.

### Flujo completo
1. Frontend envia `POST /mercadopago/crear-pago` con items + datos del payer
2. Backend crea el pedido en MongoDB con estado `pendiente`
3. Backend crea una `Preference` en MP con `external_reference = pedidoId`
4. Backend guarda el `mpPreferenceId` en el pedido
5. Frontend redirige al usuario a `init_point`
6. MP procesa el pago y llama al webhook `POST /mercadopago/webhook`
7. Webhook actualiza el estado del pedido y reduce stock si fue aprobado
8. MP redirige al usuario a `back_urls.success/failure/pending`

### auto_return
Solo se envia `auto_return: "approved"` cuando `WEB_URL` usa HTTPS.
En desarrollo (http://localhost) se omite para evitar error de MP.

### Validacion de webhook (x-signature)
El webhook valida la firma HMAC-SHA256 enviada por MP en el header `x-signature`.
- Manifest: `id:<dataId>;request-id:<x-request-id>;ts:<ts>;`
- Algoritmo: HMAC-SHA256 con `MP_WEBHOOK_SECRET`
- Si `MP_WEBHOOK_SECRET` no esta definido, la validacion se omite (no bloquea)
- Registrar URL en dashboard MP: `https://api.incubo.shop/mercadopago/webhook`, evento: `payment`

### Modo pruebas
- Usar token `TEST-...` en `MP_ACCESS_TOKEN`
- Pagar con cuenta de prueba de comprador (no cuenta real) desde el dashboard de MP
- Las tarjetas de prueba solo funcionan cuando AMBAS partes (vendedor y comprador) son cuentas de prueba

### Deploy produccion
```
MP_ACCESS_TOKEN=APP_USR-...           # Token de produccion
MP_WEBHOOK_SECRET=clave_del_dashboard
WEB_URL=https://incubo.shop
```

---

## Panel Admin (admin-panel-incubo)

### Stack Tecnologico
- **Framework:** Preact 10.27.2
- **Build Tool:** Vite 7.2.4
- **Routing:** preact-router 4.1.2
- **Styling:** Tailwind CSS 3.4.18
- **Lenguaje:** TypeScript 5.9.3

### Estructura de Directorios
```
admin-panel-incubo/src/
├── componentes/
│   ├── Login.tsx              # Sin placeholder en campo email
│   ├── Dashboard.tsx
│   ├── Usuarios.tsx
│   ├── Productos.tsx          # Tabla compacta + modal de edicion + filtros
│   ├── AddProducts.tsx
│   ├── Categorias.tsx
│   ├── Ventas.tsx
│   ├── Relatos.tsx
│   └── Navbar.tsx
├── context/
│   └── AuthContext.tsx
└── layout/
    └── Layout.tsx
```

### Productos.tsx — comportamiento actual
- **Tabla compacta** estilo Excel: filas de ~32px, imagen 32×32px, botones ocultos hasta hover
- **Filtros**: por estado (Todos / Activos / Inactivos) y por categoria (select)
- **Modal de edicion**: abre al clicar el lapiz; incluye nombre, descripcion, precio, stock, categoria, subcategoria, activo (toggle), y gestion de imagenes (subir + eliminar)
- Las operaciones de imagen (subir/eliminar) se aplican de inmediato via API sin necesidad de guardar el formulario

### Credenciales desarrollo
```
Email:    admin@incubo.com
Password: admin123
```

---

## Pagina Web (in-cubo-web-page)

### Stack Tecnologico
- **Framework:** Astro 5 SSR (@astrojs/node)
- **Componentes UI:** Preact 10
- **Styling:** Tailwind CSS 4

### Favicon
Usa `public/favicon.png` — es el mismo icono (`icono_corazon.png`) que aparece en la navbar.
Tambien configurado como `apple-touch-icon`.

### Formato de precios
Todos los componentes usan `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })`.
Resultado: `$ 123.000` — sin decimales, punto como separador de miles.
Componentes: `Carrito.tsx`, `CheckoutForm.tsx`, `ProductoDetalle.tsx`, `productos.tsx`, `ProductsFilter.tsx`.

### Carrito
- Persistido en localStorage (key: `cart`)
- Eventos custom: `cart-updated`, `toggle-cart`

### Variables de entorno
```
VITE_API_URL=http://localhost:3100    # Se bake en build — rebuildar si cambia
```

---

## Deploy (Ubuntu)

```
Dominio web:     https://incubo.shop  (y www.incubo.shop)
Dominio backend: https://api.incubo.shop → puerto 3100 via reverse proxy
Dominio admin:   https://admin.incubo.shop
Backend:         PM2 proceso "incubo-backend" en /home/schwaa/backend-incubo
Web publica:     /home/schwaa/in-cubo-web-page
```

Verificar estado:
```bash
pm2 status
pm2 logs incubo-backend --lines 50
pm2 env incubo-backend | grep -E "MP_ACCESS|WEB_URL|MONGO"
```

---

## Comandos de desarrollo

```bash
# Terminal 1 - Backend
cd backend-incubo && npm run dev

# Terminal 2 - Admin Panel
cd admin-panel-incubo && npm run dev

# Terminal 3 - Web Page
cd in-cubo-web-page && npm run dev

# Crear admin inicial
cd backend-incubo && npm run create-admin
```

## Convenciones del proyecto
- Codigo y nombres de variables en **espanol** (rutas, modelos, controladores)
- Archivos backend: PascalCase (`Productos.service.ts`)
- Componentes Preact: PascalCase, componentes Astro: camelCase
- `pnpm` en todos los sub-proyectos (backend, admin, web)
- MongoDB local: `mongodb://localhost:27017/backend_incubo`
