"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { obrasPaineis, obrasScroll, type ObraPainel } from "@/lib/dados";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * BLOCO 3 — Obras em scroll horizontal
 *
 * Geometria copiada do Creative Giants. Cada painel é um grid de 12 colunas e
 * as três camadas se SOBREPÕEM de propósito na coluna 5: o título ocupa 2→6 e
 * a foto 5→9. É essa invasão, somada ao mix-blend-mode difference, que faz o
 * título atravessar a foto e continuar legível na parte clara e na escura.
 * Não "corrigir" alinhando as áreas.
 *
 * Os painéis também se sobrepõem entre si na horizontal: cada um tem largura
 * de 100% e margem esquerda negativa de 20%, o primeiro com +12%. O curso
 * total não é 300vw — é medido em tempo de execução, porque depende dessas
 * margens e da largura da janela.
 *
 * Abaixo de 768px o horizontal é desligado, os painéis empilham e o blend sai
 * junto: sem foto atrás, difference só apagaria o título.
 */

/* Deslocamento de cada camada ao longo da travessia do painel, em porcentagem
   da própria largura. Aplicado SIMÉTRICO (metade para cada lado do centro),
   e não de 0 até o valor: no meio da travessia, que é onde o painel é lido,
   as três camadas voltam a cair exatamente na posição do grid. Fosse de 0 a
   -20%, a composição já chegaria torta ao centro. */
const DESLOCAMENTO = { esquerda: 20, meio: 50, direita: 80 } as const;

/* A mola que faz as vezes do scrub: 3 do GSAP. Sobreamortecida de propósito
   — o amortecimento crítico aqui seria 2*raiz(20) ≈ 8,9 e usamos 30, então a
   camada nunca passa do ponto, só demora a chegar. A constante de tempo é
   amortecimento/rigidez ≈ 1,5 s: parou de rolar, as camadas ainda escorregam
   por mais um segundo e meio até assentar. É esse atraso, e não a amplitude,
   que faz a foto parecer perseguir a manchete.

   A mola entra no PROGRESSO do painel, uma por painel, e não no x de cada
   camada. Assim as três atrasam a mesma fração e o escorregamento entre elas
   cresce proporcional à amplitude — a foto atrasa duas vezes e meia mais que
   o título, que é a leitura que se quer. Três molas independentes dariam
   fases diferentes e a composição chegaria torta ao centro. */
const MOLA = { stiffness: 20, damping: 30, mass: 1, restDelta: 0.0005 } as const;

