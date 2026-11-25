import { NextResponse, type NextRequest } from "next/server"

import { LANG_COOKIE, PAISES_ES, type Lang } from "@/lib/i18n"

/**
 * Idioma para quien llega por primera vez: primero el país de la IP (lo manda
 * Vercel), y si no viene, el idioma que trae configurado el navegador.
 */
function detectarIdioma(request: NextRequest): Lang {
  const pais = request.headers.get("x-vercel-ip-country")?.toUpperCase()
  if (pais) return PAISES_ES.has(pais) ? "es" : "en"

  const aceptado = request.headers.get("accept-language")?.toLowerCase() ?? ""
  return aceptado.startsWith("es") || aceptado.includes(",es") ? "es" : "en"
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const enIngles = pathname === "/en" || pathname.startsWith("/en/")
  const elegido = request.cookies.get(LANG_COOKIE)?.value as Lang | undefined

  // Primera visita a la raíz: si no es hispanohablante, se le manda a /en.
  // Con preferencia guardada la URL manda, para que un enlace directo no se mueva.
  if (pathname === "/" && !elegido && detectarIdioma(request) === "en") {
    return NextResponse.redirect(new URL("/en", request.url))
  }

  // El layout lee este header para poner el lang correcto en <html>
  const headers = new Headers(request.headers)
  headers.set("x-opra-lang", enIngles ? "en" : "es")

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ["/", "/en"],
}
