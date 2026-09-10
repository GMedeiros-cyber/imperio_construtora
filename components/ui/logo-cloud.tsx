import { PlusIcon } from "lucide-react";
import Image from "next/image";

import type { LogoCliente } from "@/lib/logos";
import { cn } from "@/lib/utils";

/**
 * Logo Cloud — grade de marcas com régua entre as células.
 *
 * NÃO é carrossel: 2 colunas no mobile, 5 no desktop. Com DEZ marcas fecha em
 * cinco linhas exatas embaixo e duas em cima, sem célula órfã em nenhuma das
 * duas larguras. ⚠ O número de logos e o de colunas são a mesma decisão: com
 * quatro colunas, dez deixaria duas sobrando na última linha. Mexeu num, remeça
 * o outro.
 *
 * ══ O QUE MUDOU DO COMPONENTE DE ORIGEM ══
 *
 * O original vinha do sistema do shadcn, com oito cards escritos à mão
 * apontando para SVGs de CDN, e o xadrez distribuído classe por classe. A
 * grade, o xadrez e os cruzamentos estão preservados, mas CALCULADOS por
 * índice — era a única forma de sair de oito células fixas para dez.
 *
 * Traduções obrigatórias, porque nada disso existe no nosso sistema:
 *   bg-background       -> bone (é o fundo da própria página, então: nada)
 *   bg-secondary        -> ash a 20%, o degrau que o creme aceita
 *   border sem cor      -> ash, a hairline do sistema
 *   dark:*              -> fora, o site não tem tema escuro alternável
 *   brightness-0 invert -> fora, as logos entram nas cores originais
 *
 * ══ AS RÉGUAS w-screen ══
 *
 * As duas barras absolutas de topo e base sangram até a borda da viewport
 * enquanto a grade respeita o gutter. É isso que amarra a faixa ao full-bleed
 * do site. Quem segura o 100vw é o overflow-x-clip da <section>.
 */

const COLUNAS_MOBILE = 2;
const COLUNAS_DESKTOP = 5;

/* Sombreia quando linha + coluna é par. Com dez células o padrão fecha
   equilibrado nas duas grades e nenhuma linha termina pela metade. */
const ehXadrez = (i: number, colunas: number) =>
  (Math.floor(i / colunas) + (i % colunas)) % 2 === 0;

const ehUltimaColuna = (i: number, colunas: number) =>
  i % colunas === colunas - 1;

const ehUltimaLinha = (i: number, colunas: number, total: number) =>
  Math.floor(i / colunas) === Math.floor((total - 1) / colunas);

export function LogoCloud({
  logos,
  className,
  ...props
}: React.ComponentProps<"div"> & { logos: LogoCliente[] }) {
  const total = logos.length;

  return (
    <div
      className={cn(
        "relative grid grid-cols-2 border-x border-ash md:grid-cols-5",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute -top-px left-1/2 w-screen -translate-x-1/2 border-t border-ash" />

      {logos.map((logo, i) => {
        const ultimaColMob = ehUltimaColuna(i, COLUNAS_MOBILE);
        const ultimaLinMob = ehUltimaLinha(i, COLUNAS_MOBILE, total);
        const ultimaColDesk = ehUltimaColuna(i, COLUNAS_DESKTOP);
        const ultimaLinDesk = ehUltimaLinha(i, COLUNAS_DESKTOP, total);

        /* Só cruzamento interno ganha o "+": quem está na última coluna ou na
           última linha não tem cruzamento à frente. */
        const maisMob = !ultimaColMob && !ultimaLinMob;
        const maisDesk = !ultimaColDesk && !ultimaLinDesk;

        /* As classes precisam existir INTEIRAS no fonte, com o prefixo do
           breakpoint escrito por extenso — senão o scanner do Tailwind não as
           vê e elas não entram no CSS. Daí os ternários com literais completos
           em vez de template string. */
        return (
          <div
            key={logo.arquivo}
            className={cn(
              "relative flex items-center justify-center border-ash px-4 py-10 md:px-6 md:py-14",
              ultimaColMob ? "" : "border-r",
              ultimaLinMob ? "" : "border-b",
              ultimaColDesk ? "md:border-r-0" : "md:border-r",
              ultimaLinDesk ? "md:border-b-0" : "md:border-b",
              ehXadrez(i, COLUNAS_MOBILE) ? "bg-ash/20" : "bg-transparent",
              ehXadrez(i, COLUNAS_DESKTOP)
                ? "md:bg-ash/20"
                : "md:bg-transparent",
            )}
          >
            {/* Altura e largura limitadas juntas: as proporções vão de 7,06:1 a
                0,84:1, então nas marcas largas quem trava é a largura e nas
                compactas é a altura. Com width e height em auto, um max-*
                encolhe a imagem inteira mantendo a proporção — não recorta.
                O min() com 100% impede o estouro nas larguras em que a célula
                fica mais estreita que o teto nominal.

                A escala entra como custom property porque o teto muda no
                breakpoint, e style inline não tem breakpoint. */}
            <Image
              src={logo.arquivo}
              alt={logo.nome}
              width={logo.largura}
              height={logo.altura}
              sizes="(min-width: 768px) 20vw, 50vw"
              style={{ "--escala": logo.escala } as React.CSSProperties}
              className="pointer-events-none h-auto max-h-[calc(2.25rem*var(--escala))] w-auto max-w-[min(calc(6rem*var(--escala)),100%)] select-none object-contain md:max-h-[calc(3rem*var(--escala))] md:max-w-[min(calc(9.5rem*var(--escala)),100%)]"
            />

            {maisMob || maisDesk ? (
              <PlusIcon
                aria-hidden
                strokeWidth={1}
                className={cn(
                  "pointer-events-none absolute -bottom-[12.5px] -right-[12.5px] z-10 size-6 text-ash",
                  maisMob ? "block" : "hidden",
                  maisDesk ? "md:block" : "md:hidden",
                )}
              />
            ) : null}
          </div>
        );
      })}

      <div className="pointer-events-none absolute -bottom-px left-1/2 w-screen -translate-x-1/2 border-b border-ash" />
    </div>
  );
}
