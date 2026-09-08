import Image from "next/image";

import { hero } from "@/lib/dados";

/**
 * BLOCO 3 — Hero Image Band
 * Foto full-bleed, sem raio, sem sombra. Meta e headline em bone no canto
 * inferior esquerdo, 32px das bordas, com a medida de 672px do DESIGN.md.
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
          Vale em todas as larguras, sem breakpoint. É o estado final do bloco.

          A foto é uma loja de vitrine iluminada e a área clara cai justamente
          onde o DESIGN.md posiciona o texto. Foram medidos, sobre os pixels
          compostos da região renderizada, três eixos de geometria (recorte,
          caixa fixa e caixa proporcional) e as catorze imagens de
          /public/obras como hero alternativo. Nada fecha o critério WCAG sem
          overlay: nenhuma das catorze passa sequer a 1024px.

          Não estreite a caixa do texto para "ajudar": o cap de 40% que existiu
          aqui espremia o headline em cinco linhas a 768px e empurrava o meta
          para 91% da altura da banda, onde o gradiente é transparente — era a
          causa da única reprovação que restava.

          Registrado na seção "Desvios" do DESIGN.md. */}
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-ink/90 via-ink/80 via-70% to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-8">
        <p className="text-caption uppercase text-bone">{hero.meta}</p>
        <p className="mt-8 max-w-2xl text-subheading text-bone sm:text-heading-sm">
          {hero.headline}
        </p>
      </div>
    </section>
  );
}
