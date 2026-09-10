import { PlusIcon } from "lucide-react";
import Image from "next/image";

import type { LogoCliente } from "@/lib/logos";
import { cn } from "@/lib/utils";

/**
 * Logo Cloud — placas de creme assentadas em argamassa preta.
 *
 * NÃO é carrossel: 2 colunas no mobile, 5 no desktop. Com DEZ marcas fecha em
 * cinco linhas exatas embaixo e duas em cima, sem célula órfã. ⚠ O número de
 * logos e o de colunas são a mesma decisão: com quatro colunas, dez deixaria
 * duas sobrando na última linha. Mexeu num, remeça o outro.
 *
 * ══ POR QUE PLACA CLARA SOBRE CAMPO PRETO ══
 *
 * A faixa é ink, mas as logos entram nas cores originais das marcas — e seis
 * das dez somem sobre o preto, três delas por serem pretas de nascença. A
 * medição está em lib/logos.ts. A saída não é escolher entre preto e cor: é
 * dar a cada marca a base clara para a qual ela foi desenhada e deixar o preto
 * fazer o que ele faz melhor, que é emoldurar.
 *
 * O vão entre as placas É o desenho, não um gap qualquer: são 12px no mobile e
 * 20px no desktop, largos o bastante para lerem como junta e não como falha de
 * alinhamento.
 *
 * ══ O "+" DOS CRUZAMENTOS, QUE AGORA APARECE ══
 *
 * Na versão de hairlines ele era invisível: caía exatamente sobre o cruzamento
 * de duas linhas ash, na mesma cor e espessura. Aqui ele cai no meio da junta
 * preta, em ash — medido, 9:1 sobre o ink. Ele é a razão da junta ser larga.
 *
 * ══ O QUE MUDOU DO COMPONENTE DE ORIGEM ══
 *
 * Do shadcn vinham oito cards à mão apontando para SVGs de CDN, com o xadrez
 * distribuído classe a classe. A grade e os cruzamentos ficaram; o xadrez saiu.
 * Com a argamassa preta separando tudo, alternar o tom das placas viraria
 * ruído — a junta já dá a estrutura que o xadrez dava. As traduções obrigatórias
 * (bg-background, bg-secondary, dark:*, brightness-0 invert) deixaram de fazer
 * sentido junto com ele.
 */

const COLUNAS_MOBILE = 2;
const COLUNAS_DESKTOP = 5;

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
        "grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5",
        className,
      )}
      {...props}
    >
      {logos.map((logo, i) => {
        /* Só cruzamento interno ganha o "+": quem está na última coluna ou na
           última linha não tem junta cruzando à frente. */
        const maisMob =
          !ehUltimaColuna(i, COLUNAS_MOBILE) &&
          !ehUltimaLinha(i, COLUNAS_MOBILE, total);
        const maisDesk =
          !ehUltimaColuna(i, COLUNAS_DESKTOP) &&
          !ehUltimaLinha(i, COLUNAS_DESKTOP, total);

        return (
          <div
            key={logo.arquivo}
            /* Canto reto: o DESIGN.md reserva o raio 1440px para botão, pill e
               tag. Placa é superfície editorial, e superfície editorial é reta. */
            className="relative flex items-center justify-center bg-bone px-4 py-10 md:px-6 md:py-14"
          >
            {/* Altura e largura limitadas juntas: as proporções vão de 7,06:1 a
                0,84:1, então nas marcas largas quem trava é a largura e nas
                compactas é a altura. Com width e height em auto, um max-*
                encolhe a imagem inteira mantendo a proporção — não recorta.
                O min() com 100% impede o estouro nas larguras em que a placa
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
              /* Centrado no cruzamento das juntas: meia junta para fora da
                 placa em cada eixo, depois metade do próprio corpo de volta. */
              <PlusIcon
                aria-hidden
                strokeWidth={1}
                className={cn(
                  "pointer-events-none absolute left-[calc(100%+6px)] top-[calc(100%+6px)] z-10 size-3 -translate-x-1/2 -translate-y-1/2 text-ash md:left-[calc(100%+10px)] md:top-[calc(100%+10px)] md:size-4",
                  maisMob ? "block" : "hidden",
                  maisDesk ? "md:block" : "md:hidden",
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
