"use client";

import Image from "next/image";
import { useState } from "react";

import type { PainelAutoria } from "@/lib/dados";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";

/*
 * Galeria elástica — cinco painéis lado a lado; o ativo abre para 4 partes da
 * largura e os outros ficam com 1.
 *
 * ⚠ O ANEXO NÃO CHEGOU NESTA RODADA. Este arquivo foi escrito a partir do
 * comportamento descrito no pedido, já com as três adaptações pedidas
 * aplicadas. Se o componente original for reenviado e divergir, é este
 * arquivo que se troca — a seção que o consome não muda.
 *
 * ══ AS TRÊS REGRAS QUE O ORIGINAL QUEBRAVA ══
 *
 * 1. rounded-2xl nos painéis  -> canto reto. O DESIGN.md não admite raio em
 *    imagem; 1440px existe só em botão, pill e tag.
 * 2. bg-gradient-to-t from-black/80 sobre a foto -> REMOVIDO. Overlay é
 *    proibido. A legenda foi para FORA da foto, na faixa bone abaixo dela:
 *    medido, texto bone sobre estas fotos reprova, e sem overlay não há como
 *    salvar dentro do quadro. Ver a medição no comentário da legenda.
 * 3. font-black uppercase -> peso 300, sem caixa alta forçada.
 *
 * Saíram também o dark: e o bg-white/bg-neutral-950 — o canvas é o bone — e a
 * CTA "View Project", que apontava para uma página por obra que não existe
 * aqui.
 */

/** Quanto o painel ativo cresce em relação aos demais. */
const PESO_ATIVO = 4;

export function ElasticGallery({ paineis }: { paineis: PainelAutoria[] }) {
  const [ativo, setAtivo] = useState(0);
  const reduzido = useMovimentoReduzido();

  return (
    <ul className="flex flex-col gap-px min-[768px]:h-[34rem] min-[768px]:flex-row">
      {paineis.map((painel, indice) => {
        const eAtivo = indice === ativo;

        return (
          <li
            key={painel.titulo}
            /* flex-grow é o que anima: 1 -> 4. A transição sai inteira com
               movimento reduzido, e o painel ativo troca sem percurso. */
            style={{
              flexGrow: eAtivo ? PESO_ATIVO : 1,
              transition: reduzido ? undefined : "flex-grow 620ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            className="flex min-w-0 flex-none basis-0 flex-col min-[768px]:flex-1"
          >
            <button
              type="button"
              aria-pressed={eAtivo}
              onMouseEnter={() => setAtivo(indice)}
              onFocus={() => setAtivo(indice)}
              onClick={() => setAtivo(indice)}
              className="group flex w-full flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dk"
            >
              {/* A foto. Canto reto, sem overlay, sem filtro. */}
              <span className="relative block aspect-[3/4] w-full overflow-hidden min-[768px]:aspect-auto min-[768px]:h-[27rem]">
                <Image
                  src={painel.imagem}
                  alt={painel.alt}
                  fill
                  /* O painel ativo ocupa 4/8 da largura da seção; os outros
                     1/8. O sizes acompanha, para o otimizador não servir uma
                     variante grande demais para o painel fechado. */
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </span>

              {/* ── Legenda, FORA da foto ──────────────────────────────────
                  É aqui que a regra do overlay se paga. Medido sobre estas
                  cinco fotos, texto bone dentro do quadro reprova (números no
                  relatório da rodada), e a saída do original era justamente o
                  gradiente preto que não podemos usar. Na faixa bone o ink dá
                  18,6:1 e o graphite 7,0:1, sem depender da foto. */}
              <span className="flex flex-col gap-1 bg-bone px-3 py-4">
                <span className="flex items-baseline gap-2">
                  <span className="text-caption text-graphite">{painel.numero}</span>
                  <span className="truncate text-caption uppercase tracking-[0.1em] text-gold-dk">
                    {painel.categoria}
                  </span>
                </span>
                <span className="truncate font-display text-subheading font-light text-ink">
                  {painel.titulo}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default ElasticGallery;
