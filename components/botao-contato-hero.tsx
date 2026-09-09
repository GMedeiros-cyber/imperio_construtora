"use client";

import dynamic from "next/dynamic";

import { hero } from "@/lib/dados";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";

/*
 * Fallback e estado de carga. Precisa ser IDENTICO ao estado final do
 * LiquidMetalButton: miolo escuro, borda dourada de 1px, rótulo bone. Era um
 * pill chapado de gold, e como este é o loading do import dinâmico, era ele
 * que produzia a pílula amarela cheia nos primeiros ~180ms de cada
 * recarregamento — o preenchimento do contêiner do shader vinha depois.
 * Igualando os dois estados, não sobra quadro intermediário para piscar.
 *
 * Também é o estado definitivo com movimento reduzido, e por isso o miolo
 * escuro não é decorativo: é ele que dá contraste ao rótulo bone, que sem
 * shader ficaria direto sobre a foto.
 */
function PillEstatico() {
  return (
    <a
      href="#contato"
      style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #0A0A0A 100%)" }}
      className="inline-flex h-14 w-[232px] items-center justify-center rounded-pill border border-gold text-[14px] font-normal uppercase tracking-[0.1em] text-bone transition-colors hover:border-gold-lt"
    >
      {hero.cta}
    </a>
  );
}

/* ssr:false só é permitido em componente de cliente, por isso este wrapper.
   O canvas WebGL fica fora do HTML inicial e não disputa com a foto da hero,
   que é o LCP; até ele montar, o pill estático ocupa o lugar. */
const LiquidMetalButton = dynamic(
  () =>
    import("@/components/ui/liquid-metal-button").then(
      (m) => m.LiquidMetalButton,
    ),
  { ssr: false, loading: () => <PillEstatico /> },
);

export function BotaoContatoHero() {
  const reduzido = useMovimentoReduzido();

  /* Com movimento reduzido não há shader nem canvas: só o pill. */
  if (reduzido) return <PillEstatico />;

  return <LiquidMetalButton href="#contato" label={hero.cta} />;
}
