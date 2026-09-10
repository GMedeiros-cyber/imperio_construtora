import { Building2, Clock, Ruler, type LucideIcon } from "lucide-react";

import { oQueFazemos } from "@/lib/dados";
import { FundoGradiente } from "@/components/ui/background-rowds-shop-v1";

/**
 * BLOCO 2 — O que fazemos
 *
 * Escalonado em duas linhas de um grid de 6 colunas, como no Creative Giants:
 * a manchete ocupa as colunas 1 a 4 da primeira linha e o bloco de informações
 * entra recuado, da coluna 2 à 4 da segunda. As colunas 5 e 6 ficam vazias de
 * propósito — o vazio à direita é o que dá o escalonamento. Não preencher.
 *
 * Abaixo de 767px o grid vira pilha simples e as colocações caem sozinhas.
 *
 * ══ A SEÇÃO É ESCURA, E TODA A COR DE TEXTO DEPENDE DISSO ══
 *
 * O fundo é o gradiente de components/ui/background-rowds-shop-v1.tsx, que vai
 * de #16130E a #372F20 e termina em #6B6144. Com ele atrás, a paleta de texto
 * do canvas creme ficaria ilegível, então a seção inverteu inteira:
 *
 *   manchete   ink      -> bone
 *   parágrafo  graphite -> bone
 *   eyebrow    graphite -> gold      (permitido: agora está sobre escuro)
 *   números    ink      -> bone
 *   descrições graphite -> bone
 *   ícones     ink      -> bone
 *
 * ══ O ash NÃO ENTRA AQUI, E ISSO FOI MEDIDO ══
 *
 * O plano original punha parágrafo e descrições em ash. Reprovou: sobre a parte
 * clara do gradiente as descrições mediram de 1,99 a 2,58:1 nas cinco larguras,
 * contra 4,5:1 exigidos. O ash só aguenta até 41% da altura da seção, e as
 * descrições vivem entre 83% e 93% — nenhum fim de gradiente aceitável salvava,
 * porque para o ash passar lá embaixo o gradiente teria de terminar em #5C533A,
 * que mata o dourado que motivou usar gradiente.
 *
 * A saída foram duas mudanças juntas: o gradiente passou a terminar em #6B6144
 * (ver o componente do fundo) e o texto miúdo virou bone.
 *
 * ⚠ O PREÇO: parágrafo e descrições ficam na MESMA cor da manchete e dos
 * números. A hierarquia desta seção passa a vir só do TAMANHO. É por isso que o
 * contraste de corpo entre número (3.375rem) e descrição (1rem) não pode
 * encolher — sem ele a seção vira um bloco de texto de um tom só.
 *
 * ⚠ O eyebrow CONTINUA em gold, e só funciona porque está no topo: ele mede
 * 5,85 a 6,06:1 sobre o #16130E, e o gold só aguenta até 14% da altura da
 * seção. Não desça o eyebrow.
 *
 * ⚠ SE O FUNDO SAIR, ISTO TUDO VOLTA. O gold do eyebrow é o caso mais rígido:
 * o AGENTS.md só o permite sobre fundo escuro, e sobre o creme ele reprova.
 * Não deixe a seção clarear com a paleta invertida no lugar.
 *
 * O `bg-ink` no <section> é piso, não decoração: enquanto o gradiente não
 * pinta, o que aparece atrás do texto bone é ink e não o bone do <body>.
 */

/* Um ícone por número, na ordem de `oQueFazemos.numeros`. Fica aqui, e não em
   dados.ts, porque é decisão de desenho e não conteúdo. */
const ICONES: LucideIcon[] = [Building2, Ruler, Clock];

/* 3rem. Traço 1 para o ícone pesar como a manchete, não como um botão. */
const TAMANHO_ICONE = 48;
const TRACO_ICONE = 1;

export function OQueFazemos() {
  return (
    <section
      id="sobre"
      className="relative isolate bg-ink px-gutter max-[479px]:px-gutter-sm"
    >
      {/* O gradiente cobre a seção inteira e fica ABAIXO do conteúdo. O
          `isolate` no <section> prende o empilhamento aqui dentro, para o
          z-index não disputar com o resto da página. */}
      <FundoGradiente className="absolute inset-0 -z-10" />

      {/* 120rem = 1920px, o teto do CSS de origem. Acima disso a seção para de
          crescer e centraliza; até 1920 o comportamento é full-bleed. */}
      <div className="mx-auto w-full max-w-[120rem] py-28 max-[991px]:py-24 max-[767px]:py-16">
        <div className="grid grid-cols-6 gap-16 max-[991px]:gap-10 max-[767px]:flex max-[767px]:flex-col">
          {/* Linha 1, colunas 1–4 */}
          <div className="col-start-1 col-end-5 row-start-1 row-end-2">
            <p className="flex items-center gap-[0.38rem] overflow-hidden whitespace-nowrap text-eyebrow uppercase text-gold">
              <span
                aria-hidden
                className="aspect-square size-[0.31rem] shrink-0 rounded-pill bg-gold"
              />
              {oQueFazemos.eyebrow}
            </p>
            <h2 className="mt-12 text-statement-lg text-bone max-[991px]:text-statement-md max-[767px]:text-statement-sm">
              {oQueFazemos.manchete}
            </h2>
          </div>

          {/* Linha 2, colunas 2–4: o recuo de uma coluna é intencional. */}
          <div className="col-start-2 col-end-5 row-start-2 row-end-3 flex flex-col gap-16 max-[991px]:gap-10">
            <p className="text-body-lg text-bone max-[767px]:text-body">
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
                        className="shrink-0 text-bone"
                      />
                      <p className="font-display text-numeral-lg text-bone max-[991px]:text-numeral-md max-[767px]:text-numeral-sm">
                        {numero.valor}
                      </p>
                    </div>
                    <p className="text-body text-bone">{numero.descricao}</p>
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
