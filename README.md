# Asiatruk — Frontend de la página web

Tienda de repuestos de Asiatruk en Next.js: catálogo por categorías, marcas y modelos, ficha de cada repuesto,
registro e inicio de sesión (también con Google) y panel de administración.

El backend está en el repositorio `pagina_asiatruck_Backend`.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # y ajusta la dirección del backend
npm run dev                  # http://localhost:3001
```

## Variables de entorno

| Variable | Ejemplo | Uso |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.asiatruk.com` | Dirección del backend |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | | Botón "Continuar con Google" (vacío = oculto) |
| `NEXT_PUBLIC_STOCK_DESDE_PROFORMAS` | `1` | El stock es de solo lectura en el panel (lo controla el kárdex) |

En Vercel se configuran en **Settings → Environment Variables**. Los archivos `.env*` nunca se suben a git.

## Producción

```bash
npm run build
npm run start
```

La dirección pública de este frontend debe estar en `FRONTEND_URL` del backend.
