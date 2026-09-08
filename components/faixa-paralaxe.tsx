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
 * correndo em uma velocidade, e o fundo virando creme no fim da rolagem.
 *
 * A legibilidade do texto vem do mix-blend-mode: difference, não de um
 * overlay: sobre o preto inicial o bone lê quase branco e, quando o fundo
 * vira creme, ele inverte sozinho para escuro.
 */
export function FaixaParalaxe() {
  const secao = useRef<HTMLElement>(null);
  const wraps = useRef<(HTMLDivElement | null)[]>([]);
  const reduzido = useMovimentoReduzido();

  useEffect(() => {
    /* Com a preferência ativa não se cria gatilho nenhum: as colunas ficam na
       posição inicial e o fundo já entra em bone, pela variante motion-reduce. */
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

        const imagem = wrap.querySelector("img");
        if (imagem) {
          gsap.fromTo(
            imagem,
            { yPercent: 0 },
            { yPercent: -30, ease: "none", scrollTrigger: gatilho },
          );
        }
      });

      gsap.to(secao.current, {
        backgroundColor: "#FAF8F2",
        ease: "none",
        scrollTrigger: {
          trigger: secao.current,
          start: "bottom 150%",
          end: "bottom 100%",
          scrub: true,
        },
      });
    }, secao);

    return () => contexto.revert();
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
      className="bg-black motion-reduce:bg-bone"
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
              <Fragment key={coluna.imagem}>
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
                    <Image
                      src={coluna.imagem}
                      alt=""
                      fill
                      unoptimized
                      sizes="(max-width: 479px) 25vw, 17vw"
                      className="z-[2] object-cover"
                    />
                  </div>
                </div>
              </Fragment>
            ))}
            </div>

            <div className="pointer-events-none absolute inset-0 z-[6] flex h-[250vh] flex-col items-center justify-start text-center mix-blend-difference max-[480px]:h-[125rem]">
              <div className="sticky top-0 z-[9] flex h-screen flex-col items-center justify-center overflow-hidden max-[480px]:h-[50rem]">
                <div className="max-w-[60ch] max-[480px]:max-w-[30ch]">
                  <p className="text-caption uppercase text-bone">
                    <span
                      aria-hidden
                      className="mr-2 inline-block size-1 rounded-pill bg-bone align-middle"
                    />
                    {faixaParalaxe.eyebrow}
                  </p>
                  <h2 className="mt-12 text-heading-sm text-bone md:text-heading">
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
      </div>
    </section>
  );
}
