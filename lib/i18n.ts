export type Lang = "es" | "en"

export const LANGS: Lang[] = ["es", "en"]
export const LANG_COOKIE = "opra-lang"

/** El español vive en la raíz; el inglés cuelga de /en */
export const pathForLang = (lang: Lang) => (lang === "en" ? "/en" : "/")

/**
 * Países donde se asume español. Todo lo demás cae en inglés.
 * (Vercel manda el país en el header x-vercel-ip-country.)
 */
export const PAISES_ES = new Set([
  "MX", "ES", "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC",
  "GT", "HN", "NI", "PA", "PE", "PR", "PY", "SV", "UY", "VE",
])

const es = {
  meta: {
    title: "Opra | Procesos que impulsan tu negocio",
    description:
      "Diagnostica qué procesos frenan tu negocio y construye una solución diseñada para crecer.",
  },
  nav: {
    home: "Inicio",
    services: "Servicios",
    cases: "Casos de uso",
    contact: "Contacto",
    cta: "Hablemos",
  },
  hero: {
    badge: "IA para empresas",
    headlineLead: "Encuentra dónde la",
    headlineAccent: "IA",
    // "tu"/"tus": la "s" aparece sola cuando la frase lo pide
    connector: "tu",
    pluralSuffix: "s",
    phrases: [
      { lead: "automatiza", plural: true, end: "procesos" },
      { lead: "baja", plural: false, end: "gasto" },
      { lead: "sube", plural: true, end: "ingresos" },
      { lead: "acelera", plural: false, end: "crecimiento" },
    ],
    subtitleLead: "Descubre oportunidades para automatizar tus procesos actuales.",
    subtitleAccent: "Hecho a la medida.",
    ctaPrimary: "Explorar soluciones",
    ctaSecondary: "Hablemos",
    nextSection: "Ir a la siguiente sección",
  },
  work: {
    title: "Cómo funciona",
    eyebrow: "/ Servicios",
    steps: [
      {
        title: "Identificar",
        description:
          "Tu operación actual se revisa a fondo para encontrar dónde el trabajo manual consume tiempo, esfuerzo y provoca errores.",
      },
      {
        title: "Construir",
        description:
          "Con lo que realmente importa ya claro, la solución se diseña y se construye para integrarse a tus sistemas actuales — bien hecha.",
      },
      {
        title: "Integrar",
        description:
          "El sistema entra en tu operación diaria y tu equipo aprende a usarlo hasta volverlo rutina.",
      },
    ],
  },
  cases: {
    titleAccent: "Algunos",
    titleRest: "casos de uso",
    eyebrow: "/ Esto ya está funcionando:",
    items: [
      {
        title: "Facturación automática",
        description:
          "Al incurrir una compra o venta se desencadena el ciclo entero de facturación: desde pedir o recibir los datos, hasta hacer el envío o registro de la factura.",
      },
      {
        title: "Conciliación fiscal y bancaria",
        description:
          "Cruza tus comprobantes fiscales contra los movimientos de banco, identifica diferencias y entrega un reporte claro del período, listo para tu contador.",
      },
      {
        title: "Marketing automatizado",
        description: "Publicidad consistente con tu marca, optimizada para elevar tus ventas.",
      },
      {
        title: "Impuestos a favor",
        description:
          "Registra cada comprobante, calcula el saldo a favor e integra los papeles de trabajo. El trámite se presenta con el soporte completo.",
      },
      {
        title: "Calificación de prospectos",
        description:
          "Responde de inmediato por WhatsApp, aplica tus criterios de calificación y registra cada contacto. Solo llegan a ti los prospectos que valen tu tiempo.",
      },
    ],
  },
  quote: {
    lead: "Sabes que la inteligencia artificial es el",
    leadAccent: "futuro",
    tail: ".",
    question: "¿Cuál es el de tu negocio?",
  },
  contact: {
    titleLead: "Hablemos de tus",
    titleAccent: "oportunidades",
    eyebrow: "/ Contacto",
    whatsapp: "WhatsApp",
    openForm: "Contacto",
    blurbLead: "Un par de líneas sobre tu operación basta para empezar.",
    blurbAccent: "Recibes respuesta pronto",
    fields: { name: "Nombre", email: "Email", company: "Empresa", message: "Mensaje" },
    placeholders: {
      name: "Tu nombre",
      email: "tu@correo.com",
      company: "Nombre de tu empresa",
      message: "¿Qué proceso te está costando tiempo?",
    },
    submit: "Enviar",
    submitting: "Enviando…",
    ok: "Listo, el mensaje llegó. Recibes respuesta pronto.",
    errorFallback: "No se pudo enviar el mensaje.",
    errorSuffix: "Escribe por WhatsApp mientras tanto.",
    whatsappIntro: "Hola, me gustaría hablar sobre oportunidades de automatización.",
    whatsappFields: { name: "Nombre", email: "Email", company: "Empresa", message: "Mensaje" },
  },
  chat: {
    open: "Abrir chat",
    close: "Cerrar chat",
    title: "Diagnóstico rápido",
    subtitle: "Cuéntame de tu negocio y te digo qué se puede automatizar.",
    welcome: "Hola. Para darte ideas útiles necesito entender tu negocio. ¿A qué se dedican?",
    placeholder: "Escribe aquí…",
    send: "Enviar",
    thinking: "Escribiendo…",
    error: "No pude responder. Intenta de nuevo.",
    unavailable: "El chat no está disponible por ahora. Usa el formulario de contacto.",
    limit: "Llegamos al límite de esta conversación. Si quieres seguir, escríbenos por el formulario.",
    reset: "Nueva conversación",
  },
}

