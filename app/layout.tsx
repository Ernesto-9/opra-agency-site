import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Geist_Mono, EB_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { headers } from "next/headers"
import "./globals.css"

import type { Lang } from "@/lib/i18n"

// Tipografía de marca. Una sola declaración: todo el sitio la toma de --font-stack-sans.
const stackSans = localFont({
  src: "./fonts/StackSansNotch-Variable.ttf",
  display: "swap",
  variable: "--font-stack-sans",
})

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

// Serif de acento. Solo itálica: se usa en palabras sueltas y en los eyebrows,
// nunca en naranja (el naranja se queda en la sans).
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  variable: "--font-serif-accent",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://opra.space"),
  title: "Opra | Procesos que impulsan tu negocio",
  description:
    "Diagnostica qué procesos frenan tu negocio y construye una solución diseñada para crecer.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // El middleware resuelve el idioma según la ruta y lo deja en este header, para
  // que <html lang> salga correcto ya desde el servidor: de eso dependen los
  // buscadores, los lectores de pantalla y el traductor del navegador.
  const lang = ((await headers()).get("x-opra-lang") ?? "es") as Lang

  return (
    // colorScheme dark: le avisa al navegador que la página YA es oscura, para
    // que Samsung Internet y compañía no le apliquen su propio oscurecido, que
    // era lo que descuadraba colores y espaciados
    <html
      lang={lang}
      className={`dark ${stackSans.variable} ${geistMono.variable} ${ebGaramond.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
