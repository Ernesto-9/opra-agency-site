"use client"

import { useRef, type ReactNode } from "react"

// El borde que se delinea siguiendo el cursor. Es el mismo truco del MagicBento
// de la página anterior: un pseudo-elemento de 1px pintado con un degradado
// radial anclado al puntero, recortado con mask-composite para que solo se vea
// el filo. Aquí va como wrapper para poder ponérselo a cualquier botón.
export function GlowBorder({
  children,
  className = "",
  radius = "9999px",
  idlePulse = false,
}: {
  children: ReactNode
  className?: string
  radius?: string
  /** Barrido lento continuo cuando el cursor no está encima */
  idlePulse?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--glow-x", `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty("--glow-y", `${((e.clientY - r.top) / r.height) * 100}%`)
    el.style.setProperty("--glow-intensity", "1")
  }

  const handleLeave = () => {
    ref.current?.style.setProperty("--glow-intensity", "0")
  }

  return (
    <span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-glow-border
      data-idle-pulse={idlePulse ? "" : undefined}
      className={`relative inline-block ${className}`}
      style={{ borderRadius: radius }}
    >
      {children}
    </span>
  )
}
