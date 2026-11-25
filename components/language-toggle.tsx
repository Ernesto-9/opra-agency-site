"use client"

import { LANG_COOKIE, LANGS, pathForLang, type Lang } from "@/lib/i18n"

const ETIQUETAS: Record<Lang, { corta: string; aria: string }> = {
  es: { corta: "ES", aria: "Ver esta página en español / View this page in Spanish" },
  en: { corta: "EN", aria: "Ver esta página en inglés / View this page in English" },
}

type LanguageToggleProps = {
  lang: Lang
  className?: string
}

/**
 * ES / EN en el nav. Enlace normal a propósito, no <Link>: hace falta recargar
 * de verdad para que cambie el lang del documento; con navegación de cliente el
 * layout no se vuelve a renderizar y el navegador seguiría creyendo que la
 * página está en el idioma anterior.
 */
export function LanguageToggle({ lang, className = "" }: LanguageToggleProps) {
  const recordar = (elegido: Lang) => {
    document.cookie = `${LANG_COOKIE}=${elegido}; path=/; max-age=31536000; samesite=lax`
  }

  return (
    <nav
      aria-label="Idioma / Language"
      className={`flex items-center gap-1 font-mono text-xs ${className}`}
    >
      {LANGS.map((opcion, i) => {
        const activo = opcion === lang
        return (
          <span key={opcion} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden="true" className="text-foreground/25">
                /
              </span>
            )}
            <a
              href={pathForLang(opcion)}
              hrefLang={opcion}
              aria-label={ETIQUETAS[opcion].aria}
              aria-current={activo ? "true" : undefined}
              onClick={() => recordar(opcion)}
              className={`px-1 py-1 tracking-[0.12em] transition-colors ${
                activo ? "text-foreground" : "text-foreground/45 hover:text-foreground/80"
              }`}
            >
              {ETIQUETAS[opcion].corta}
            </a>
          </span>
        )
      })}
    </nav>
  )
}
