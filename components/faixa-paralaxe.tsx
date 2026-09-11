"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

import { colunasParalaxe, faixaParalaxe } from "@/lib/dados";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";
import { cn } from "@/lib/utils";

/** Tempo de cada quadro do ciclo. */
const INTERVALO = 2000;
/** Duração da fusão entre um quadro e o seguinte. */
const FUSAO = 700;

/**
 * O ciclo de fotos DENTRO de um slot.
 *
 * Os quadros ficam todos empilhados em absoluto e só a opacidade muda: trocar
 * o src de uma <img> só daria um piscar de fundo enquanto o arquivo novo
 * chega, e aqui o fundo é a manchete lendo por difference.
 *
 * ⚠ A FUSÃO NÃO ABRE BURACO CLARO. Durante os 700ms o pixel composto é uma
 * mistura entre dois quadros e o ink — e o script de tratamento põe TODO canal
 * de TODO quadro em 72 ou menos. Mistura de valores ≤72 com o ink (10) nunca
 * sobe acima de 72, então o alvo de 0% vale também no meio da transição, não
 * só nos quadros parados.
 *
 * ⚠ O QUADRO 1 É O ÚNICO QUE EXISTE NO HTML INICIAL. Os demais só entram na
 * árvore quando "carrega" vira true, a uma tela de distância — a mesma
 * condição do src dos vídeos. Sem isso o navegador baixaria nove fotos ainda
 * na hero. Com movimento reduzido "carrega" nunca vira true: não adianta não
 * ciclar se o peso das fotos do ciclo desce do mesmo jeito.
 */
function CicloDeFotos({
  quadros,
  carrega,
  ativo,
}: {
  quadros: readonly string[];
  carrega: boolean;
  ativo: boolean;
}) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (!ativo || quadros.length < 2) return;
    const id = setInterval(
      () => setIndice((anterior) => (anterior + 1) % quadros.length),
      INTERVALO,
    );
    return () => clearInterval(id);
  }, [ativo, quadros.length]);

  /* Com movimento reduzido, ou com a seção fora da tela, o ciclo para ONDE
     ESTÁ; quem nunca viu a faixa continua no quadro 1. Voltar ao 0 no
     "ativo=false" faria a foto pular para quem só passou o dedo. */
  return (
    <div data-midia aria-hidden className="absolute inset-0 z-[2]">
      {quadros.map((src, posicao) =>
        posicao === 0 || carrega ? (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            /* SVG passa longe do otimizador; foto real, não. */
            unoptimized={src.endsWith(".svg")}
            /* 45vw abaixo de 768: na vertente de duas colunas a mídia mede
               ~44vw, e os 25vw antigos serviam a uma coluna de 77px que não
               existe mais. */
            sizes="(max-width: 767.98px) 45vw, 17vw"
            style={{ transitionDuration: `${FUSAO}ms` }}
            className={cn(
              "object-cover transition-opacity ease-linear",
              posicao === indice ? "opacity-100" : "opacity-0",
            )}
          />
        ) : null,
      )}
    </div>
  );
}

/**
 * BLOCO 5b — Faixa de paralaxe
 * Seis colunas de imagem alternando com cinco divisores de 1px, cada coluna
 * correndo em uma velocidade.
 *
 * ⚠ O FUNDO NÃO VIRA MAIS CREME NO FIM DA ROLAGEM. Havia um tween que levava a
 * seção a #FAF8F2 para entregar no ComoTrabalhamos, que era creme. Ele ficou
 * escuro, e o tween passou a terminar a faixa em creme contra ink — uma emenda
 * dura de 240 por canal, medida.
 *
 * Tirar também melhorou a composição: a página tem dois blooms dourados, um em
 * cada arco, e esta faixa é o vale escuro entre eles. Uma terceira virada de
 * valor aqui, e ainda para outra temperatura, disputava com os dois.
 *
 * A legibilidade do texto continua vindo do mix-blend-mode: difference, não de
 * um overlay: sobre o ink o bone lê quase branco.
 */
