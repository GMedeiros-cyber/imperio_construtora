"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useEffect, useRef, type ReactNode } from "react";

import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";

/**
 * REVELAÇÃO DE TEXTO EM LINHAS
 *
 * Quebra o texto dos descendentes marcados com `data-revelar` em LINHAS
 * (SplitType), embrulha cada linha numa máscara com `overflow: hidden` e sobe
 * as linhas de yPercent 100 para 0 quando o bloco entra na tela.
 *
 * ══ COMO SE USA ══
 *
 *   <TextoEmLinhas>
 *     <h2 data-revelar>…</h2>
 *     <p data-revelar>…</p>
 *   </TextoEmLinhas>
 *
 * O invólucro nasce com `display: contents` — ele NÃO cria caixa, então filhos
 * de grid ou de flex continuam sendo filhos diretos do grid ou do flex do pai.
 * Sem isso, envolver dois itens de um grid-cols-12 os colapsaria num item só.
 * Quem trocar o `className` assume esse custo.
 *
 * Um invólucro é UM grupo: todas as linhas de todos os `data-revelar` que ele
 * contém entram num tween só, em ordem de DOM, com `stagger: {amount}` — o
 * atraso total é fixo, então o escalonamento não estica com o número de linhas.
 * O gatilho é o PRIMEIRO alvo do grupo, e não o invólucro: `display: contents`
 * não tem retângulo, e o ScrollTrigger precisa de um.
 *
 * ══ ESPERAR A FONTE É OBRIGATÓRIO ══
 *
 * Zodiak e Switzer vêm da API do Fontshare. Se o split rodar antes de elas
 * chegarem, as quebras de linha são calculadas com as métricas da fonte de
 * emergência e ficam CONGELADAS erradas — o SplitType grava as linhas no DOM,
 * não as recalcula sozinho. Daí o `document.fonts.ready` antes de qualquer
 * medição.
 *
 * ══ RE-SPLIT SÓ QUANDO A LARGURA MUDA ══
 *
 * ⚠ No celular a barra de endereço aparece e some a cada rolagem, e cada
 * aparição dispara um `resize` de ALTURA. Re-splitar nisso destruiria e
 * recriaria o DOM do texto dezenas de vezes por rolagem. Por isso o listener
 * compara `innerWidth` com a largura da última montagem e ignora todo o resto.
 *
 * ══ A FOLGA DOS GLIFOS ══
 *
 * A escala de tipo da casa usa `line-height: 1` nas manchetes e nos numerais.
 * MEDIDO: a 64px a caixa de linha tem 64px, e o retângulo do Range sobre o
 * mesmo texto tem 79 — o glifo passa ~7,5px da borda DE CIMA e ~7,5px da DE
 * BAIXO. Um `overflow: hidden` cru cortaria acento em cima e perna de "g" em
 * baixo. Daí a folga ser dos dois lados, e não só embaixo.
 *
 * São quatro peças que só funcionam juntas:
 *   1. a LINHA ganha `padding: FOLGA 0`, então a área visível da máscara passa
 *      a ser altura + 2·folga e o glifo inteiro cabe;
 *   2. a MÁSCARA sobe `top: -FOLGA` por `position: relative` — deslocamento
 *      só visual, que devolve o texto à linha de base que ele tinha;
 *   3. a MÁSCARA ganha `margin-bottom: -2·FOLGA`, devolvendo à seção
 *      exatamente a altura que ela tinha antes do split;
 *   4. o yPercent 100 do GSAP é 100% da altura de BORDA da linha, que já
 *      inclui as duas folgas — a linha escondida some inteira, sem deixar
 *      fatia de glifo aparecendo na borda da máscara.
 *
 * ⚠ A margem negativa é só embaixo DE PROPÓSITO. Duas margens negativas
 * adjacentes (uma no rodapé de uma máscara, outra no topo da seguinte) não
 * somam: o CSS colapsa margens irmãs para a MAIS negativa das duas, e o
 * espaçamento entre linhas sairia errado. Com margem negativa só de um lado a
 * vizinha é zero, e o colapso devolve o valor cheio.
 *
 * O `display: flow-root` na raiz do split existe pelo passo 3: sem um contexto
 * de formatação de bloco, a margem negativa da última máscara colapsaria para
 * fora do <h2> e a altura da seção mudaria. Visualmente flow-root e block são
 * idênticos para estes elementos.
 *
 * ══ O TEXTO CONTINUA SENDO TEXTO ══
 *
 * O SplitType 0.3.4 não escreve `aria-hidden` em lugar nenhum — as linhas são
 * <span> de texto puro (com `types: "lines"` os invólucros de palavra são
 * desfeitos). A única perda seria o espaço que existia na quebra de linha
 * original: o SplitType só emenda espaço ENTRE palavras da mesma linha, então
 * `textContent` sairia com a última palavra de uma linha colada na primeira da
 * seguinte. O `linha.append(" ")` no fim de cada linha que não é a última
 * repõe esse espaço, e com ele o textContent e o leitor de tela voltam a
 * entregar a frase inteira. MEDIDO: `textContent` do h2 sai idêntico ao de
 * antes do split nas seis larguras, e a seleção do mouse atravessa as linhas.
 *
 * O preço aceito: como cada linha é uma caixa de BLOCO, o texto copiado sai com
 * quebra de linha onde a linha visual quebra, e não com espaço. Não dá para
 * evitar sem abrir mão da máscara por linha, que é o efeito inteiro.
 */

const DURACAO = 0.6;
const ESCALONAMENTO = 0.4;
const SUAVIZACAO = "power1.out";
const INICIO = "top 75%";

