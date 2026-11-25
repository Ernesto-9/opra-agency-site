"use client"

import { Broadcast, ChatCircleDots, HandCoins, Receipt, Scales, type Icon } from "@phosphor-icons/react"

import { useReveal } from "@/hooks/use-reveal"
import { SymbolMark } from "@/components/symbol-mark"
import type { Copy } from "@/lib/i18n"

// Forma de cada tarjeta: el texto viene del diccionario, esto es solo la
// presentación (ícono, de qué lado entra y cuál se oculta en celular).
const TARJETAS = [
  { icon: Receipt, direction: "top", hideOnMobile: true },
  { icon: Scales, direction: "right" },
  { icon: Broadcast, direction: "left" },
  { icon: HandCoins, direction: "bottom" },
  { icon: ChatCircleDots, direction: "left" },
] satisfies Array<{ icon: Icon; direction: string; hideOnMobile?: boolean }>

export function ServicesSection({ copy }: { copy: Copy["cases"] }) {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-[100svh] w-screen shrink-0 snap-start items-center px-6 pt-24 md:px-12 md:pt-24 lg:px-16"
    >
      {/* En celular esta pantalla es solo títulos (las descripciones se ocultan),
          así cabe entera y no necesita scroll vertical propio — que era lo que
          peleaba con el deslizamiento horizontal del deck. */}
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-[clamp(1rem,3.2vh,2.5rem)] transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          {/* Mismo criterio que Servicios: el tamaño lo manda la altura */}
          <h2 className="mb-2 font-sans text-[clamp(1.85rem,5.2vh,3.75rem)] font-light leading-[1.05] tracking-tight text-foreground">
            <span className="text-opra-orange">{copy.titleAccent}</span> {copy.titleRest}
          </h2>
          <p className="font-serif text-base italic text-foreground/60 md:text-lg">{copy.eyebrow}</p>
        </div>

        {/* Son 5, no 4: a 3 columnas caben en dos filas dentro de la pantalla */}
        <div
          data-casos-grid
          className="grid gap-y-[clamp(0.9rem,2.4vh,2.5rem)] sm:grid-cols-2 sm:gap-x-10 md:grid-cols-3 md:gap-x-12 lg:gap-x-16"
        >
          {/* En celular la primera tarjeta se oculta para no alargar la pantalla */}
          {copy.items.map((item, index) => ({ ...item, ...TARJETAS[index] })).map((service, i) => (
            <ServiceCard key={i} service={service} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  index,
  isVisible,
}: {
  service: {
    title: string
    description: string
    direction: string
    icon: Icon
    hideOnMobile?: boolean
  }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      switch (service.direction) {
        case "left":
          return "-translate-x-16 opacity-0"
        case "right":
          return "translate-x-16 opacity-0"
        case "top":
          return "-translate-y-16 opacity-0"
        case "bottom":
          return "translate-y-16 opacity-0"
        default:
          return "translate-y-12 opacity-0"
      }
    }
    return "translate-x-0 translate-y-0 opacity-100"
  }

  return (
    <div
      className={`group relative isolate transition-all duration-700 ${
        service.hideOnMobile ? "max-sm:hidden" : ""
      } ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
    >
      {/* Marca de agua detrás del título. En celular va más chica y pegada al
          borde derecho sin salirse: si se sale, la pantalla la recorta. */}
      <SymbolMark
        Icon={service.icon}
        isVisible={isVisible}
        size={128}
        delay={index * 150 + 300}
        className="right-0 top-1/2 -translate-y-1/2 [&>svg]:h-[64px] [&>svg]:w-[64px] sm:-top-4 sm:right-0 sm:translate-y-0 sm:[&>svg]:h-[128px] sm:[&>svg]:w-[128px]"
      />

      <div className="mb-1.5 flex items-center gap-3 md:mb-3">
        <div className="h-px w-8 bg-opra-orange/50 transition-all duration-300 group-hover:w-12 group-hover:bg-opra-orange" />
        <span data-caso-num className="font-mono text-xs text-opra-orange/80" />
      </div>
      <h3 className="mb-1 font-sans text-[clamp(1.05rem,2.4vh,1.5rem)] font-light leading-tight text-foreground md:mb-2">
        {service.title}
      </h3>
      <p className="hidden max-w-sm text-xs leading-relaxed text-foreground/80 sm:block sm:text-sm lg:text-base">
        {service.description}
      </p>
    </div>
  )
}