export function FaixaParalaxe() {
  const secao = useRef<HTMLElement>(null);
  const wraps = useRef<(HTMLDivElement | null)[]>([]);
  const reduzido = useMovimentoReduzido();
  /* O src dos vídeos só entra quando a seção chega a uma tela de distância.
     Com o src no HTML, o autoPlay passava por cima do preload="metadata" e a
     home baixava os dois vídeos inteiros (1.626 KB, medidos) antes de o leitor
     sair da hero. Até aqui, o pôster é o cartão: <video> sem src mostra o
     pôster, então não fica buraco no lugar enquanto o arquivo chega. */
  const [perto, setPerto] = useState(false);
  /* Separado do "perto": aquele é de UMA TELA de antecedência e nunca volta a
     false; este é a seção realmente na tela, e liga e desliga. É ele que
     manda no ciclo — timer rodando com a faixa fora de vista é bateria e
     re-render por nada. */
  const [naTela, setNaTela] = useState(false);

  useEffect(() => {
    const raiz = secao.current;
    if (!raiz) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setPerto(true);
          observador.disconnect();
        }
      },
      /* Uma tela inteira de antecedência nos dois sentidos: quem desce chega
         com o vídeo já tocando, e quem cai no meio da página por âncora
         também dispara. */
      { rootMargin: "100% 0px" },
    );
    observador.observe(raiz);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    const raiz = secao.current;
    if (!raiz) return;
    const observador = new IntersectionObserver(
      (entradas) => setNaTela(entradas.some((entrada) => entrada.isIntersecting)),
    );
    observador.observe(raiz);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    /* Com a preferência ativa não se cria gatilho nenhum: as colunas ficam na
       posição inicial. O fundo é ink nos dois casos. */
    if (reduzido) return;

    gsap.registerPlugin(ScrollTrigger);

    /* matchMedia e não uma leitura única da largura: o multiplicador muda com
       a vertente, e quem gira o aparelho ou arrasta a janela através de 768px
       precisa dos tweens refeitos. O revert() devolve tudo ao sair. */
    const mm = gsap.matchMedia(secao);

    mm.add(
      {
        /* 767.98 e não 767: o Tailwind emite "not (min-width: 768px)", que
           pega qualquer largura fracionária abaixo de 768. */
        estreito: "(max-width: 767.98px)",
        largo: "(min-width: 768px)",
      },
      (contexto) => {
        const estreito = Boolean(contexto.conditions?.estreito);
        /* Abaixo de 768px a coluna é 2,2x mais larga e a mídia, alta: com o
           -50 do desktop as colunas rápidas percorriam seis vezes a própria
           altura e sumiam no primeiro quarto da trilha. Medido a 390px antes:
           2,34% da tela em mídia e 25% das posições sem nenhuma. */
        const fator = estreito ? -12 : -50;
        /* O deslocamento interno da mídia também sai no mobile: ele soma ao
           da coluna e antecipa a saída pelo topo. */
        const interno = estreito ? 0 : -30;

        wraps.current.forEach((wrap, indice) => {
          if (!wrap) return;
          const gatilho = {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.3,
          } as const;

          gsap.to(wrap, {
            yPercent: colunasParalaxe[indice].velocidade * fator,
            ease: "none",
            scrollTrigger: gatilho,
          });

          /* [data-midia] e não "img, video": com o ciclo, o slot tem VÁRIAS
             <img> empilhadas, e querySelector pegaria só a primeira — as
             outras ficariam paradas enquanto a de baixo desliza. O atributo
             marca o contêiner único, que existe nos dois casos. */
          const midia = wrap.querySelector<HTMLElement>("[data-midia]");
          if (midia && interno !== 0) {
            gsap.fromTo(
              midia,
              { yPercent: 0 },
              { yPercent: interno, ease: "none", scrollTrigger: gatilho },
            );
          }
        });
      },
    );

    return () => mm.revert();
  }, [reduzido]);

  /* O useMediaQuery começa em false no servidor e no primeiro render do
     cliente, então o autoPlay chega marcado no HTML mesmo para quem pediu
     movimento reduzido. Este efeito fecha essa janela: assim que a
     preferência é lida, pausa e volta ao primeiro quadro, deixando só o
     pôster à mostra. */
  useEffect(() => {
    if (!reduzido) return;
    const raiz = secao.current;
    if (!raiz) return;
    raiz.querySelectorAll("video").forEach((video) => {
      video.autoplay = false;
      video.pause();
      video.currentTime = 0;
    });
  }, [reduzido]);

  /* Sonda de contagem de gatilhos, só em desenvolvimento. */
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    (window as Window & { __gatilhosParalaxe?: () => number }).__gatilhosParalaxe =
      () => ScrollTrigger.getAll().length;
  }, []);

  return (
    <section
      ref={secao}
      /* ink, e não bg-black: preto puro não existe na paleta, e a diferença
         de 10 por canal para o ink do ObrasHorizontal logo acima aparecia como
         mais uma listra na emenda. */
      className="bg-ink"
    >
      {/* max-[N] e não max-[N-1]: o Tailwind gera "@media not (min-width: N)",
          que é exclusivo — max-[768px] pega até 767,98px. O padding continua
          virando em 480px porque é regra de página (2rem, 1rem abaixo de
          479px); a VERTENTE da faixa é que passou a virar em 768px, junto com
          o resto do site. */}
      <div className="px-8 max-[480px]:px-4">
        <div className="mx-auto w-full max-w-[120rem]">
          {/* 400vw, e não uma altura em rem: abaixo de 768px a altura de cada
              mídia vem da proporção sobre a largura da coluna, então a trilha
              tem de escalar junto — em rem a composição se desmontava a 767px,
              onde a mídia mede o dobro da de 390px. */}
          <div className="relative h-[250vh] max-[768px]:h-[400vw]">
            {/* As colunas somam até 330vh (150vh de altura mais até 130vh de
                margem) dentro de uma grade de 250vh, então elas e os divisores
                vazavam por cima da seção seguinte. O recorte fica nesta camada,
                e não na seção, para não transformar a seção em contêiner de
                rolagem — isso quebraria o position:sticky do texto. */}
            {/* relative não é decoração: abaixo de 768px as colunas são
                absolutas, e sem um contêiner posicionado AQUI o bloco de
                referência delas passa a ser a camada de cima — que está fora
                deste overflow-hidden, e o recorte deixaria de valer. */}
            <div className="relative grid h-full grid-cols-[1fr_1px_1fr_1px_1fr_1px_1fr_1px_1fr_1px_1fr] gap-2 overflow-hidden">
            {/* Abaixo de 768px são duas colunas, então os cinco divisores da
                grade dão lugar a um só, no meio, em posição absoluta como as
                colunas. O -0.5px centra o fio de 1px na calha de 17px. */}
            <div
              aria-hidden
              className="absolute inset-y-0 left-[calc(50%_-_0.5px)] z-40 hidden w-px bg-[linear-gradient(#fff0,#fff3_20%_80%,#fff0)] mix-blend-difference max-[768px]:block"
            />

            {colunasParalaxe.map((coluna, indice) => (
              <Fragment key={coluna.midia.src}>
                {indice > 0 ? (
                  <div
                    aria-hidden
                    className="relative z-40 h-full w-px bg-[linear-gradient(#fff0,#fff3_20%_80%,#fff0)] mix-blend-difference max-[768px]:hidden"
                  />
                ) : null}

                <div
                  className={cn(
                    /* No mobile a coluna sai do fluxo: quem manda na posição
                       é o top do classeColuna, não a margem nem a altura de
                       trilha do desktop. */
                    "mb-[50vh] h-[150vh] max-[768px]:mb-0 max-[768px]:mt-0 max-[768px]:h-auto",
                    coluna.classeColuna,
                    coluna.escondeMobile && "max-[768px]:hidden",
                  )}
                >
                  <div
                    ref={(el) => {
                      wraps.current[indice] = el;
                    }}
                    className={cn("relative overflow-hidden", coluna.classeWrap)}
                  >
                    {coluna.midia.tipo === "video" ? (
                      /* Os arquivos já vêm SEM trilha de áudio — conferido no
                         mp4: só handler "vide", nenhum "soun". O muted fica
                         assim mesmo, porque é ele que as políticas de
                         autoplay dos navegadores exigem, não a ausência da
                         trilha.

                         Com movimento reduzido o src nunca entra: o pôster
                         é o primeiro quadro, e baixar um vídeo que vai ficar
                         parado nele é peso à toa. */
                      <video
                        data-midia
                        src={perto && !reduzido ? coluna.midia.src : undefined}
                        poster={coluna.midia.poster}
                        autoPlay={!reduzido}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden
                        className="absolute inset-0 z-[2] size-full object-cover"
                      />
                    ) : (
                      <CicloDeFotos
                        quadros={[coluna.midia.src, ...(coluna.midia.ciclo ?? [])]}
                        /* !reduzido também no CARREGA, e não só no ativo:
                           com a preferência ligada o ciclo já não andava, mas
                           os quadros 2 em diante entravam na árvore assim
                           mesmo e o navegador baixava as nove — medido. Quem
                           pediu movimento reduzido vê o quadro 1 e só paga
                           por ele. */
                        carrega={perto && !reduzido}
                        ativo={naTela && !reduzido}
                      />
                    )}
                  </div>
                </div>
              </Fragment>
            ))}
            </div>

            <div className="pointer-events-none absolute inset-0 z-[6] flex h-[250vh] flex-col items-center justify-start text-center mix-blend-difference max-[768px]:h-[400vw]">
              {/* h-screen também no mobile: a caixa de 50rem fixos deixava a
                  manchete acima do centro nas telas altas e a soltava cedo
                  demais numa trilha que agora escala com a largura. */}
              <div className="sticky top-0 z-[9] flex h-screen flex-col items-center justify-center overflow-hidden">
                {/* Só a manchete: o eyebrow saiu por completo.
                    Breakpoints todos em min-[Npx]: misturar com os nomeados
                    (md:) inverte a ordem na cascata, porque o Tailwind emite
                    os arbitrários antes dos nomeados. */}
                <h2 className="max-w-[24ch] text-obra-sm text-bone min-[768px]:text-obra-md min-[992px]:max-w-[30ch] min-[992px]:text-obra-lg">
                  {faixaParalaxe.statement.map((linha) => (
                    <span key={linha} className="block">
                      {linha}
                    </span>
                  ))}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
