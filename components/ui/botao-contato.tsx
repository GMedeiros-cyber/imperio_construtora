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
 *
 * ══ MENOR NO CELULAR, E ONDE PAROU ══
 *
 * Abaixo de 768px o botão encolhe, a pedido, "em torno de 30%": 232×56 no
 * desktop, 172×44 no celular. Nenhum dos dois eixos chegou aos 30%, e cada
 * um parou num piso diferente:
 *   - ALTURA, 56 -> 44 (−21%): 30% seriam 39px, abaixo do alvo de toque de
 *     44px, que é inegociável.
 *   - LARGURA, 232 -> 172 (−26%): 30% seriam 162px, e o rótulo "FALAR COM A
 *     IMPÉRIO" só cabe ali abaixo de 12px, o menor corpo da escala do site
 *     (text-caption). A 12px ele mede 148,5px; 172 deixa 12px de cada lado.
 * Desktop não muda. Vale para as DUAS chamadas — a da chamada final encolhe
 * junto, porque é o mesmo botão.
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

/* Medidas por largura. O estático usa as MESMAS em classe, para não haver
   salto quando o shader entra. */
const DESKTOP = { largura: 232, altura: 56, rotulo: 14 };
const CELULAR = { largura: 172, altura: 44, rotulo: 12 };
/* A MESMA fronteira do max-[768px] do Tailwind, que gera "not (min-width:
   768px)": com "(max-width: 767px)" aqui, a 767,5px o CSS e o JS discordariam. */
const CONSULTA_CELULAR = "not all and (min-width: 768px)";

/* Lida de forma síncrona no cliente: o LiquidMetalButton já nasce com a
   medida certa, sem montar grande e encolher. */
function assinarCelular(aviso: () => void) {
  const mq = window.matchMedia(CONSULTA_CELULAR);
  mq.addEventListener("change", aviso);
  return () => mq.removeEventListener("change", aviso);
}
const celularAgora = () => window.matchMedia(CONSULTA_CELULAR).matches;

/* false no servidor e na hidratação, true depois — sem setState em efeito. */
const assinarNada = () => () => {};
const noClienteAgora = () => true;
const noServidor = () => false;

function PillEstatico({ href, rotulo }: Props) {
  return (
    <a
      href={href}
      style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #0A0A0A 100%)" }}
      className="inline-flex h-14 w-[232px] items-center justify-center rounded-pill border border-gold text-[14px] font-normal max-[768px]:h-11 max-[768px]:w-[172px] max-[768px]:text-[12px] uppercase tracking-[0.1em] text-bone transition-colors hover:border-gold-lt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-lt"
    >
      {rotulo}
    </a>
  );
}

export function BotaoContato({ href, rotulo }: Props) {
  const reduzido = useMovimentoReduzido();
  const noCliente = useSyncExternalStore(assinarNada, noClienteAgora, noServidor);
  const celular = useSyncExternalStore(assinarCelular, celularAgora, noServidor);
  const medida = celular ? CELULAR : DESKTOP;

  /* Com movimento reduzido não há shader nem canvas: só o estático. */
  if (reduzido || !noCliente) return <PillEstatico href={href} rotulo={rotulo} />;

  return (
    <Suspense fallback={<PillEstatico href={href} rotulo={rotulo} />}>
      <LiquidMetalButton
        href={href}
        label={rotulo}
        width={medida.largura}
        height={medida.altura}
        tamanhoRotulo={medida.rotulo}
      />
    </Suspense>
  );
}