export type Copy = typeof es

const en: Copy = {
  meta: {
    title: "Opra | Processes that move your business forward",
    description:
      "Pinpoint the processes holding your business back, and put a solution in place that is built to grow with it.",
  },
  nav: {
    home: "Home",
    services: "Services",
    cases: "Use cases",
    contact: "Contact",
    cta: "Let's talk",
  },
  hero: {
    badge: "AI for business",
    headlineLead: "Find where",
    headlineAccent: "AI",
    // En inglés "your" no cambia: el sufijo va vacío y nunca aparece
    connector: "your",
    pluralSuffix: "",
    phrases: [
      { lead: "automates", plural: false, end: "processes" },
      { lead: "cuts", plural: false, end: "costs" },
      { lead: "grows", plural: false, end: "revenue" },
      { lead: "accelerates", plural: false, end: "growth" },
    ],
    subtitleLead: "Find opportunities to automate the processes you already run.",
    subtitleAccent: "Built to fit.",
    ctaPrimary: "Explore solutions",
    ctaSecondary: "Let's talk",
    nextSection: "Go to next section",
  },
  work: {
    title: "How it works",
    eyebrow: "/ Services",
    steps: [
      {
        title: "Identify",
        description:
          "A close look at how the business runs today, to pinpoint where manual work is costing time, effort and accuracy.",
      },
      {
        title: "Build",
        description:
          "With the priorities clear, the solution is designed and built to fit the systems already in place — built properly, not patched together.",
      },
      {
        title: "Integrate",
        description:
          "The system moves into day-to-day operations, and your team is trained until using it becomes second nature.",
      },
    ],
  },
  cases: {
    titleAccent: "A few",
    titleRest: "use cases",
    eyebrow: "/ Already up and running:",
    items: [
      {
        title: "Automated invoicing",
        description:
          "Every purchase or sale sets the full invoicing cycle in motion: collecting the billing details, issuing the invoice, and sending or filing it. Nothing is keyed in by hand.",
      },
      {
        title: "Invoice and bank reconciliation",
        description:
          "Matches the invoices you issued and received against your bank activity, flags the discrepancies, and delivers a clean report for the period, ready for your accountant.",
      },
      {
        title: "Automated marketing",
        description: "Advertising that stays true to your brand, tuned to drive sales.",
      },
      {
        title: "Tax refunds",
        description:
          "Logs every supporting document, calculates the balance owed to you and assembles the working papers. The claim is filed with its backup already complete.",
      },
      {
        title: "Lead qualification",
        description:
          "Answers on WhatsApp within seconds, applies your qualifying criteria, and logs every conversation. Only the leads worth your time reach you.",
      },
    ],
  },
  quote: {
    lead: "You know artificial intelligence is the",
    leadAccent: "future",
    tail: ".",
    question: "What's the future of your business?",
  },
  contact: {
    titleLead: "Let's talk about your",
    titleAccent: "opportunities",
    eyebrow: "/ Contact",
    whatsapp: "WhatsApp",
    openForm: "Contact",
    blurbLead: "A couple of lines about your operation is enough to start.",
    blurbAccent: "You'll hear back soon",
    fields: { name: "Name", email: "Email", company: "Company", message: "Message" },
    placeholders: {
      name: "Your name",
      email: "you@email.com",
      company: "Your company",
      message: "Which process is eating your time?",
    },
    submit: "Send",
    submitting: "Sending…",
    ok: "Got it. You'll hear back soon.",
    errorFallback: "The message could not be sent.",
    errorSuffix: "Reach out on WhatsApp in the meantime.",
    whatsappIntro: "Hi, I'd like to talk about automation opportunities.",
    whatsappFields: { name: "Name", email: "Email", company: "Company", message: "Message" },
  },
  chat: {
    open: "Open chat",
    close: "Close chat",
    title: "Quick diagnosis",
    subtitle: "Tell me about your business and I'll tell you what can be automated.",
    welcome: "Hi. To give you useful ideas I need to understand your business. What do you do?",
    placeholder: "Type here…",
    send: "Send",
    thinking: "Typing…",
    error: "I couldn't answer. Please try again.",
    unavailable: "The chat isn't available right now. Use the contact form instead.",
    limit: "We've reached the limit for this conversation. To continue, reach out through the form.",
    reset: "New conversation",
  },
}

export const copy: Record<Lang, Copy> = { es, en }

export const getCopy = (lang: Lang) => copy[lang]
