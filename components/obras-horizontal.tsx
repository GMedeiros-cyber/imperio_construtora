"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { obrasPaineis, type ObraPainel } from "@/lib/dados";
import { TagPill } from "@/components/tag-pill";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * BLOCO 3 — Obras em scroll horizontal
 * A seção tem 300vh de curso vertical; dentro dela um wrapper sticky segura a
 * trilha de 300vw, que anda para a esquerda conforme a rolagem.
 *
 * Abaixo de 768px o horizontal é desligado e os três painéis empilham, com a
 * seção voltando a ter altura automática.
 */
export function ObrasHorizontal() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: container });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.6666%"]);
  const ehDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <section
      ref={container}
      id="obras-em-destaque"
      className="relative bg-ink md:h-[300vh]"
    >
      <div className="md:sticky md:top-0 md:flex md:h-screen md:items-center md:overflow-hidden">
        <motion.div
          style={ehDesktop ? { x } : undefined}
          className="flex flex-col md:h-full md:w-[300vw] md:flex-row md:items-center"
        >
          {obrasPaineis.map((obra) => (
            <Painel key={obra.rotulo} obra={obra} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Painel({ obra }: { obra: ObraPainel }) {
  return (
    <article className="flex w-full shrink-0 flex-col gap-8 px-gutter-sm py-16 md:h-full md:w-screen md:px-gutter md:py-24">
      <p className="text-caption uppercase tracking-[0.18em] text-bone">
        <span
          aria-hidden
          className="mr-2 inline-block size-1 rounded-pill bg-bone align-middle"
        />
        {obra.rotulo}
      </p>

      {/* A descrição fica à direita da manchete e desce sozinha quando não
          cabe, em vez de espremer ou estourar a linha. */}
      <div className="flex flex-wrap items-end gap-8">
        <h2 className="text-heading-sm leading-none text-bone md:whitespace-nowrap md:text-heading xl:text-display">
          {obra.titulo}
        </h2>
        <p className="min-w-64 max-w-[28rem] flex-1 text-body text-ash">
          {obra.descricao}
        </p>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:min-h-0 md:flex-1">
        <Image
          src={obra.imagem}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <ul className="flex flex-wrap gap-element">
        {obra.tags.map((tag) => (
          <TagPill key={tag} tom="escuro">
            {tag}
          </TagPill>
        ))}
      </ul>
    </article>
  );
}