export function ObrasHorizontal() {
  const secao = useRef<HTMLElement>(null);
  const trilha = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: secao });
  const ehDesktop = useMediaQuery("(min-width: 768px)");
  /* Null no primeiro render e no servidor; só depois vira true/false. Tratado
     como "não reduzir" enquanto for null, que é o caso da maioria. */
  const reduzirMovimento = useReducedMotion();
  /* O scroll horizontal em si continua: ele É a navegação da seção, e desligá-lo
     deixaria dois painéis inalcançáveis. O que sai com prefers-reduced-motion é
     só o paralaxe interno, que é enfeite. */
  const anima = ehDesktop && !reduzirMovimento;

  /* Curso horizontal em pixels. Medido, não calculado: as margens negativas
     dos painéis fazem o total não bater com nenhuma conta de 100vw por
     painel. */
  const [curso, setCurso] = useState(0);
  const [ativo, setAtivo] = useState(0);

  const medir = useCallback(() => {
    const elemento = trilha.current;
    if (!elemento) return;
    const paineis = elemento.querySelectorAll("[data-obra-painel]");
    const ultimo = paineis[paineis.length - 1];
    if (!ultimo) return;
    /* offsetLeft/offsetWidth não sofrem com o transform em curso, ao
       contrário de getBoundingClientRect. */
    const extensao =
      (ultimo as HTMLElement).offsetLeft + (ultimo as HTMLElement).offsetWidth;
    setCurso(Math.max(0, extensao - elemento.clientWidth));
  }, []);

  /* Quem mede é o ResizeObserver, que dispara uma vez logo ao observar. Medir
     no corpo do efeito daria o mesmo resultado, mas com um setState síncrono
     que encadeia render — e o lint reprova, com razão. No mobile o observer
     nem sobe: o x não é aplicado ali, então o curso fica sem uso. */
  useEffect(() => {
    const elemento = trilha.current;
    if (!(ehDesktop && elemento)) return;

    const observador = new ResizeObserver(medir);
    observador.observe(elemento);
    window.addEventListener("resize", medir);
    return () => {
      observador.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, [ehDesktop, medir]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -curso]);
  const larguraBarra = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  /* O contador troca quando o centro do painel cruza o meio da tela. */
  useMotionValueEvent(x, "change", (valor) => {
    const elemento = trilha.current;
    if (!elemento) return;
    const meioDaTela = window.innerWidth / 2;
    let melhor = 0;
    let menorDistancia = Number.POSITIVE_INFINITY;
    elemento.querySelectorAll("[data-obra-painel]").forEach((painel, indice) => {
      const alvo = painel as HTMLElement;
      const centro = alvo.offsetLeft + alvo.offsetWidth / 2 + valor;
      const distancia = Math.abs(centro - meioDaTela);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        melhor = indice;
      }
    });
    setAtivo(melhor);
  });

  return (
    <section
      ref={secao}
      id="obras-em-destaque"
      /* Ink chapado. A transição do dourado termina ANTES desta borda, dentro
         do arco que cobre as marcas e o "O que fazemos" — ver app/page.tsx. Se a
         rampa invadisse esta seção, o começo dela viraria uma faixa dourada e a
         emenda voltaria a desenhar um risco.

         200vh, e não 300vh: a altura aqui é só quanta ROLAGEM a travessia
         consome — não a geometria. O x vai de 0 a -curso e o curso é MEDIDO
         do offsetLeft+offsetWidth do último painel, então encurtar a seção
         faz o mesmo curso ser percorrido em menos rolagem: os painéis
         continuam idênticos, só passam mais rápido. Medido a 1440px depois
         da troca, o último painel ainda chega a left: 0 no fim da seção,
         que é como o curso foi calibrado. */
      className="relative bg-ink min-[768px]:h-[200vh]"
    >
      {/* relative z-10 mantem o conteudo ACIMA do pseudo-elemento do grao. Sem
          isso, no mobile — onde este div nao e sticky e portanto nao e
          posicionado — o ruido pintaria por cima das fotos das obras, que o
          AGENTS.md proibe. */}
      <div className="relative z-10 min-[768px]:sticky min-[768px]:top-0 min-[768px]:h-screen min-[768px]:overflow-hidden">
        {/* O typo "compnent" é do CSS original; mantido para o dia em que
            alguém comparar os dois lado a lado. */}
        <motion.div
          ref={trilha}
          style={ehDesktop ? { x } : undefined}
          className="projects-scroll_compnent flex flex-col min-[768px]:relative min-[768px]:h-screen min-[768px]:flex-row min-[768px]:items-stretch min-[768px]:py-28 min-[768px]:[margin:-1vh_auto]"
        >
          {obrasPaineis.map((obra, indice) => (
            <Painel
              key={obra.rotulo}
              obra={obra}
              indice={indice}
              x={x}
              anima={anima}
            />
          ))}
        </motion.div>

        <ProgressoObras
          largura={larguraBarra}
          atual={ativo + 1}
          total={obrasPaineis.length}
        />
      </div>
    </section>
  );
}

/* ── Painel ───────────────────────────────────────────────────────────── */

