"use client";

import Image from "next/image";

import { hero } from "@/lib/dados";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";

/**
 * BLOCO 1d — Logo da hero, clicável: volta ao topo.
 *
 * ⚠ POR QUE NÃO É UM <a href="#inicio"> E POR QUE NÃO HÁ scroll-behavior AQUI:
 * a suavidade sai de window.scrollTo, no clique, e de mais lugar nenhum.
 * `scroll-behavior: smooth` vale para TODA rolagem programática da página, e
 * duas seções dependem de ler a posição de rolagem quadro a quadro — o
 * ScrollTrigger da faixa de paralaxe e o useScroll do scroll horizontal das
 * obras. Com a rolagem suavizada por CSS, pin e scrub leem uma posição que
 * ainda está em movimento e dessincronizam.
 *
 * ⚠ É <button> e não link porque o destino é o topo desta mesma página: não há
 * URL nova para navegar nem hash para deixar na barra. Na rota /contato a
 * logo continua sendo <Link href="/">, que aí sim troca de página.
 *
 * ⚠ COM prefers-reduced-motion O SALTO É "instant", E NÃO "auto". Medido: com
 * "auto" o percurso ainda animava — 62 posições distintas amostradas quadro a
 * quadro entre o rodapé e o topo. "auto" quer dizer "obedeça ao CSS", e o
 * html deste site já carrega `scroll-behavior: smooth` em app/globals.css,
 * então quem pediu menos movimento continuava recebendo a animação inteira.
 * Com "instant" a rolagem ignora o CSS: 1 posição amostrada, salto seco.
 */
export function LogoTopo() {
  const reduzido = useMovimentoReduzido();

  return (
    <button
      type="button"
      aria-label="Império Construtora — voltar ao topo"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduzido ? "instant" : "smooth" })
      }
      className="block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-lt"
    >
      <Image src={hero.logo} alt="" priority className="h-14 w-auto" />
    </button>
  );
}
