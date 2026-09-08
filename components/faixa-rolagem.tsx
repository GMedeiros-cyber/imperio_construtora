"use client";

import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { faixaRolagem, ladrilhosDesktop, ladrilhosMobile, type Ladrilho } from "@/lib/dados";

/**
 * BLOCO 5b — Faixa de rolagem
 * Única faixa escura da página fora do bloco 10 e do card de acento. Os
 * ladrilhos correm em velocidades diferentes conforme a rolagem, sempre atrás
 * do texto.
 *
 * REGRA: nenhum texto sobre foto. No desktop os ladrilhos se ancoram em 15% e
 * 85% da largura, deixando o vão central de 70vw livre, e a caixa de texto é
 * limitada a 62vw — a separação é geométrica, vale em qualquer rolagem. No
 * mobile não existe vão lateral, então a separação passa a ser vertical, com
 * folga maior que o percurso do deslocamento.
 */
export function FaixaRolagem() {
  const secao = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: secao,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={secao}
      /* O piso de 1100px importa: as posições dos ladrilhos são porcentagens
         da altura da seção, mas as alturas deles são fixas em px. Só com
         150vh, numa viewport baixa a seção encolhia e a faixa do rótulo
         deixava de ficar livre. */
      className="relative min-h-[max(150vh,1100px)] overflow-hidden bg-ink"
    >
      <div aria-hidden className="hidden md:block">
        {ladrilhosDesktop.map((item) => (
          <LadrilhoFoto key={item.imagem + item.topo} item={item} progresso={scrollYProgress} />
        ))}
      </div>

      <div aria-hidden className="md:hidden">
        {ladrilhosMobile.map((item) => (
          <LadrilhoFoto key={item.imagem + item.topo} item={item} progresso={scrollYProgress} mobile />
        ))}
      </div>

      {/* Rótulo vertical — some no mobile */}
      {/* O rótulo também é texto: a coluna esquerda de ladrilhos é posicionada
          para deixar esta faixa central livre. */}
      <div className="absolute left-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex">
        <span className="text-caption uppercase text-gold [writing-mode:vertical-rl] rotate-180">
          {faixaRolagem.rotulo}
        </span>
        <ArrowDown size={16} strokeWidth={1} className="text-gold" aria-hidden />
      </div>

      <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-gutter-sm md:px-gutter">
        <div className="mx-auto w-full md:max-w-[62vw]">
          <p className="text-caption uppercase text-gold">{faixaRolagem.eyebrow}</p>
          <h2 className="mt-12 text-heading-sm text-bone xl:text-heading">
            {faixaRolagem.statement.map((linha) => (
              <span key={linha} className="block">
                {linha}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}

function LadrilhoFoto({
  item,
  progresso,
  mobile = false,
}: {
  item: Ladrilho;
  progresso: MotionValue<number>;
  mobile?: boolean;
}) {
  /* Com prefers-reduced-motion o ladrilho fica parado na posição inicial. */
  const reduzido = useReducedMotion();
  const y = useTransform(progresso, [0, 1], [0, reduzido ? 0 : item.desloca]);

  return (
    <motion.div
      style={{
        y,
        top: item.topo,
        width: item.largura,
        /* Desktop: borda interna do ladrilho em 15% / 85%, deixando o vão
           central livre. Mobile: coluna única centralizada. */
        ...(mobile
          ? { left: "50%", marginLeft: -item.largura / 2 }
          : item.lado === "esquerda"
            ? { right: "85%" }
            : { left: "85%" }),
      }}
      className="absolute"
    >
      {/* unoptimized: com o otimizador ligado, parte dos ladrilhos resolvia o
          srcset para a variante de 3840px — peso absurdo para um ladrilho de
          300px — e essas simplesmente não carregavam, deixando buracos na
          faixa. São seis imagens decorativas, de 82 a 400KB, abaixo da dobra
          e com lazy loading; servir o arquivo direto é previsível e mais leve
          do que a variante gigante que o otimizador estava escolhendo. */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={item.imagem}
          alt=""
          width={item.largura}
          height={Math.round((item.largura * 4) / 3)}
          sizes={`${item.largura}px`}
          unoptimized
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </motion.div>
  );
}
