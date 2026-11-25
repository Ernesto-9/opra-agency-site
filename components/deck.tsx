"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { AboutSection } from "@/components/sections/about-section"
import { ContactSection } from "@/components/sections/contact-section"
import { ChatWidget } from "@/components/chat-widget"
import { LanguageToggle } from "@/components/language-toggle"
import { MagneticButton } from "@/components/magnetic-button"
import { RotatingPhrase } from "@/components/rotating-phrase"
import { OpraMark } from "@/components/opra-mark"
import { getCopy, type Lang } from "@/lib/i18n"
import { useRef, useEffect, useState } from "react"

export function Deck({ lang }: { lang: Lang }) {
  const t = getCopy(lang)

  // El deck tiene 5 pantallas; el nav solo enlaza 4 (la 3 es la frase, no es navegable)
  const NAV_ITEMS = [
    { label: t.nav.home, index: 0 },
    { label: t.nav.services, index: 1 },
    { label: t.nav.cases, index: 2 },
    { label: t.nav.contact, index: 4 },
  ]

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 4) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        if (!scrollContainerRef.current) return

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "instant",
        })

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection) {
          setCurrentSection(newSection)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection <= 4) {
          setCurrentSection(newSection)
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [currentSection])

  // svh y no vh: en celular 100vh mide la pantalla SIN la barra del navegador,
  // así que la página quedaba más alta que lo visible y arrancaba corrida
  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          {/* Paleta Opra: solo azules sobre azul casi negro. El naranja no entra
              al shader — se reserva para acentos de texto. */}
          <Swirl
            colorA="#040a14"
            colorB="#3a86c9"
            speed={0.8}
            detail={0.8}
            blend={50}
            coarseX={40}
            coarseY={40}
            mediumX={40}
            mediumY={40}
            fineX={40}
            fineY={40}
          />
          <ChromaFlow
            baseColor="#071223"
            upColor="#0b1b33"
            downColor="#071223"
            leftColor="#12406b"
            rightColor="#bfe6ff"
            intensity={0.75}
            radius={1.8}
            momentum={25}
            maskType="alpha"
            opacity={0.85}
          />
        </Shader>
        {/* Vela oscura: sin esto el shader lava el fondo a gris y el texto pierde contraste */}
        <div className="absolute inset-0 bg-[#060d18]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060d18]/85 via-[#060d18]/25 to-transparent" />
      </div>

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <OpraMark size={26} />
          <span className="font-sans text-2xl font-semibold lowercase tracking-tight text-foreground">opra</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${
                currentSection === item.index ? "text-foreground" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                  currentSection === item.index ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Idioma siempre visible, también en celular; el botón de contacto se
            desvanece al llegar a esa pantalla y ahí el ES/EN se queda solo */}
        <div className="flex items-center gap-3 md:gap-5">
          <LanguageToggle lang={lang} />
          {/* Ya estando en contacto el botón sobra: se desvanece en vez de
              desaparecer de golpe, para que el nav no dé un brinco */}
          <div
            className={`transition-opacity duration-500 ${
              currentSection === 4 ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            aria-hidden={currentSection === 4}
          >
            <MagneticButton variant="secondary" onClick={() => scrollToSection(4)}>
              {t.nav.cta}
            </MagneticButton>
          </div>
        </div>
      </nav>

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-[100svh] overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hero Section */}
        {/* pb-28 en celular: si no, los botones se montan sobre la flecha */}
        <section className="flex h-[100svh] w-screen shrink-0 snap-start flex-col justify-end px-6 pb-28 pt-24 md:px-12 md:pb-24">
          {/* Más ancho que el max-w-3xl original: el titular va en una sola línea
              y la frase rotativa reserva el ancho de sus palabras más largas */}
          <div className="max-w-5xl">
            <div className="mb-4 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-foreground/20 bg-foreground/15 px-4 py-1.5 backdrop-blur-md duration-700">
              <p className="font-mono text-xs text-foreground/90">{t.hero.badge}</p>
            </div>
            {/* La frase rotativa vive en su propio bloque para que el ancho lo fije
                ella y el título de arriba no se mueva nunca */}
            {/* Un solo clamp() en vez de escalones responsivos: las dos líneas van
                en nowrap, así que el tamaño tiene que seguir al ancho de pantalla */}
            <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-[clamp(1.75rem,4.8vw,4.5rem)] font-light leading-[1.1] tracking-tight text-foreground duration-1000">
              <span className="block whitespace-nowrap">
                {t.hero.headlineLead}{" "}
                <span className="font-serif italic tracking-normal text-opra-sky">
                  {t.hero.headlineAccent}
                </span>
              </span>
              {/* Un pelo más chica que la primera línea: es la más larga y así
                  entra completa en celular sin encoger todo el titular */}
              <span className="block text-[0.92em]">
                <RotatingPhrase
                  phrases={t.hero.phrases}
                  connector={t.hero.connector}
                  pluralSuffix={t.hero.pluralSuffix}
                />
              </span>
            </h1>
            <p className="mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-lg leading-relaxed text-foreground/90 duration-1000 delay-200 md:text-xl">
              <span className="text-pretty">
                {t.hero.subtitleLead}{" "}
                <span className="text-opra-orange">{t.hero.subtitleAccent}</span>
              </span>
            </p>
            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-4 duration-1000 delay-300 sm:flex-row sm:items-center">
              <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection(1)}>
                {t.hero.ctaPrimary}
              </MagneticButton>
              <MagneticButton
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => scrollToSection(4)}
              >
                {t.hero.ctaSecondary}
              </MagneticButton>
            </div>
          </div>

          {/* Solo la flecha: es una pista, no una instrucción. El scroll normal
              sigue funcionando igual; el clic es un atajo extra. */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500">
            <button
              type="button"
              onClick={() => scrollToSection(1)}
              aria-label={t.hero.nextSection}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 bg-foreground/10 text-foreground/80 backdrop-blur-md transition-all duration-300 hover:border-foreground/40 hover:bg-foreground/20 hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 animate-[opra-nudge_1.8s_ease-in-out_infinite]"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </section>

        <WorkSection copy={t.work} />
        <ServicesSection copy={t.cases} />
        <AboutSection copy={t.quote} />
        <ContactSection copy={t.contact} lang={lang} />
      </div>

      <ChatWidget copy={t.chat} lang={lang} />

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
