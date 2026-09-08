import Image from "next/image";

import { hero } from "@/lib/dados";

/**
 * BLOCO 3 — Hero Image Band
 * Foto full-bleed, sem raio, sem sombra. Meta e headline em bone no canto
 * inferior esquerdo, 32px das bordas.
 *
 * A caixa do headline é limitada a 576px (max-w-xl) para que as linhas fiquem
 * na metade escura da foto: a 672px o texto invadia a vitrine iluminada e a
 * pior fatia caía para 1,78:1.
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

      {/* DESVIO CONHECIDO do DESIGN.md, que proíbe overlay sobre a foto.
          Escopo estritamente mobile (md:hidden). No recorte 4:3 a vitrine
          iluminada ocupa a faixa inferior inteira e o texto bone reprova no
          WCAG: meta 12px em 1,63:1 e headline 20px em 1,46:1, contra os 4,5:1
          exigidos para texto normal. Estreitar a caixa não resolve, porque no
          mobile ela já está limitada pela viewport. Os recortes 3:4 e quadrado
          foram medidos a 360, 390 e 768px e reprovam igual. No desktop o
          recorte 21:9 corta a área clara e não há gradiente nenhum.
          Registrado na seção "Desvios" do DESIGN.md. */}
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-ink/90 via-ink/80 via-70% to-transparent md:hidden" />

      <div className="absolute inset-x-0 bottom-0 p-8">
        <p className="text-caption uppercase text-bone">{hero.meta}</p>
        <p className="mt-8 max-w-xl text-subheading text-bone sm:text-heading-sm">
          {hero.headline}
        </p>
      </div>
    </section>
  );
}
