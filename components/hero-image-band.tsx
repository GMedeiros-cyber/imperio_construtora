import Image from "next/image";

import { hero } from "@/lib/dados";

/**
 * BLOCO 3 — Hero Image Band
 * Foto full-bleed, sem raio, sem sombra. Meta e headline em bone no canto
 * inferior esquerdo, 32px das bordas.
 *
 * A caixa do headline é limitada a 40% da largura da banda, e não a um valor
 * fixo: a proporção entre texto e foto precisa se manter em qualquer largura,
 * senão o texto invade a vitrine iluminada em telas menores. O cap só vale de
 * md para cima — no mobile quem limita a caixa é a viewport.
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
          Escopo: tudo abaixo de 1024px (lg:hidden). A foto é uma loja de
          vitrine iluminada, e a área clara cai justamente onde o DESIGN.md
          posiciona o texto. Medido sobre os pixels compostos: no recorte 4:3
          do mobile o meta ficava em 2,02:1 e o headline em 1,55:1, contra os
          4,5:1 exigidos para texto normal. Recortes 3:4 e quadrado foram
          medidos a 360, 390 e 768px e reprovam igual. A caixa proporcional
          foi medida em 40%, 36% e 32% a 768, 1024, 1280, 1440 e 1920px, e
          nenhuma fecha 768px — por isso o gradiente vai até lg, e não md.
          Registrado na seção "Desvios" do DESIGN.md. */}
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-ink/90 via-ink/80 via-70% to-transparent lg:hidden" />

      <div className="absolute inset-x-0 bottom-0 p-8">
        <p className="text-caption uppercase text-bone">{hero.meta}</p>
        <p className="mt-8 text-subheading text-bone sm:text-heading-sm md:max-w-[40%]">
          {hero.headline}
        </p>
      </div>
    </section>
  );
}
