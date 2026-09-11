"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";
import {
  PROPORCAO_ASSINATURA,
  SINAL_PRONTA,
} from "@/components/ui/assinatura-constantes";

/* ssr:false só é permitido em componente de cliente, daí este invólucro.
   O iframe carrega um documento HTML inteiro com Canvas 2D em
   requestAnimationFrame — é peso morto no fim da página e não pode entrar no
   HTML inicial.

   ⚠ NADA deste arquivo importa particle-wordmark.tsx estaticamente. A
   proporção e o nome do sinal vêm de assinatura-constantes.ts por isso: uma
   importação estática puxaria o módulo do motor (com o srcDoc inteiro) para
   o bundle inicial e o dynamic() abaixo não adiaria byte nenhum — foi assim
   que estava, medido no chunk referenciado pelo HTML da home. */
const ParticleWordmark = dynamic(
  () =>
    import("@/components/ui/particle-wordmark").then((m) => m.ParticleWordmark),
  { ssr: false },
);

/* ══ A ENTRADA É A REVELAÇÃO DA CASA, E NADA MAIS ══

   O wordmark NÃO tem formação: medido (ver particle-wordmark.tsx), a palavra
   sai inteira no primeiro quadro do canvas, e o que se move depois é uma
   nevasca de brilho por cima da palavra pronta — regime, não entrada. Então
   não há dois efeitos para empilhar: a entrada é UMA, e é a mesma das outras
   revelações da página (texto-em-linhas.tsx): uma máscara com overflow
   hidden e o conteúdo subindo de yPercent 100 para 0, 0,6s, power1.out, no
   gatilho "top 75%". Aqui a "linha" é o quadro inteiro do canvas.

   ⚠ Os três valores abaixo são CÓPIA dos de texto-em-linhas.tsx. O agente A
   JÁ os exportou de lá (DURACAO, ESCALONAMENTO, SUAVIZACAO, INICIO — commit
   ce76470 do branch hero-e-menu, que este branch ainda não tem): na primeira
   mudança depois do merge, troque esta cópia pelo import e embrulhe o INICIO
   em clamp(). Até lá: mudou lá, muda aqui.

   Por que não usar o próprio <TextoEmLinhas>: ele revela LINHAS DE TEXTO via
   SplitType, quebrando `textContent` em spans. Um iframe não tem linhas nem
   texto — o SplitType não acharia nada para revelar. */
const DURACAO = 0.6;
const SUAVIZACAO = "power1.out";
/* clamp(): a assinatura é a última coisa da página. Numa viewport baixa o
   topo do quadro pode nunca chegar aos 75% da altura antes de a rolagem
   acabar, e sem o clamp o gatilho não dispararia nunca — a palavra ficaria
   escondida na máscara para sempre. O clamp encosta o início no fim da
   rolagem quando o fim chega primeiro. */
const INICIO = "clamp(top 75%)";

/* Se o iframe não avisar que desenhou (script bloqueado, canvas sem
   contexto), a entrada roda assim mesmo depois desta espera — o quadro
   preto sobe vazio, mas nada fica preso. */
const ESPERA_MAXIMA_MS = 1500;

/** Palavra chapada: fallback de movimento reduzido e reserva de espaço. */
function PalavraChapada({ visivel }: { visivel: boolean }) {
  return (
    <p
      aria-hidden={visivel ? undefined : "true"}
      className="text-center font-display text-obra-sm tracking-[0.06em] text-gold min-[768px]:text-obra-md min-[992px]:text-obra-lg"
      style={visivel ? undefined : { visibility: "hidden" }}
    >
      IMPÉRIO
    </p>
  );
}

/**
 * A assinatura em partículas do fim do rodapé.
 *
 * Três caminhos, nesta ordem:
 *
 * 1. Movimento reduzido — o iframe NÃO é montado e não há entrada. Fica a
 *    palavra em Zodiak 300, gold cheio, que é o dourado do fundo escuro.
 * 2. Antes de a seção chegar perto — nada é montado, e a caixa fica
 *    reservada com a palavra invisível, para a altura não pular depois.
 * 3. Perto (200px antes) — entra o iframe, escondido abaixo da máscara. Ele
 *    carrega, desenha a palavra e avisa por postMessage. Quando o quadro
 *    cruza os 75% da altura da tela E o aviso já chegou, a palavra sobe.
 *    O IntersectionObserver de dentro do iframe cancela o rAF quando a seção
 *    sai da tela; o iframe em si já custa antes disso, por isso a montagem
 *    também é adiada aqui fora.
 */
