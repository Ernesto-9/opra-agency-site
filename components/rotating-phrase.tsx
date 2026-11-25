"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

// El conector ("tu" en español, "your" en inglés) no se mueve ni se re-renderiza
// nunca: es un nodo fijo. Lo único que pasa a su lado es que aparece o desaparece
// la "s" del plural — y en inglés no aparece nunca, porque "your" no cambia. Las
// palabras de los costados se apilan en absoluto sobre un sizer invisible, así
// que tampoco reacomodan nada.
export type Phrase = { lead: string; plural: boolean; end: string }

const INTERVAL = 4000

function Slot({
  words,
  active,
  align,
  delay = 0,
}: {
  words: string[]
  active: number
  align: "right" | "left"
  delay?: number
}) {
  // Sizer invisible: fija el ancho de la columna con la palabra más larga
  const widest = words.reduce((a, b) => (b.length > a.length ? b : a), "")
  const alignClass = align === "right" ? "justify-end text-right" : "justify-start text-left"

  return (
    <span className={`relative inline-flex ${alignClass}`}>
      <span aria-hidden="true" className="invisible whitespace-nowrap">
        {widest}
      </span>
      {words.map((word, i) => {
        const on = i === active
        return (
          <span
            key={word}
            className={`absolute inset-0 flex items-center whitespace-nowrap will-change-[opacity,transform,filter] ${alignClass} ${
              on ? "translate-y-0 opacity-100 blur-0" : "translate-y-[0.14em] opacity-0 blur-[6px]"
            }`}
            style={{
              transition: `opacity 620ms cubic-bezier(0.22,1,0.36,1) ${on ? delay : 0}ms, transform 620ms cubic-bezier(0.22,1,0.36,1) ${
                on ? delay : 0
              }ms, filter 620ms cubic-bezier(0.22,1,0.36,1) ${on ? delay : 0}ms`,
            }}
          >
            {word}
          </span>
        )
      })}
    </span>
  )
}

type RotatingPhraseProps = {
  phrases: Phrase[]
  /** "tu" / "your" */
  connector: string
  /** La letra que abre y cierra para el plural. Vacío = el idioma no la usa. */
  pluralSuffix: string
}

export function RotatingPhrase({ phrases, connector, pluralSuffix }: RotatingPhraseProps) {
  const [index, setIndex] = useState(0)
  const sRef = useRef<HTMLSpanElement>(null)
  const [sWidth, setSWidth] = useState<number | string>("0.42em")

  const leads = phrases.map((p) => p.lead)
  const ends = phrases.map((p) => p.end)
  const usaPlural = pluralSuffix.length > 0

  // El ancho real de la "s" depende de la fuente y del tamaño (clamp con vw),
  // así que se mide en vez de adivinarlo
  useLayoutEffect(() => {
    if (!usaPlural) return

    const measure = () => {
      if (sRef.current) setSWidth(sRef.current.getBoundingClientRect().width)
    }
    measure()

    const ro = new ResizeObserver(measure)
    if (sRef.current) ro.observe(sRef.current)
    document.fonts?.ready.then(measure)

    return () => ro.disconnect()
  }, [usaPlural])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), INTERVAL)
    return () => clearInterval(id)
  }, [phrases.length])

  const plural = usaPlural && phrases[index].plural
  const primeraFrase = `${phrases[0].lead} ${connector}${
    usaPlural && phrases[0].plural ? pluralSuffix : ""
  } ${phrases[0].end}`

  return (
    <>
      <span className="sr-only">{primeraFrase}</span>
      {/* items-baseline, no items-center: el envoltorio de la "s" lleva
          overflow-hidden y eso mueve su baseline al borde inferior, lo que
          desalineaba el conector respecto a las palabras de los lados */}
      <span aria-hidden="true" className="flex items-baseline whitespace-nowrap">
        <Slot words={leads} active={index} align="right" />

        {/* Bloque fijo: el conector nunca se mueve ni se re-renderiza. La "s"
            abre y cierra su propio ancho, así no queda un hueco muerto en
            singular. En inglés no se dibuja: "your" es igual siempre. */}
        <span className="px-[0.24em]">
          {connector}
          {usaPlural && (
            // Nada de overflow-hidden aquí: en un inline-block eso mueve la línea
            // base al borde inferior de la caja y la "s" quedaba montada más
            // arriba que el conector. clip-path recorta igual sin tocar la base.
            <span
              className="inline-block whitespace-nowrap align-baseline"
              style={{
                width: plural ? sWidth : 0,
                clipPath: "inset(-0.4em 0 -0.4em 0)",
                transition:
                  "width 520ms cubic-bezier(0.22,1,0.36,1), opacity 520ms cubic-bezier(0.22,1,0.36,1) 80ms",
                opacity: plural ? 1 : 0,
              }}
            >
              <span ref={sRef}>{pluralSuffix}</span>
            </span>
          )}
        </span>

        <Slot words={ends} active={index} align="left" delay={90} />
      </span>
    </>
  )
}
