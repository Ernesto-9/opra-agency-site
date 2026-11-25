// La marca vive centrada dentro de un PNG 16:9 con mucho aire alrededor, así
// que se recorta por CSS a su caja real (medida sobre el canal alfa):
// x 31.67% · y 20.12% · ancho 36.67% · alto 65.09%.
//
// Va como background-image, no como máscara: el PNG ya es blanco sobre
// transparente y así no depende de currentColor ni del soporte de mask, que en
// Samsung Internet dejaba el logo oscuro.
const SCALE = 100 / 36.67 // ancho de la imagen completa respecto a la marca
const OFFSET_X = 31.67 * (SCALE / 100)
const OFFSET_Y = 20.12 * ((100 / 65.09) / 100)

export function OpraMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label="Opra"
      className={`inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: "url(/opra-icon.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${size * SCALE}px auto`,
        backgroundPosition: `${-size * OFFSET_X}px ${-size * OFFSET_Y}px`,
      }}
    />
  )
}
