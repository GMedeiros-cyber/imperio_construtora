import Image from "next/image";

import { hero } from "@/lib/dados";

/**
 * BLOCO 3 — Hero Image Band
 * Foto full-bleed, sem raio, sem sombra. Meta e headline em bone no canto
 * inferior esquerdo, 32px das bordas.
 *
 * O gradiente é o que torna possível o texto bone especificado no DESIGN.md:
 * o canto inferior desta foto é asfalto claro e o creme sumiria nele.
 */
export function HeroImageBand() {
  return (
    <section className="relative aspect-[4/3] w-full md:aspect-[21/9]">
      <Image
        src={hero.imagem}
        alt={hero.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/50 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-8">
        <p className="text-caption uppercase text-bone">{hero.meta}</p>
        <p className="mt-8 max-w-2xl text-subheading text-bone sm:text-heading-sm">{hero.headline}</p>
      </div>
    </section>
  );
}