/* Em em, não em px: cada alvo tem seu corpo, e o glifo cresce com ele. Medido
   a 64px o transbordo é de 7,5px por lado, ou 0,117em; 0,14em cobre com sobra
   sem que a folga vire espaço visível. */
const FOLGA = "0.14em";
const FOLGA_DOBRO = "0.28em";

const CLASSE_LINHA = "revelacao-linha";
const CLASSE_MASCARA = "revelacao-mascara";

/* O split muda a altura das seções, e todo ScrollTrigger da página (paralaxe,
   scroll horizontal de obras) foi medido ANTES dele. Um refresh só, depois que
   o último grupo terminou de montar, corrige todos de uma vez — daí o
   delayedCall compartilhado, que se reagenda a cada nova montagem. */
let refreshPendente: gsap.core.Tween | null = null;

function agendarRefresh() {
  refreshPendente?.kill();
  refreshPendente = gsap.delayedCall(0.05, () => {
    refreshPendente = null;
    ScrollTrigger.refresh();
  });
}

export function TextoEmLinhas({
  children,
  className = "contents",
}: {
  children: ReactNode;
  className?: string;
}) {
  const raiz = useRef<HTMLDivElement>(null);
  const reduzido = useMovimentoReduzido();

  useEffect(() => {
    /* Com a preferência ativa não há split, não há máscara e não há gatilho: o
       texto fica exatamente como o servidor o entregou. */
    if (reduzido) return;

    const no = raiz.current;
    if (!no) return;

    gsap.registerPlugin(ScrollTrigger);

    let cancelado = false;
    let contexto: gsap.Context | undefined;
    let divisoes: SplitType[] = [];
    /* O SplitType.revert() só devolve o innerHTML: o display que escrevemos na
       raiz é nosso para desfazer. Sem isto o flow-root sobrevive ao desmonte —
       e ele acontece de verdade, porque o useMediaQuery começa em false e o
       leitor que pediu movimento reduzido chega a montar antes de desmontar. */
    const displayOriginal = new Map<HTMLElement, string>();
    let larguraMontada = window.innerWidth;
    let debounce: number | undefined;

    const desmontar = () => {
      /* Ordem: primeiro o contexto do GSAP, que devolve os estilos inline que o
         tween escreveu; só depois o SplitType, que reescreve o innerHTML
         inteiro e leva junto as máscaras criadas aqui. */
      contexto?.revert();
      contexto = undefined;
      divisoes.forEach((divisao) => divisao.revert());
      divisoes = [];
      displayOriginal.forEach((valor, alvo) => {
        alvo.style.display = valor;
      });
      displayOriginal.clear();
    };

    const montar = () => {
      /* Cinto e suspensório para o movimento reduzido: o hook começa em false
         no primeiro render do cliente, e o document.fonts.ready pode resolver
         antes de o React repassar a preferência. Aqui a fonte é a única que não
         mente. */
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const alvos = Array.from(
        no.querySelectorAll<HTMLElement>("[data-revelar]"),
      );
      if (alvos.length === 0) return;

      larguraMontada = window.innerWidth;

      divisoes = alvos.map((alvo) => {
        displayOriginal.set(alvo, alvo.style.display);
        alvo.style.display = "flow-root";

        const divisao = new SplitType(alvo, {
          types: "lines",
          /* span, e não o div padrão: os alvos incluem <p>, e <div> dentro de
             <p> é inválido. O SplitType já escreve display:block inline na
             linha, então o span se comporta igual. */
          tagName: "span",
          lineClass: CLASSE_LINHA,
        });

        const linhas = divisao.lines ?? [];

        linhas.forEach((linha, indice) => {
          /* Repõe o espaço que a quebra de linha original tinha. Espaço no fim
             de linha não é desenhado, então isto não muda nem um pixel. */
          if (indice < linhas.length - 1) linha.append(" ");

          linha.style.paddingTop = FOLGA;
          linha.style.paddingBottom = FOLGA;

          const mascara = document.createElement("span");
          mascara.className = CLASSE_MASCARA;
          mascara.style.display = "block";
          mascara.style.overflow = "hidden";
          mascara.style.position = "relative";
          mascara.style.top = "-" + FOLGA;
          mascara.style.marginBottom = "-" + FOLGA_DOBRO;

          linha.before(mascara);
          mascara.append(linha);
        });

        return divisao;
      });

      contexto = gsap.context(() => {
        gsap.from("." + CLASSE_LINHA, {
          yPercent: 100,
          duration: DURACAO,
          ease: SUAVIZACAO,
          stagger: { amount: ESCALONAMENTO },
          scrollTrigger: { trigger: alvos[0], start: INICIO },
        });
      }, no);

      agendarRefresh();
    };

    /* O split mede as quebras de linha; medir antes de a fonte chegar congela
       quebras erradas no DOM. */
    document.fonts.ready.then(() => {
      if (cancelado) return;
      montar();
    });

    const aoRedimensionar = () => {
      /* ⚠ SÓ LARGURA. A barra de endereço do celular dispara resize de altura a
         cada rolagem; re-splitar nisso destrói e recria o texto sem parar. */
      if (window.innerWidth === larguraMontada) return;
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        if (cancelado) return;
        desmontar();
        montar();
      }, 150);
    };

    window.addEventListener("resize", aoRedimensionar);

    return () => {
      cancelado = true;
      window.clearTimeout(debounce);
      window.removeEventListener("resize", aoRedimensionar);
      desmontar();
    };
  }, [reduzido]);

  return (
    <div ref={raiz} className={className}>
      {children}
    </div>
  );
}
