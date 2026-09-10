import { Building2, Clock, Ruler, type LucideIcon } from "lucide-react";

import { TextoEmLinhas } from "@/components/ui/texto-em-linhas";
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
 *
 * ══ A SEÇÃO É ESCURA, E TODA A COR DE TEXTO DEPENDE DISSO ══
 *
 * ⚠ O FUNDO NÃO É MAIS DESTA SEÇÃO. Ele subiu para um invólucro em
 * app/page.tsx que cobre TAMBÉM o carrossel de marcas, para que as duas leiam
 * como um campo escuro só. São duas camadas: o bloom diagonal a 170deg, que
 * sai do ink, passa por #16130E aos 30% e #372F20 aos 55% e chega ao dourado
 * #6B6144 no fim; e, POR CIMA, um fecho VERTICAL que escurece para o ink nos
 * últimos 110px. As porcentagens são do invólucro inteiro, não desta seção.
 *
 * O fecho é vertical e separado de propósito: quando o retorno ao preto morava
 * dentro do gradiente de 170deg, ele chegava na diagonal e a emenda com a seção
 * de obras virava uma cunha. Os 110px são ancorados na borda de baixo para o
 * fecho cair sempre logo abaixo da linha de números.
 *
 * Com ele atrás, a paleta de texto do canvas creme ficaria ilegível, então a
 * seção inverteu inteira:
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
 * ⚠ O eyebrow CONTINUA em gold, e só funciona porque está no topo. Remedido
 * com o fundo em arco: 5,69 a 6,05:1 nas cinco larguras, contra os 4,5:1
 * exigidos. Não desça o eyebrow, e se mexer nas paradas do gradiente, meça
 * este primeiro: é o texto mais frágil da página.
 *
 * ⚠ SE O FUNDO SAIR, ISTO TUDO VOLTA. O gold do eyebrow é o caso mais rígido:
 * o AGENTS.md só o permite sobre fundo escuro, e sobre o creme ele reprova.
 * Não deixe a seção clarear com a paleta invertida no lugar.
 *
 * O piso ink saiu do <section> junto com o fundo: quem garante que o texto bone
 * nunca cai sobre o creme do <body> agora é o invólucro, que pinta ink por trás
 * das duas seções.
 *
 * ══ A REVELAÇÃO EM LINHAS, E POR QUE ELA NÃO MEXE NO GRADIENTE ══
 *
 * Manchete, parágrafo e números sobem linha a linha ao entrar na tela. São TRÊS
 * grupos, e não um: um gatilho único no topo da seção revelaria os números
 * enquanto eles ainda estão duas telas abaixo, e o leitor chegaria neles já
 * prontos. O eyebrow FICA DE FORA — é um <p> em flex, com o ponto dourado como
 * item irmão do texto, e trocar o conteúdo dele por linhas em bloco
 * transformaria as linhas em itens do próprio flex.
 *
 * ⚠ O SplitType reescreve o DOM do texto, e a altura desta seção é o que decide
 * onde as paradas do gradiente do invólucro caem. As máscaras foram construídas
 * para devolver a altura exata (ver o bloco da folga em texto-em-linhas.tsx), e
 * isso foi MEDIDO: as alturas de #sobre e do invólucro ficaram idênticas nas
 * seis larguras, e o eyebrow dourado seguiu entre 5,49 e 6,27:1, o mesmo
 * intervalo de antes do split. Quem mexer na folga refaz essa medição.
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
      className="relative px-gutter max-[479px]:px-gutter-sm"
    >
      {/* O gradiente cobre a seção inteira e fica ABAIXO do conteúdo. O
          `isolate` no <section> prende o empilhamento aqui dentro, para o
          z-index não disputar com o resto da página. */}

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
            <TextoEmLinhas>
              <h2
                data-revelar
                className="mt-12 text-statement-lg text-bone max-[991px]:text-statement-md max-[767px]:text-statement-sm"
              >
                {oQueFazemos.manchete}
              </h2>
            </TextoEmLinhas>
          </div>

          {/* Linha 2, colunas 2–4: o recuo de uma coluna é intencional. */}
          <div className="col-start-2 col-end-5 row-start-2 row-end-3 flex flex-col gap-16 max-[991px]:gap-10">
            <TextoEmLinhas>
              <p
                data-revelar
                className="text-body-lg text-bone max-[767px]:text-body"
              >
                {oQueFazemos.paragrafo}
              </p>
            </TextoEmLinhas>

            <TextoEmLinhas>
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
                        <p
                          data-revelar
                          className="font-display text-numeral-lg text-bone max-[991px]:text-numeral-md max-[767px]:text-numeral-sm"
                        >
                          {numero.valor}
                        </p>
                      </div>
                      <p data-revelar className="text-body text-bone">
                        {numero.descricao}
                      </p>
                    </div>
                  );
                })}
              </div>
            </TextoEmLinhas>
          </div>
        </div>
      </div>
    </section>
  );
}
