"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";

import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";

/*
 * O BOTÃO DE CONTATO DO SITE — um componente, duas chamadas.
 *
 * A hero e a chamada final usam ESTE botão, e só ele: pílula de miolo ink,
 * anel dourado em shader (LiquidMetalButton), rótulo bone em caixa alta. Até
 * esta rodada a chamada final tinha uma pílula dourada cheia com seta, e as
 * duas pontas da página falavam línguas diferentes. Foi unificado a pedido,
 * com o botão da hero como referência — sem seta.
 *
 * ⚠ NÃO copie estas classes para outro lugar. Precisou de botão de contato,
 * chame <BotaoContato>.
 *
 * ══ O ESTÁTICO É IDÊNTICO AO FINAL ══
 *
 * PillEstatico é o estado até o shader chegar, e o estado definitivo com
 * movimento reduzido. Tem de ser IGUAL ao LiquidMetalButton em repouso: miolo
 * escuro, borda dourada de 1px, rótulo bone. Já foi uma pílula chapada de
 * gold, e era ela que piscava amarela nos primeiros ~180ms de cada
 * recarregamento. O miolo escuro não é decorativo: é ele que dá contraste ao
 * rótulo, que sem shader ficaria direto sobre a foto.
 *
 * ══ POR QUE lazy + Suspense, E NÃO next/dynamic ══
 *
 * O `loading` do next/dynamic NÃO recebe as props do componente — só dava
 * para escrever o rótulo da hero ali, fixo. Com dois lugares chamando o botão
 * com rótulos diferentes, o fallback precisa do rótulo de quem chamou, e o
 * fallback do Suspense recebe. O shader continua fora do HTML do servidor: no
 * servidor e na hidratação `noCliente` é false e sai o estático; o
 * LiquidMetalButton só é importado depois, no cliente, e não disputa com a
 * foto da hero, que é o LCP.
 */

type Props = {
  href: string;
  rotulo: string;
};

const LiquidMetalButton = lazy(() =>
  import("@/components/ui/liquid-metal-button").then((m) => ({
    default: m.LiquidMetalButton,
  })),
);

/* false no servidor e na hidratação, true depois — sem setState em efeito. */
const assinarNada = () => () => {};
const noClienteAgora = () => true;
const noServidor = () => false;

function PillEstatico({ href, rotulo }: Props) {
  return (
    <a
      href={href}
      style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #0A0A0A 100%)" }}
      className="inline-flex h-14 w-[232px] items-center justify-center rounded-pill border border-gold text-[14px] font-normal uppercase tracking-[0.1em] text-bone transition-colors hover:border-gold-lt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-lt"
    >
      {rotulo}
    </a>
  );
}

export function BotaoContato({ href, rotulo }: Props) {
  const reduzido = useMovimentoReduzido();
  const noCliente = useSyncExternalStore(assinarNada, noClienteAgora, noServidor);

  /* Com movimento reduzido não há shader nem canvas: só o estático. */
  if (reduzido || !noCliente) return <PillEstatico href={href} rotulo={rotulo} />;

  return (
    <Suspense fallback={<PillEstatico href={href} rotulo={rotulo} />}>
      <LiquidMetalButton href={href} label={rotulo} />
    </Suspense>
  );
}
