import Image from "next/image";

import type { LogoCliente } from "@/lib/logos";

/**
 * Logo Cloud — grid de logos com régua entre as células.
 *
 * NÃO é carrossel: é um grid de 2 colunas no mobile e 4 no desktop, com
 * hairline ash entre as células e um ícone de mais em cada cruzamento
 * interno. Com oito logos ele fecha em quatro linhas exatas no mobile e duas
 * no desktop — nenhuma célula vazia em nenhuma das duas larguras.
 *
 * Traduzido do componente de origem, que era do sistema do shadcn: o
 * bg-secondary/bg-background virou bone com célula alternada em ash a 20%, e
 * saíram todos os `dark:` e o `brightness-0 invert`. O invert existia para
 * forçar logos coloridas a virar silhueta; aqui as logos já chegam em ink,
 * então filtro nenhum — ver o comentário de lib/logos.ts.
 */

const COLUNAS_MOBILE = 2;
const COLUNAS_DESKTOP = 4;

/* Xadrez: sombreia quando linha + coluna é par. Com oito células o padrão
   fecha equilibrado nas duas grades — 4 sombreadas de 8 em ambas, e nenhuma
   linha termina pela metade. (Com nove ele desandaria: 5 e 4.) */
const ehXadrez = (indice: number, colunas: number) =>
  (Math.floor(indice / colunas) + (indice % colunas)) % 2 === 0;

const ehUltimaColuna = (indice: number, colunas: number) =>
  indice % colunas === colunas - 1;

const ehUltimaLinha = (indice: number, colunas: number, total: number) =>
  Math.floor(indice / colunas) === Math.floor((total - 1) / colunas);

/* O mais dos cruzamentos. strokeWidth 1 e cor herdada, como as setas do
   Section Title Block. */
function IconeMais({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      className={className}
    >
      <path d="M8 2.5v11M2.5 8h11" />
    </svg>
  );
}

export function LogoCloud({ logos }: { logos: LogoCliente[] }) {
  return (
    <ul data-logo-cloud className="grid grid-cols-2 min-[768px]:grid-cols-4">
      {logos.map((logo, indice) => {
        const total = logos.length;

        const ultimaColunaMob = ehUltimaColuna(indice, COLUNAS_MOBILE);
        const ultimaLinhaMob = ehUltimaLinha(indice, COLUNAS_MOBILE, total);
        const ultimaColunaDesk = ehUltimaColuna(indice, COLUNAS_DESKTOP);
        const ultimaLinhaDesk = ehUltimaLinha(indice, COLUNAS_DESKTOP, total);

        /* Só cruzamento interno ganha o mais: quem está na última coluna ou na
           última linha não tem cruzamento à frente. Dá três em cada largura. */
        const maisMob = !ultimaColunaMob && !ultimaLinhaMob;
        const maisDesk = !ultimaColunaDesk && !ultimaLinhaDesk;

        /* As classes precisam existir inteiras no código-fonte, senão o
           scanner do Tailwind não as vê e elas não entram no CSS. Por isso os
           dois ramos de cada ternário são literais completos, com o prefixo
           do breakpoint escrito por extenso. */
        const classes = [
          /* min-h fixa a linha antes de a logo carregar. Com width e height em
             auto a imagem mede 0x0 enquanto não chega, e sem isto a grade
             saltava de altura quando as oito entravam. */
          "relative flex min-h-[6.5rem] items-center justify-center px-4 py-10 min-[768px]:min-h-[8.5rem] min-[768px]:px-8 min-[768px]:py-14",
          "border-ash",
          ultimaColunaMob ? "" : "border-r",
          ultimaLinhaMob ? "" : "border-b",
          ultimaColunaDesk ? "min-[768px]:border-r-0" : "min-[768px]:border-r",
          ultimaLinhaDesk ? "min-[768px]:border-b-0" : "min-[768px]:border-b",
          ehXadrez(indice, COLUNAS_MOBILE) ? "bg-ash/20" : "bg-transparent",
          ehXadrez(indice, COLUNAS_DESKTOP)
            ? "min-[768px]:bg-ash/20"
            : "min-[768px]:bg-transparent",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <li key={logo.arquivo} className={classes}>
            {/* Altura e largura ambas limitadas: as proporções vão de 6,7:1 a
                0,83:1, então nas marcas largas quem trava é a largura e nas
                compactas é a altura. Sem os dois tetos a Artwalk sozinha
                ocuparia a célula inteira.

                Com width e height em auto, um max-* encolhe a imagem inteira
                mantendo a proporção — não recorta. O min() no teto de largura
                é o que impede o estouro entre 768 e 992px, onde a célula tem
                112px de caixa útil e o teto nominal é 150px. */}
            <Image
              src={logo.arquivo}
              alt={logo.nome}
              width={logo.largura}
              height={logo.altura}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="h-auto w-auto max-h-10 max-w-[min(6.5rem,100%)] object-contain min-[768px]:max-h-12 min-[768px]:max-w-[min(9.375rem,100%)]"
            />

            {maisMob || maisDesk ? (
              <IconeMais
                className={[
                  /* Centrado no cruzamento: canto inferior direito da célula,
                     puxado metade para cada lado. */
                  /* z-10 porque as células seguintes pintam depois no DOM e o
                     fundo do xadrez cobriria o mais que invade a vizinha. */
                  "pointer-events-none absolute -bottom-2 -right-2 z-10 size-4 text-ash",
                  maisMob ? "block" : "hidden",
                  maisDesk ? "min-[768px]:block" : "min-[768px]:hidden",
                ].join(" ")}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
