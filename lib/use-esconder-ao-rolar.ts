"use client";

import { useEffect, useRef, useState } from "react";

/* Esconde um elemento fixo enquanto a pessoa rola PARA BAIXO e o traz de volta
   quando ela rola PARA CIMA.

   ══ POR QUE ISTO EXISTE ══

   O botão MENU e o botão flutuante do WhatsApp são `fixed`, e a home tem cerca
   de 9.000px. Como eles não saem do lugar, TODA linha da página passa por baixo
   de um dos dois em algum ponto da rolagem. Medido antes deste arquivo, contando
   trechos de texto interceptados pelo retângulo de cada botão:

     home, MENU      18 trechos a 360px · 15 a 390 · 11 a 768 · 2 a 1440
     home, WhatsApp   7 trechos a 360px · 12 a 390 ·  3 a 768 · 3 a 1440

   A saída anterior foi recuar a coluna de texto, e ela COBRA CARO: na
   /privacidade a coluna caiu de 328 para 272px a 360px, e o corpo de 18px foi
   de ~41 para 33 caracteres por linha. Para NENHUM texto passar por baixo, todo
   bloco precisaria de recuo permanente de 137px a 360px e 185px a 1440px — a
   360px sobrariam 191px de coluna. Não é conserto, é redesenhar a página em
   volta de dois botões.

   Escondendo ao rolar para baixo, a faixa de leitura fica livre justamente
   quando a pessoa está lendo, e o botão volta no gesto em que ela procura
   navegação: rolar para cima.

   ══ LIMIAR E HISTERESE ══

   Sem isso o botão pisca com micro-rolagem — o trackpad e o dedo produzem
   deltas de 1 a 3px em direções alternadas o tempo todo. Aqui:

     · o deslocamento é ACUMULADO, e o acumulador ZERA a cada troca de direção;
     · esconder exige 64px acumulados para baixo;
     · reaparecer exige 24px acumulados para cima.

   Os dois limiares são DIFERENTES de propósito — é isso que faz a histerese.
   Esconder é ação que tira algo da tela e precisa de intenção clara; reaparecer
   é ação que devolve, e tem de ser fácil. Com 64 e 24, um tranco de rolagem
   nunca vira um piscar: é preciso mover meio dedo numa direção só.

   ══ AS DUAS PONTAS DA PÁGINA ══

   No topo e no fim os dois botões ficam SEMPRE visíveis, em faixas de 96px. No
   topo porque é onde a navegação é esperada; no fim porque quem chegou ao
   rodapé terminou de ler e pode querer agir.

   ⚠ É POR ISSO QUE OS RECUOS DO RODAPÉ FICARAM. No fim da rolagem os dois
   botões estão garantidamente na tela, e é lá que eles cobriam o crédito e o
   CNPJ. Aquele recuo não cobra largura de leitura; o da coluna de texto cobrava,
   e foi revertido.

   ══ MOVIMENTO REDUZIDO ══

   O comportamento CONTINUA, sem transição. A alternativa seria deixar os botões
   sempre visíveis, e ela é pior: quem pede menos movimento continuaria com o
   texto coberto, que é o defeito que este arquivo existe para consertar.
   Aparecer e sumir de uma vez não é movimento — não há deslocamento nem
   animação para acompanhar. A transição é aplicada pelos componentes, sob
   `motion-safe`. */

/** Acumulado para baixo que esconde. */
const LIMIAR_ESCONDER = 64;
/** Acumulado para cima que traz de volta. Menor de propósito — ver acima. */
const LIMIAR_MOSTRAR = 24;
/** Faixas das duas pontas em que o botão fica sempre visível. */
const ZONA_TOPO = 96;
const ZONA_FIM = 96;

/**
 * @param travado enquanto verdadeiro o elemento fica visível e a rolagem é
 *   ignorada. É o que segura o botão com o overlay do menu aberto e com o
 *   próprio botão em foco por teclado — foco não pode ir parar num elemento
 *   escondido.
 */
export function useEsconderAoRolar(travado = false) {
  const [visivel, setVisivel] = useState(true);

  /* O acumulador e a última posição moram em ref: mudam a cada quadro de
     rolagem e não participam de render nenhum. Em estado, cada pixel rolado
     viraria um render. */
  const ultimoY = useRef(0);
  const acumulado = useRef(0);

  useEffect(() => {
    /* Travado: nada de escutar rolagem. O estado NÃO precisa ser reposto aqui
       — e não pode, porque `setState` no corpo de um efeito é render em
       cascata e o lint reprova, com razão. Ele já está em `true`: as duas
       travas (menu aberto, botão em foco) só podem ser acionadas por quem
       alcançou o botão, e ninguém alcança um botão escondido. */
    if (travado) return;

    ultimoY.current = window.scrollY;
    acumulado.current = 0;
    let quadro = 0;

    const avaliar = () => {
      quadro = 0;
      const y = window.scrollY;
      const doc = document.documentElement;

      /* AS DUAS PONTAS VÊM PRIMEIRO, antes até de olhar o deslocamento: assim
         o `resize` também as reavalia, e a altura do documento muda sozinha
         aqui (pin da faixa de paralaxe, imagem carregando). Elas zeram o
         acumulador — sair do topo não pode já chegar com 64px de crédito para
         esconder. */
      if (y <= ZONA_TOPO || y + window.innerHeight >= doc.scrollHeight - ZONA_FIM) {
        ultimoY.current = y;
        acumulado.current = 0;
        setVisivel(true);
        return;
      }

      const delta = y - ultimoY.current;
      ultimoY.current = y;
      if (delta === 0) return;

      /* Trocou de direção: o que foi acumulado na direção anterior não conta. */
      if (Math.sign(delta) !== Math.sign(acumulado.current)) acumulado.current = 0;
      acumulado.current += delta;

      if (acumulado.current > LIMIAR_ESCONDER) {
        acumulado.current = 0;
        setVisivel(false);
      } else if (acumulado.current < -LIMIAR_MOSTRAR) {
        acumulado.current = 0;
        setVisivel(true);
      }
    };

    /* rAF para coalescer: o evento de rolagem dispara muito mais que uma vez
       por quadro, e `avaliar` lê scrollHeight — leitura de layout. Uma por
       quadro, no máximo. */
    const aoRolar = () => {
      if (quadro) return;
      quadro = requestAnimationFrame(avaliar);
    };

    window.addEventListener("scroll", aoRolar, { passive: true });
    /* A altura do documento muda com o pin da faixa de paralaxe e com imagem
       carregando: reavaliar no resize evita ficar preso num "fim" que mudou. */
    window.addEventListener("resize", aoRolar, { passive: true });
    aoRolar();

    return () => {
      if (quadro) cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, [travado]);

  return travado || visivel;
}
