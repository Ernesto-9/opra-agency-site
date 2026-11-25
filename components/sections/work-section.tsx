"use client"

import { Blueprint, Crosshair, PlugsConnected, type Icon } from "@phosphor-icons/react"

import { useReveal } from "@/hooks/use-reveal"
import { SymbolMark } from "@/components/symbol-mark"
import type { Copy } from "@/lib/i18n"

const ICONOS: Icon[] = [Crosshair, Blueprint, PlugsConnected]
const DIRECCIONES = ["left", "right", "left"]

export function WorkSection({ copy }: { copy: Copy["work"] }) {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-[100svh] w-screen shrink-0 snap-start items-center px-6 pt-24 md:px-12 md:pt-24 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-[clamp(1rem,3.2vh,2.5rem)] transition-all duration-700 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          {/* El deck no scrollea en vertical: lo que manda es la altura de la
              ventana, así que el tamaño y el ritmo se miden en vh */}
          <h2 className="mb-2 font-sans text-[clamp(1.85rem,5.2vh,3.75rem)] font-light leading-[1.05] tracking-tight text-foreground">
            {copy.title}
          </h2>
          <p className="font-serif text-base italic text-foreground/60 md:text-lg">{copy.eyebrow}</p>
        </div>

        <div className="space-y-2 md:space-y-8">
          {copy.steps.map((step, index) => ({
            number: `0${index + 1}`,
            icon: ICONOS[index],
            title: step.title,
            category: step.description,
            direction: DIRECCIONES[index],
          })).map((project, i) => (
            <ProjectCard key={i} project={project} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: {
    number: string
    title: string
    category: string
    direction: string
    icon: Icon
  }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return project.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <div
      className={`group relative isolate flex items-center justify-between border-b border-foreground/10 py-[clamp(0.6rem,1.7vh,1.4rem)] transition-all duration-700 hover:border-foreground/20 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
        marginLeft: index % 2 === 0 ? "0" : "auto",
        maxWidth: index % 2 === 0 ? "85%" : "90%",
      }}
    >
      {/* Marca de agua detrás del texto. Siempre completa: nada de recortarla
          contra el borde de la fila ni contra el de la pantalla. */}
      <SymbolMark
        Icon={project.icon}
        isVisible={isVisible}
        size={190}
        delay={index * 150 + 250}
        className="right-0 top-1/2 -translate-y-1/2 [&>svg]:h-[96px] [&>svg]:w-[96px] md:right-2 md:[&>svg]:h-[190px] md:[&>svg]:w-[190px] lg:right-10"
      />

      <div className="flex items-baseline gap-4 md:gap-8">
        <span className="font-mono text-sm text-opra-orange/70 transition-colors group-hover:text-opra-orange md:text-base">
          {project.number}
        </span>
        <div>
          <h3 className="mb-1 font-sans text-[clamp(1.15rem,3.1vh,2rem)] font-light leading-tight text-foreground transition-transform duration-300 group-hover:translate-x-2">
            {project.title}
          </h3>
          <p className="max-w-2xl text-pretty text-xs leading-relaxed text-foreground/70 sm:text-sm md:text-base">
            {project.category}
          </p>
        </div>
      </div>
    </div>
  )
}
