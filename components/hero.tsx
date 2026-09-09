import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { hero } from "@/lib/dados";

/**
 * BLOCO 1 — Hero
 * Seção full-bleed de 100vh: a foto cobre tudo, a navegação fica no topo
 * dentro dela e manchete e parágrafo se apoiam na base.
 *
 * REQUISITO DA FOTO DE FUNDO — não trocar sem conferir:
 * a imagem precisa ter o TERÇO INFERIOR ESCURO EM TODA A LARGURA, porque a
 * manchete e o parágrafo ficam em cima dele, em bone. Foto com base clara
 * reprova em contraste e não serve, por mais bonita que seja. Ao receber a
 * foto real, medir o contraste do texto bone sobre ela em 360, 390, 768,
 * 1440 e 1920px ANTES de aprovar — o mínimo é 4,5:1 para o parágrafo de
 * 16px e 3:1 para a manchete, que é texto grande.
 */
export function Hero() {
  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden">
      <Image
        src={hero.fundo}
        alt={hero.fundoAlt}
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover"
      />

      {/* Navegação, dentro da imagem */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-8 p-8">
        <p className="text-caption uppercase tracking-[0.18em] text-bone">
          {hero.marca.map((linha) => (
            <span key={linha} className="block">
              {linha}
            </span>
          ))}
        </p>

        <nav className="hidden items-center gap-12 md:flex">
          {hero.links.map((link) => (
            <a
              key={link.texto}
              href={link.href}
              className="text-caption uppercase tracking-[0.1em] text-bone"
            >
              {link.texto}
            </a>
          ))}
        </nav>

        {/* Abaixo de 768px a navegação vira este botão, que ainda não abre nada. */}
        <button
          type="button"
          className="rounded-pill border border-bone px-6 py-3 text-caption uppercase tracking-[0.1em] text-bone md:hidden"
        >
          {hero.menu}
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-12 p-8 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="text-heading-sm leading-none text-bone md:text-heading xl:text-display">
          {hero.manchete.map((linha) => (
            <span key={linha} className="block">
              {linha}
            </span>
          ))}
        </h1>

        <div className="lg:max-w-md lg:shrink-0">
          <p className="text-body text-bone">{hero.paragrafo}</p>

          <a href="#contato" className="mt-8 flex items-center gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-pill border border-bone text-bone">
              <ArrowRight size={16} strokeWidth={1} aria-hidden />
            </span>
            <span className="text-body-sm text-bone underline">{hero.cta}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
