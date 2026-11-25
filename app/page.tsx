import type { Metadata } from "next"

import { Deck } from "@/components/deck"
import { getCopy } from "@/lib/i18n"

const t = getCopy("es")

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  alternates: {
    canonical: "/",
    languages: {
      es: "/",
      en: "/en",
      "x-default": "/",
    },
  },
}

export default function Home() {
  return <Deck lang="es" />
}
