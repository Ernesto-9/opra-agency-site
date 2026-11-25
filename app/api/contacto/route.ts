import { NextResponse } from "next/server"
import { Resend } from "resend"

// Variables de entorno (se configuran en Vercel, nunca en el repo):
//   RESEND_API_KEY  — la llave de la cuenta de Resend
//   CONTACTO_TO     — a dónde llegan los mensajes (por defecto you@example.com)
//   CONTACTO_FROM   — remitente. Por defecto usa el dominio de pruebas de Resend,
//                     que funciona sin verificar nada. Al verificar opra.space en
//                     Resend, se cambia a "Opra <formulario@opra.space>".
const TO = process.env.CONTACTO_TO ?? "you@example.com"
const FROM = process.env.CONTACTO_FROM ?? "Opra <onboarding@resend.dev>"

const LIMITES = { nombre: 120, email: 200, empresa: 160, mensaje: 4000 }

function limpiar(valor: unknown, max: number) {
  if (typeof valor !== "string") return ""
  return valor.trim().slice(0, max)
}

function escapar(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Falta RESEND_API_KEY: el formulario no puede enviar correo")
    return NextResponse.json({ error: "El correo no está configurado todavía." }, { status: 503 })
  }

  let cuerpo: Record<string, unknown>
  try {
    cuerpo = await request.json()
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 })
  }

  // Trampa para bots: es un campo oculto, una persona nunca lo llena.
  // Se responde ok para no darle pistas al bot de que fue descartado.
  if (limpiar(cuerpo.web, 100)) {
    return NextResponse.json({ ok: true })
  }

  const nombre = limpiar(cuerpo.nombre, LIMITES.nombre)
  const email = limpiar(cuerpo.email, LIMITES.email)
  const empresa = limpiar(cuerpo.empresa, LIMITES.empresa)
  const mensaje = limpiar(cuerpo.mensaje, LIMITES.mensaje)

  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ error: "Faltan datos." }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ese correo no se ve válido." }, { status: 400 })
  }

  const texto = [
    `Nombre: ${nombre}`,
    `Email: ${email}`,
    `Empresa: ${empresa || "—"}`,
    "",
    mensaje,
  ].join("\n")

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#0b1b33">
      <h2 style="margin:0 0 16px;font-size:18px">Nuevo mensaje desde opra.space</h2>
      <p style="margin:0 0 4px"><strong>Nombre:</strong> ${escapar(nombre)}</p>
      <p style="margin:0 0 4px"><strong>Email:</strong> ${escapar(email)}</p>
      <p style="margin:0 0 16px"><strong>Empresa:</strong> ${escapar(empresa) || "—"}</p>
      <p style="margin:0 0 8px"><strong>Mensaje:</strong></p>
      <p style="margin:0;white-space:pre-wrap">${escapar(mensaje)}</p>
    </div>
  `

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    // replyTo con el correo de quien escribe: contestar desde el buzón responde a la persona
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Contacto opra.space — ${nombre}`,
      text: texto,
      html,
    })

    if (error) {
      console.error("Resend rechazó el envío:", error)
      return NextResponse.json({ error: "No se pudo enviar el mensaje." }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Error enviando el correo de contacto:", e)
    return NextResponse.json({ error: "No se pudo enviar el mensaje." }, { status: 502 })
  }
}
