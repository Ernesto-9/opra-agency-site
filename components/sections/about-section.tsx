"use client"

import { useReveal } from "@/hooks/use-reveal"
import type { Copy } from "@/lib/i18n"

// Esta pantalla era el "About" con historia + 3 stats. Opra no tiene stats que
// presumir todavía, así que se queda como la frase display: una sola idea a
// pantalla completa, sin título ni botones — solo la frase.
export function AboutSection({ copy }: { copy: Copy["quote"] }) {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-[100svh] w-screen shrink-0 snap-start items-center px-4 pt-24 md:px-12 md:pt-24 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="max-w-5xl text-balance font-sans text-4xl font-light leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {copy.lead}{" "}
            <span className="font-serif italic tracking-normal">{copy.leadAccent}</span>
            {copy.tail}
          </h2>
        </div>

        <div
          className={`mt-3 transition-all duration-700 md:mt-5 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "250ms" }}
        >
          <p className="max-w-5xl text-balance font-sans text-4xl font-light leading-[1.1] tracking-tight text-opra-orange md:text-6xl lg:text-7xl">
            {copy.question}
          </p>
        </div>

      </div>
    </section>
  )
}