function Painel({
  obra,
  indice,
  x,
  anima,
}: {
  obra: ObraPainel;
  indice: number;
  x: MotionValue<number>;
  /* Falso no mobile, onde o painel não anda na horizontal, e falso com
     prefers-reduced-motion. Nos dois casos nenhuma camada recebe transform. */
  anima: boolean;
}) {
  const painel = useRef<HTMLElement>(null);

  /* Progresso do próprio painel: 0 quando a borda esquerda toca a direita da
     tela, 1 quando a borda direita sai pela esquerda. Derivado do x da trilha
     e das medidas reais do painel, para não depender de fatiar o progresso
     global em três partes iguais — o primeiro painel tem margem de +12% e as
     partes não são iguais. */
  const progresso = useTransform(x, (valor) => {
    const alvo = painel.current;
    if (!alvo || !anima) return 0.5;
    const largura = window.innerWidth;
    const entra = largura - alvo.offsetLeft;
    const sai = -(alvo.offsetLeft + alvo.offsetWidth);
    if (entra === sai) return 0.5;
    const bruto = (valor - entra) / (sai - entra);
    return Math.min(1, Math.max(0, bruto));
  });

  /* O progresso amortecido, não o cru: é daqui que sai o atraso das camadas.
     Ver o comentário da MOLA. */
  const progressoSuave = useSpring(progresso, MOLA);

  const xEsquerda = useCamada(progressoSuave, DESLOCAMENTO.esquerda);
  const xMeio = useCamada(progressoSuave, DESLOCAMENTO.meio);
  const xDireita = useCamada(progressoSuave, DESLOCAMENTO.direita);

  const primeiro = indice === 0;

  return (
    <article
      ref={painel}
      /* Nome próprio, e não o data-painel genérico: o menu-hero já usa esse
         atributo nos dois painéis do overlay dele, e um seletor global
         pegaria os dois conjuntos. */
      data-obra-painel
      className={[
        "flex flex-col gap-8 px-gutter-sm pb-16 pt-16",
        /* .projects-scroll_content — 12 colunas, gap .75rem, e as margens
           que fazem os painéis se sobreporem. */
        "min-[768px]:grid min-[768px]:w-full min-[768px]:flex-none min-[768px]:grid-cols-12 min-[768px]:gap-3 min-[768px]:px-8 min-[768px]:pb-28 min-[768px]:pt-0",
        primeiro ? "min-[768px]:ml-[12%]" : "min-[768px]:ml-[-20%]",
      ].join(" ")}
    >
      {/* ── ESQUERDA: eyebrow + título ────────────────────────────────── */}
      <motion.div
        style={anima ? { x: xEsquerda } : undefined}
        className="header-wrap flex flex-col gap-6 min-[768px]:relative min-[768px]:z-[3] min-[768px]:[grid-area:1/2/2/6] min-[768px]:[pointer-events:none] min-[768px]:[mix-blend-mode:difference]"
      >
        <p className="flex items-center gap-[.38rem] text-eyebrow uppercase text-bone">
          <span
            aria-hidden
            className="inline-block size-[.31rem] shrink-0 rounded-pill bg-bone"
          />
          {obra.rotulo}
        </p>

        <h2 className="text-obra-sm text-bone min-[768px]:text-obra-md min-[992px]:text-obra-lg">
          {obra.titulo}
        </h2>
      </motion.div>

      {/* ── MEIO: a foto, quadrada ────────────────────────────────────── */}
      <motion.div
        style={anima ? { x: xMeio } : undefined}
        /* Sem overflow-hidden aqui. O clipe nao recortava nada — o object-cover
           da <img> ja resolve dentro da propria caixa — e custava caro: clipe
           numa camada que a mola continua transformando por ~1,5 s depois que
           a rolagem para faz o compositor errar a regiao suja, e sobravam
           lascas da foto a esquerda dela na rolagem reversa. Medido a 1440px:
           810 pixels fantasma com o clipe, zero sem ele. */
        className="flex flex-col items-center min-[768px]:relative min-[768px]:[grid-area:1/5/2/9]"
      >
        {/* ⚠ ERA UM <a href="#obras">, E O DESTINO NÃO EXISTIA. Não há id="obras"
            em lugar nenhum do site e não há página de listagem de obras: as
            três fotos cobravam o toque e não levavam a lugar nenhum. Viraram
            imagem — sem cursor de ponteiro, sem parada de Tab e sem rótulo
            prometendo "Ver obra".

            A descrição da obra continua inteira ao lado, e é ela que informa;
            a foto ilustra. Quando existir página por obra, o <a> volta COM o
            destino, e aí ele também ganha anel de foco.

            aspect-square NO INVÓLUCRO, não só na <img>: com h-full a moldura
            herdava a altura da linha do grid (444x566 medidos) e o
            object-cover recortava a foto. Quem manda na altura é a largura da
            coluna, e o teto de 52rem só entra em telas muito largas. */}
        <div className="projects-scroll_link-wrap relative block aspect-square max-h-[52rem] w-full">
          <Image
            src={obra.imagem}
            alt={obra.imagemAlt}
            width={828}
            height={828}
            sizes="(min-width: 768px) 34vw, 100vw"
            className="aspect-square size-full object-cover"
          />
        </div>
      </motion.div>

      {/* ── DIREITA: tags e descrição ─────────────────────────────────── */}
      <motion.div
        style={anima ? { x: xDireita } : undefined}
        /* ══ A COLUNA DA DIREITA DEIXOU DE SER UMA FITA ══

           Media na POSIÇÃO DE LEITURA de cada painel (painel alinhado à
           viewport, não em trânsito), com as caixas de linha reais:

             largura   antes                       depois
             768px     ~12 caracteres, 11 linhas   ~54, 2 linhas
             992px     ~18 caracteres,  6 linhas   ~54, 2 linhas
             1280px    ~24 caracteres,  4 linhas   ~43, 2 linhas
             1440px    ~27 caracteres,  4 linhas   ~47, 2 linhas
             1920px    ~45 caracteres,  3 linhas   ~54, 2 linhas

           Ela ocupava TRÊS colunas de doze (grid-area 1/9/2/12) e ainda
           descontava 64px de `pl-16`. Sobravam 99px de texto a 768px — um
           parágrafo de 18px caindo em onze linhas de uma palavra.

           ⚠ O PAR É `max-[1280px]` COM `min-[1280px]`, O MESMO NÚMERO NOS DOIS.
           No Tailwind v4 o `max-*` é EXCLUSIVO — `max-[1279px]` vira
           `width < 1279` e deixa a largura 1279 sem regra nenhuma. Medido: a
           1279px o bloco caía em `grid-area: auto` e o texto voltava a 90px de
           largura, em doze linhas. É o mesmo furo que o `max-[767px]` já custou
           uma rodada neste projeto.

           ⚠ DE 768 A 1279px ELA DESCE PARA A SEGUNDA LINHA DO GRID, e não é
           capricho: abaixo disso as três colunas do desenho (título, foto,
           texto) não cabem lado a lado. A conta é fechada — com quatro colunas
           de doze e 32px de recuo, o texto mede `(largura − 196) / 3 + 4`, e
           isso só passa de 380px (os ~45 caracteres) a partir de 1330px. Embaixo,
           o texto usa a largura inteira do painel e para no `max-w-[50ch]`.

           ⚠ DE 1280px PARA CIMA ELA CONTINUA NA PRIMEIRA LINHA, ao lado da
           foto — é o desenho editorial da seção, e ele só se sustenta com
           largura. Ganhou a coluna 12, que estava vazia, e o recuo caiu de 64
           para 32px. A 1280px dá 43 caracteres: dois caracteres abaixo da faixa
           confortável, e aceito porque estes parágrafos têm cerca de cem
           caracteres no total — em duas linhas, não é medida de leitura longa.

           O `max-w-[50ch]` do parágrafo continua sendo o teto em todas elas: a
           coluna dá espaço, a medida de linha é que decide onde parar. */
        className={[
          "flex flex-col items-start gap-6",
          /* `justify-end` só a partir de 1280: na linha 2 ele empurraria o
             bloco para o fundo de uma linha esticada até a altura da tela,
             abrindo um vão de 300px entre a foto e as tags. Lado a lado com a
             foto, ele continua sendo o que alinha a base das três colunas. */
          "min-[1280px]:justify-end",
          "min-[768px]:max-[1280px]:[grid-area:2/2/3/13] min-[768px]:max-[1280px]:pt-12",
          "min-[1280px]:pl-8 min-[1280px]:[grid-area:1/9/2/13]",
        ].join(" ")}
      >
        {/* Tags empilhadas e sublinhadas, não pills com borda: é o
            .tag.is-text do original. */}
        <ul className="flex flex-col items-start justify-start gap-3">
          {obra.tags.map((tag) => (
            <li
              key={tag}
              className="inline-block text-body-sm text-bone underline underline-offset-4"
            >
              {tag}
            </li>
          ))}
        </ul>

        <p className="max-w-[50ch] text-body-lg text-ash">{obra.descricao}</p>
      </motion.div>
    </article>
  );
}

