"use client";

import { useEffect, useRef, useState } from "react";

// Por debajo de este tamaño (lado mayor, en px) la foto se vería borrosa si se estira al recuadro
const LADO_MINIMO = 400;
// Una foto pequeña se agranda como máximo 3 veces: más que eso ya se pixela
const AUMENTO_MAXIMO = 3;

/**
 * Foto de un repuesto que se adapta a su calidad: las grandes llenan el recuadro (como siempre)
 * y las pequeñas (p. ej. miniaturas de un Excel) se muestran centradas sin estirarse.
 * Con `fondo`, una foto pequeña no se muestra (como fondo grande se vería pixelada).
 */
export function FotoProducto({
  src,
  alt,
  className = "",
  fondo = false,
}: {
  src: string;
  alt: string;
  /** Clases para la foto grande (la de siempre: "h-full w-full object-cover …") */
  className?: string;
  fondo?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [tamano, setTamano] = useState<{ ancho: number; alto: number } | null>(null);

  function medir() {
    const img = ref.current;
    if (img && img.naturalWidth > 0) setTamano({ ancho: img.naturalWidth, alto: img.naturalHeight });
  }

  // Si la foto ya estaba en caché, onLoad pudo dispararse antes de hidratar
  useEffect(() => {
    setTamano(null);
    if (ref.current?.complete) medir();
  }, [src]);

  const pequena = tamano !== null && Math.max(tamano.ancho, tamano.alto) < LADO_MINIMO;

  if (pequena && fondo) return null;

  if (pequena && tamano) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={ref}
          src={src}
          alt={alt}
          onLoad={medir}
          style={{ width: tamano.ancho * AUMENTO_MAXIMO, height: tamano.alto * AUMENTO_MAXIMO }}
          className="max-h-[70%] max-w-[70%] object-contain"
        />
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} onLoad={medir} className={className} />;
}
