"use client";

import dynamic from "next/dynamic";

import { hero } from "@/lib/dados";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";

/** Pill chapado em gold com texto ink: fallback e estado de carga. */
function PillEstatico() {
  return (
    <a
      href="#contato"
      className="inline-flex h-14 w-[232px] items-center justify-center rounded-pill bg-gold text-body-sm uppercase tracking-[0.1em] text-ink transition-colors hover:bg-gold-lt"
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
