"use client"

import type { Icon } from "@phosphor-icons/react"

// Símbolos de apoyo, no ilustraciones: van detrás del texto, en trazo fino y
// muy bajos de opacidad, para dar profundidad sin competir con la lectura.
// Set: Phosphor (weight thin) — deliberadamente distinto al icono genérico.
export function SymbolMark({
  Icon,
  isVisible,
  size = 200,
  delay = 0,
  className = "",
}: {
  Icon: Icon
  isVisible: boolean
  size?: number
  delay?: number
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 select-none text-opra-sky will-change-[opacity,transform] ${className}`}
      style={{
        opacity: isVisible ? 0.14 : 0,
        transform: isVisible ? "scale(1) rotate(0deg)" : "scale(0.82) rotate(-8deg)",
        transition: `opacity 900ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 900ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      <Icon size={size} weight="thin" />
    </span>
  )
}
