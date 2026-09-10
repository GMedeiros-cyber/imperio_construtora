"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";

import { colunasParalaxe, faixaParalaxe } from "@/lib/dados";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    /* Com a preferência ativa não se cria gatilho nenhum: as colunas ficam na
       posição inicial. O fundo é ink nos dois casos. */
    if (reduzido) return;

    gsap.registerPlugin(ScrollTrigger);

    const contexto = gsap.context(() => {
      wraps.current.forEach((wrap, indice) => {
        if (!wrap) return;
        const gatilho = {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.3,
        } as const;

        gsap.to(wrap, {
          yPercent: colunasParalaxe[indice].velocidade * -50,
          ease: "none",
          scrollTrigger: gatilho,
        });

        /* "img, video": o slot pode trazer qualquer um dos dois, e o
           deslocamento interno da mídia é o mesmo nos dois casos. */
        const midia = wrap.querySelector("img, video");
        if (midia) {
          gsap.fromTo(
            midia,
            { yPercent: 0 },
            { yPercent: -30, ease: "none", scrollTrigger: gatilho },
          );
        }
      });

    }, secao);

    return () => contexto.revert();
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
      {/* max-[480px] e não max-[479px]: o Tailwind gera
          "@media not (min-width: N)", que é exclusivo. Com 479 as regras não
          aplicavam justamente em 479px de largura; com 480 o intervalo fica
          idêntico ao "max-width: 479px" do original. */}
      <div className="px-8 max-[480px]:px-4">
        <div className="mx-auto w-full max-w-[120rem]">
          <div className="relative h-[250vh] max-[480px]:h-[125rem]">
            {/* As colunas somam até 330vh (150vh de altura mais até 130vh de
                margem) dentro de uma grade de 250vh, então elas e os divisores
                vazavam por cima da seção seguinte. O recorte fica nesta camada,
                e não na seção, para não transformar a seção em contêiner de
                rolagem — isso quebraria o position:sticky do texto. */}
            <div className="grid h-full grid-cols-[1fr_1px_1fr_1px_1fr_1px_1fr_1px_1fr_1px_1fr] gap-2 overflow-hidden max-[480px]:grid-cols-[1fr_1px_1fr_1px_1fr_1px_1fr]">
            {colunasParalaxe.map((coluna, indice) => (
              <Fragment key={coluna.midia.src}>
                {indice > 0 ? (
                  <div
                    aria-hidden
                    className={cn(
                      "relative z-40 h-full w-px bg-[linear-gradient(#fff0,#fff3_20%_80%,#fff0)] mix-blend-difference",
                      indice >= 4 && "max-[480px]:hidden",
                    )}
                  />
                ) : null}

                <div
                  className={cn(
                    "mb-[50vh] h-[150vh] max-[480px]:mb-[25rem] max-[480px]:h-[50rem]",
                    coluna.classeColuna,
                    coluna.escondeMobile && "max-[480px]:hidden",
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
                         trilha. */
                      <video
                        src={coluna.midia.src}
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
                      <Image
                        src={coluna.midia.src}
                        alt=""
                        fill
                        /* SVG passa longe do otimizador; foto real, não. */
                        unoptimized={coluna.midia.src.endsWith(".svg")}
                        sizes="(max-width: 479px) 25vw, 17vw"
                        className="z-[2] object-cover"
                      />
                    )}
                  </div>
                </div>
              </Fragment>
            ))}
            </div>

            <div className="pointer-events-none absolute inset-0 z-[6] flex h-[250vh] flex-col items-center justify-start text-center mix-blend-difference max-[480px]:h-[125rem]">
              <div className="sticky top-0 z-[9] flex h-screen flex-col items-center justify-center overflow-hidden max-[480px]:h-[50rem]">
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
