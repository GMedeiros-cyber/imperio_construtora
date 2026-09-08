"use client";

import gsap from "gsap";
import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";

import { slotsHero } from "@/lib/dados";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";

/* Tratamento das fotos numa declaração só, para reverter fácil: são oito
   origens diferentes e as dominantes de cor brigam entre si lado a lado. */
const FILTRO_FOTO = "grayscale";

const CORTINA_FECHADA = "polygon(0 0%, 100% 0%, 100% 0%, 0 0%)";
const CORTINA_ABERTA = "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)";

/**
 * BLOCOS 2 e 3 — Hero em composição
 * Um único contêiner flex com quebra de linha: cada linha abre com um pedaço
 * do headline e o slot de imagem toma o que sobrou dela (flex-1) com a altura
 * da linha (self-stretch). Texto e foto nunca se sobrepõem — a composição é
 * lado a lado, não empilhada, e por isso não há problema de contraste aqui.
 *
 * A marcação é um h1 só, e não quatro: são pedaços de um mesmo headline, e
 * quatro h1 dariam quatro títulos ao leitor de tela. Os filhos são span
 * (conteúdo de frase), então o h1 continua válido.
 */
export function HeroComposicao() {
  const cortinas = useRef<(HTMLSpanElement | null)[]>([]);
  const reduzido = useMovimentoReduzido();

  useEffect(() => {
    /* Com a preferência ativa a cortina já entra aberta pela variante
       motion-reduce no CSS; não se anima nada. */
    if (reduzido) return;

    const alvos = cortinas.current.filter(Boolean);
    if (!alvos.length) return;

    const contexto = gsap.context(() => {
      gsap.fromTo(
        alvos,
        { clipPath: CORTINA_FECHADA },
        {
          clipPath: CORTINA_ABERTA,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.15,
          delay: 0.4,
        },
      );
    });

    return () => contexto.revert();
  }, [reduzido]);

  return (
    <section id="inicio" className="px-gutter-sm py-section md:px-gutter">
      <h1 className="flex flex-wrap items-center gap-x-2 text-heading-sm text-ink md:text-heading xl:text-display">
        {slotsHero.map((slot, indice) => (
          <Fragment key={slot.texto}>
            <span>{slot.texto}</span>

            <span className="relative block min-w-16 flex-1 self-stretch overflow-hidden">
              {/* priority: é a hero, está acima da dobra. */}
              <Image
                src={slot.base}
                alt={slot.baseAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className={`object-cover ${FILTRO_FOTO}`}
              />
              <span
                ref={(el) => {
                  cortinas.current[indice] = el;
                }}
                className="absolute inset-0 block [clip-path:polygon(0_0%,100%_0%,100%_0%,0_0%)] motion-reduce:[clip-path:polygon(0_0%,100%_0%,100%_100%,0_100%)]"
              >
                {/* eager e não lazy: com a cortina fechada o elemento tem
                    área zero, e o lazy loading do navegador nunca dispara —
                    a imagem de cima ficava sem carregar mesmo depois da
                    cortina abrir. */}
                <Image
                  src={slot.topo}
                  alt={slot.topoAlt}
                  fill
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className={`object-cover ${FILTRO_FOTO}`}
                />
              </span>
            </span>

            {/* Quebra de linha do flex: garante um pedaço de texto e um slot
                por linha, que é o que faz cada imagem ter proporção própria. */}
            {indice < slotsHero.length - 1 ? (
              <span aria-hidden className="block basis-full" />
            ) : null}
          </Fragment>
        ))}
      </h1>
    </section>
  );
}
