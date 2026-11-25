"use client"

import { ChatCircleDots, PaperPlaneRight, X } from "@phosphor-icons/react"
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import type { Copy, Lang } from "@/lib/i18n"

type Msg = { role: "user" | "assistant"; content: string }

// Debe coincidir con MAX_TURNOS de /api/chat (mensajes usuario + asistente)
const MAX_TURNOS = 24

export function ChatWidget({ copy, lang }: { copy: Copy["chat"]; lang: Lang }) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [texto, setTexto] = useState("")
  const [estado, setEstado] = useState<"idle" | "enviando" | "error" | "unavailable">("idle")
  const listaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // El saludo lo pone el widget, no la API, para que aparezca al instante
  const visibles: Msg[] = [{ role: "assistant", content: copy.welcome }, ...msgs]
  const enLimite = msgs.length >= MAX_TURNOS

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const el = listaRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs, open])

  const enviar = async (e?: FormEvent) => {
    e?.preventDefault()
    const t = texto.trim()
    if (!t || estado === "enviando" || enLimite) return

    const historial: Msg[] = [...msgs, { role: "user", content: t }]
    setMsgs([...historial, { role: "assistant", content: "" }])
    setTexto("")
    setEstado("enviando")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, messages: historial }),
      })

      if (res.status === 503) {
        setMsgs(historial)
        setEstado("unavailable")
        return
      }
      if (!res.ok || !res.body) throw new Error(String(res.status))

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acumulado = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acumulado += decoder.decode(value, { stream: true })
        const parcial = acumulado
        setMsgs([...historial, { role: "assistant", content: parcial }])
      }
      setEstado("idle")
    } catch {
      setMsgs(historial)
      setEstado("error")
    }
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void enviar()
    }
  }

  const reiniciar = () => {
    setMsgs([])
    setTexto("")
    setEstado("idle")
    inputRef.current?.focus()
  }

  return (
    <>
      {/* Burbuja */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? copy.close : copy.open}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[60] flex h-16 w-16 items-center justify-center rounded-full border border-foreground/15 bg-background/70 text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:bg-foreground/10 md:bottom-7 md:right-7"
      >
        {open ? <X size={26} weight="regular" /> : <ChatCircleDots size={30} weight="regular" />}
      </button>

      {/* Panel */}
      <div
        role="dialog"
        aria-label={copy.title}
        aria-hidden={!open}
        className={`fixed z-[59] flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background/85 text-foreground shadow-[0_16px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        } inset-x-3 bottom-[5.25rem] max-h-[min(78dvh,640px)] md:inset-x-auto md:bottom-[6.25rem] md:right-7 md:w-[380px] md:max-h-[min(70vh,600px)]`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-foreground/10 px-4 py-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/60">{copy.title}</p>
            <p className="mt-1 text-sm text-foreground/85">{copy.subtitle}</p>
          </div>
          {msgs.length > 0 && (
            <button
              type="button"
              onClick={reiniciar}
              className="shrink-0 font-mono text-[11px] text-foreground/50 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {copy.reset}
            </button>
          )}
        </header>

        <div ref={listaRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {visibles.map((m, i) => {
            const escribiendo = m.role === "assistant" && !m.content && estado === "enviando"
            return (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-foreground text-background"
                      : "rounded-bl-md border border-foreground/10 bg-foreground/5 text-foreground/90"
                  }`}
                >
                  {escribiendo ? <span className="text-foreground/50">{copy.thinking}</span> : m.content}
                </div>
              </div>
            )
          })}

          {estado === "error" && <p className="text-xs text-accent">{copy.error}</p>}
          {estado === "unavailable" && <p className="text-xs text-foreground/60">{copy.unavailable}</p>}
          {enLimite && <p className="text-xs text-foreground/60">{copy.limit}</p>}
        </div>

        <form onSubmit={enviar} className="flex items-end gap-2 border-t border-foreground/10 p-3">
          <textarea
            ref={inputRef}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={onKey}
            placeholder={copy.placeholder}
            rows={1}
            maxLength={1500}
            disabled={estado === "enviando" || estado === "unavailable" || enLimite}
            className="max-h-32 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/30 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            aria-label={copy.send}
            disabled={!texto.trim() || estado === "enviando" || estado === "unavailable" || enLimite}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-opacity disabled:opacity-40"
          >
            <PaperPlaneRight size={18} weight="fill" />
          </button>
        </form>
      </div>
    </>
  )
}
