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
 *
 * ⚠ h-20, 80px: subiu de h-14 (56px) a pedido do cliente. O limite é o botão de
 * menu fixo, que divide a mesma linha do topo. Medido a 360px, a mais estreita:
 * logo de 32 a 132px, botão de 173 a 328px — 41px de folga. Se o botão crescer,
 * ou a logo, é ESTA folga que some primeiro; abaixo de zero, desce para h-16.
 *
 * ⚠ ABAIXO DE 768px É h-14, 56px — 30% menor, a pedido; desktop continua
 * h-20. Com o botão de menu também 30% menor no celular (105×44), a folga
 * medida a 360px subiu para 121px. Alvo da logo: 70×56, acima dos 44px.
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
      <Image src={hero.logo} alt="" priority className="h-20 w-auto max-[768px]:h-14" />
    </button>
  );
}