/* Converte o progresso do painel no deslocamento simétrico da camada. */
function useCamada(progresso: MotionValue<number>, total: number) {
  return useTransform(progresso, [0, 1], [`${total / 2}%`, `${-total / 2}%`], {
    clamp: true,
  });
}

/* ── Trilho de progresso e paginação ──────────────────────────────────── */

function ProgressoObras({
  largura,
  atual,
  total,
}: {
  largura: MotionValue<string>;
  atual: number;
  total: number;
}) {
  return (
    <div className="hidden w-screen grid-cols-12 gap-3 px-8 pb-8 min-[992px]:grid min-[992px]:-mt-24">
      <div className="[grid-area:1/2/2/12]">
        <div className="flex flex-col gap-4">
          <div className="h-[.06rem] w-full bg-ash">
            <motion.div style={{ width: largura }} className="h-[.06rem] bg-bone" />
          </div>

          {/* ⚠ AQUI HAVIA O LINK "Ver todas as obras", E ELE SAIU. O href era
              "#obras" e esse id não existe em lugar nenhum do site: o link
              mudava a URL e deixava a página parada. Não há página de listagem
              de obras para apontar, e um link que promete uma lista e não
              entrega nada é pior do que a ausência dele.

              Sobra o contador, sozinho na linha. Ele não vira `justify-between`
              com um filho só — ficaria colado à esquerda do trilho de qualquer
              jeito, que é onde ele já estava. */}
          <p className="text-body-sm text-bone">{obrasScroll.contador(atual, total)}</p>
        </div>
      </div>
    </div>
  );
}
