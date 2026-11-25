"use client"

import { WhatsappLogo } from "@phosphor-icons/react"
import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
import { MagneticButton } from "@/components/magnetic-button"
import { GlowBorder } from "@/components/glow-border"
import type { Copy, Lang } from "@/lib/i18n"

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "15555550123"

// Los dos botones de entrada comparten forma
const BOTON =
  "inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-foreground/10 bg-foreground/5 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-xl transition-all duration-300 hover:bg-foreground/10 sm:w-auto md:px-7 md:py-3.5 md:text-base"

export function ContactSection({ copy, lang }: { copy: Copy["contact"]; lang: Lang }) {
  const { ref, isVisible } = useReveal(0.3)
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" })
  // Solo manda en celular: de sm para arriba el formulario siempre está a la vista
  const [formOpen, setFormOpen] = useState(false)
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  // Campo trampa para bots (ver la ruta /api/contacto)
  const [web, setWeb] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) return
    if (estado === "enviando") return

    setEstado("enviando")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.name,
          email: formData.email,
          empresa: formData.company,
          mensaje: formData.message,
          web,
        }),
      })

      // 503 = el correo todavía no está configurado en el servidor. En vez de
      // dejar al visitante sin salida, se cae a WhatsApp como antes.
      if (res.status === 503) {
        const texto = [
          copy.whatsappIntro,
          "",
          `${copy.whatsappFields.name}: ${formData.name}`,
          `${copy.whatsappFields.email}: ${formData.email}`,
          `${copy.whatsappFields.company}: ${formData.company || "—"}`,
          `${copy.whatsappFields.message}: ${formData.message}`,
        ].join("\n")
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer")
        setEstado("idle")
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        // El error del servidor viene en español; en inglés se usa el propio
        throw new Error(lang === "es" ? data.error || copy.errorFallback : copy.errorFallback)
      }

      setEstado("ok")
      setFormData({ name: "", email: "", company: "", message: "" })
    } catch (err) {
      setEstado("error")
      setErrorMsg(err instanceof Error ? err.message : copy.errorFallback)
    }
  }

  return (
    <section
      ref={ref}
      className="flex h-[100svh] w-screen shrink-0 snap-start items-center px-4 pt-24 md:px-12 md:pt-24 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24">
          <div className="flex flex-col justify-center">
            <div
              className={`mb-3 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <h2 className="mb-1 font-sans text-2xl font-light leading-[1.05] tracking-tight text-foreground sm:text-4xl md:mb-3 md:text-6xl lg:text-7xl">
                {copy.titleLead}{" "}
                <span className="font-serif italic tracking-normal">{copy.titleAccent}</span>
              </h2>
              <p className="font-serif text-base italic text-foreground/60 md:text-lg">{copy.eyebrow}</p>
            </div>

            <div className="space-y-3 md:space-y-8">
              {/* Sin número a la vista: el contacto son los botones */}
              <div
                className={`flex flex-col items-start gap-3 transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <GlowBorder idlePulse className="max-sm:w-full">
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={BOTON}
                  >
                    <WhatsappLogo size={20} weight="fill" />
                    {copy.whatsapp}
                  </a>
                </GlowBorder>

                {/* En celular el formulario arranca cerrado: primero los dos
                    botones, y los campos se abren al elegir "Contacto" */}
                {!formOpen && (
                  <GlowBorder idlePulse className="w-full sm:hidden">
                    <button type="button" onClick={() => setFormOpen(true)} className={BOTON}>
                      {copy.openForm}
                    </button>
                  </GlowBorder>
                )}
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <p className="hidden max-w-md text-xs leading-relaxed text-foreground/80 sm:block sm:text-sm md:text-base">
                  {copy.blurbLead} <span className="text-opra-orange">{copy.blurbAccent}</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Minimal form */}
          <div className={`flex flex-col justify-center ${formOpen ? "" : "max-sm:hidden"}`}>
            <form onSubmit={handleSubmit} className="space-y-1.5 md:space-y-6">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <label className="mb-0.5 block font-mono text-xs text-foreground/60 md:mb-2">
                  {copy.fields.name}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                  placeholder={copy.placeholders.name}
                />
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <label className="mb-0.5 block font-mono text-xs text-foreground/60 md:mb-2">
                  {copy.fields.email}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                  placeholder={copy.placeholders.email}
                />
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <label className="mb-0.5 block font-mono text-xs text-foreground/60 md:mb-2">
                  {copy.fields.company}
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                  placeholder={copy.placeholders.company}
                />
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                <label className="mb-0.5 block font-mono text-xs text-foreground/60 md:mb-2">
                  {copy.fields.message}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full border-b border-foreground/30 bg-transparent py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:py-2 md:text-base"
                  placeholder={copy.placeholders.message}
                />
              </div>

              {/* Trampa para bots: invisible y fuera del recorrido de tabulación.
                  Si viene llena, la ruta descarta el envío. */}
              <input
                type="text"
                name="web"
                value={web}
                onChange={(e) => setWeb(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute left-[-9999px] h-px w-px opacity-0"
              />

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "650ms" }}
              >
                <GlowBorder className="w-full">
                  <MagneticButton variant="primary" size="lg" className="w-full">
                    {estado === "enviando" ? copy.submitting : copy.submit}
                  </MagneticButton>
                </GlowBorder>

                <p
                  role="status"
                  aria-live="polite"
                  className={`mt-3 text-sm ${estado === "error" ? "text-opra-orange" : "text-foreground/80"}`}
                >
                  {estado === "ok" && copy.ok}
                  {estado === "error" && `${errorMsg} ${copy.errorSuffix}`}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
