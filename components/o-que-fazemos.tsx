import { Building2, Clock, Ruler, type LucideIcon } from "lucide-react";

import { oQueFazemos } from "@/lib/dados";

/**
 * BLOCO 2 — O que fazemos
 *
 * Escalonado em duas linhas de um grid de 6 colunas, como no Creative Giants:
 * a manchete ocupa as colunas 1 a 4 da primeira linha e o bloco de informações
 * entra recuado, da coluna 2 à 4 da segunda. As colunas 5 e 6 ficam vazias de
 * propósito — o vazio à direita é o que dá o escalonamento. Não preencher.
 *
 * Abaixo de 767px o grid vira pilha simples e as colocações caem sozinhas.
 */

/* Um ícone por número, na ordem de `oQueFazemos.numeros`. Fica aqui, e não em
   dados.ts, porque é decisão de desenho e não conteúdo. */
const ICONES: LucideIcon[] = [Building2, Ruler, Clock];

/* 3rem. Traço 1 para o ícone pesar como a manchete, não como um botão. */
const TAMANHO_ICONE = 48;
const TRACO_ICONE = 1;

export function OQueFazemos() {
  return (
    <section id="sobre" className="bg-bone px-gutter max-[479px]:px-gutter-sm">
      {/* 120rem = 1920px, o teto do CSS de origem. Acima disso a seção para de
          crescer e centraliza; até 1920 o comportamento é full-bleed. */}
      <div className="mx-auto w-full max-w-[120rem] py-28 max-[991px]:py-24 max-[767px]:py-16">
        <div className="grid grid-cols-6 gap-16 max-[991px]:gap-10 max-[767px]:flex max-[767px]:flex-col">
          {/* Linha 1, colunas 1–4 */}
          <div className="col-start-1 col-end-5 row-start-1 row-end-2">
            <p className="flex items-center gap-[0.38rem] overflow-hidden whitespace-nowrap text-eyebrow uppercase text-ink">
              <span
                aria-hidden
                className="aspect-square size-[0.31rem] shrink-0 rounded-pill bg-ink"
              />
              {oQueFazemos.eyebrow}
            </p>
            <h2 className="mt-12 text-statement-lg text-ink max-[991px]:text-statement-md max-[767px]:text-statement-sm">
              {oQueFazemos.manchete}
            </h2>
          </div>

          {/* Linha 2, colunas 2–4: o recuo de uma coluna é intencional. */}
          <div className="col-start-2 col-end-5 row-start-2 row-end-3 flex flex-col gap-16 max-[991px]:gap-10">
            <p className="text-body-lg text-graphite max-[767px]:text-body">
              {oQueFazemos.paragrafo}
            </p>

            <div className="flex items-start justify-between gap-8 max-[767px]:flex-col">
              {oQueFazemos.numeros.map((numero, indice) => {
                const Icone = ICONES[indice];

                return (
                  <div
                    key={numero.valor}
                    className="flex max-w-[30ch] flex-col gap-6"
                  >
                    <div className="flex items-center gap-[0.63rem]">
                      <Icone
                        aria-hidden
                        size={TAMANHO_ICONE}
                        strokeWidth={TRACO_ICONE}
                        className="shrink-0 text-ink"
                      />
                      <p className="font-display text-numeral-lg text-ink max-[991px]:text-numeral-md max-[767px]:text-numeral-sm">
                        {numero.valor}
                      </p>
                    </div>
                    <p className="text-body text-graphite">
                      {numero.descricao}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