export function AssinaturaParticulas() {
  const caixa = useRef<HTMLDivElement>(null);
  const lamina = useRef<HTMLDivElement>(null);
  const [emCena, setEmCena] = useState(false);
  const reduzido = useMovimentoReduzido();

  useEffect(() => {
    const alvo = caixa.current;
    if (!alvo || reduzido) return;
    /* Sem IntersectionObserver monta assim mesmo, mas no quadro seguinte:
       setState no corpo do efeito encadeia render, e o lint reprova. */
    if (typeof IntersectionObserver === "undefined") {
      const quadro = requestAnimationFrame(() => setEmCena(true));
      return () => cancelAnimationFrame(quadro);
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        /* Uma vez montado, fica: desmontar e remontar o iframe recompila o
           documento inteiro a cada rolagem de ida e volta. */
        setEmCena(true);
        observador.disconnect();
      },
      { rootMargin: "200px" },
    );
    observador.observe(alvo);
    return () => observador.disconnect();
  }, [reduzido]);

  /* A entrada. Só existe depois que o iframe foi montado. */
  useEffect(() => {
    const mascara = caixa.current;
    const folha = lamina.current;
    if (!emCena || reduzido || !mascara || !folha) return;
    /* Cinto e suspensório, como no texto-em-linhas: o hook começa em false no
       primeiro render do cliente. Aqui a fonte é a única que não mente. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    let chegou = false;
    let pronta = false;
    let subiu = false;
    let espera: number | undefined;

    const contexto = gsap.context(() => {
      gsap.set(folha, { yPercent: 100 });

      const subir = () => {
        if (subiu) return;
        subiu = true;
        window.clearTimeout(espera);
        gsap.to(folha, { yPercent: 0, duration: DURACAO, ease: SUAVIZACAO });
      };

      const tentar = () => {
        if (chegou && pronta) subir();
      };

      ScrollTrigger.create({
        trigger: mascara,
        start: INICIO,
        once: true,
        onEnter: () => {
          chegou = true;
          tentar();
          /* Chegou e o iframe ainda não desenhou: espera um pouco, sobe. */
          if (!subiu) espera = window.setTimeout(subir, ESPERA_MAXIMA_MS);
        },
      });

      const aoAvisar = (evento: MessageEvent) => {
        /* Só a mensagem do NOSSO iframe conta. Sem allow-same-origin a origem
           dele é opaca ("null"), então o filtro é pela janela de origem, não
           pela origin. */
        const iframe = mascara.querySelector("iframe");
        if (!iframe || evento.source !== iframe.contentWindow) return;
        if (evento.data !== SINAL_PRONTA) return;
        pronta = true;
        tentar();
      };
      window.addEventListener("message", aoAvisar);

      return () => window.removeEventListener("message", aoAvisar);
    }, mascara);

    return () => {
      window.clearTimeout(espera);
      /* Mata o ScrollTrigger e o tween e devolve o transform da lâmina. */
      contexto.revert();
    };
  }, [emCena, reduzido]);

  if (reduzido) {
    return (
      <div ref={caixa} className="-mx-gutter mt-24 max-[479px]:-mx-gutter-sm">
        <PalavraChapada visivel />
      </div>
    );
  }

  return (
    <div
      ref={caixa}
      /* Sangra o gutter do rodapé: a assinatura é a última coisa da página e
         ganha a largura inteira da viewport. O overflow-hidden é a MÁSCARA da
         entrada — a lâmina de dentro começa deslocada 100% para baixo e sobe. */
      className="-mx-gutter mt-24 overflow-hidden max-[479px]:-mx-gutter-sm"
      style={{ aspectRatio: String(PROPORCAO_ASSINATURA) }}
    >
      {emCena ? (
        <>
          {/* h-full: o iframe pede height 100%, e a caixa de aspect-ratio dá
              altura definida para a porcentagem resolver. */}
          <div ref={lamina} className="h-full">
            <ParticleWordmark />
          </div>
          {/* O canvas não é texto para ninguém: buscador e leitor de tela só
              acham o nome por aqui. */}
          <span className="sr-only">Império Construtora</span>
        </>
      ) : (
        <PalavraChapada visivel={false} />
      )}
    </div>
  );
}

export default AssinaturaParticulas;
