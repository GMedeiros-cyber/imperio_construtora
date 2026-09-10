"use client";

import Image from "next/image";
import { useState } from "react";

import type { PainelAutoria } from "@/lib/dados";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";
import { cn } from "@/lib/utils";

/*
 * Galeria elástica — adaptado do componente recebido.
 *
 * O QUE FOI PRESERVADO: a altura fixa do contêiner (que é o que mantém a
 * animação estável), o acordeão em coluna no celular e em linha no desktop, o
 * flex-[4] contra flex-[1] com a mesma curva e duração, o zoom sutil da foto
 * inativa, o título rotacionado nos painéis fechados e o terceiro painel
 * aberto por padrão.
 *
 * A numeração 01-05 do original SAIU, do aberto e do fechado: marcador
 * numerado só se justifica quando o conteúdo é sequência, e cinco obras são
 * um conjunto, não uma ordem.
 *
 * ══ AS QUATRO REGRAS QUE O ORIGINAL QUEBRAVA ══
 *
 * 1. rounded-2xl -> canto reto. O DESIGN.md não admite raio em imagem.
 *
 * 2. bg-gradient-to-t from-black/80 sobre a foto -> REMOVIDO, overlay é
 *    proibido. O texto foi para uma FAIXA OPACA de bone: barra no rodapé do
 *    painel aberto, tira vertical na borda do fechado. Faixa opaca é
 *    superfície, não véu — não escurece a foto para consertar contraste,
 *    ocupa o próprio espaço.
 *
 *    ⚠ POR QUE NÃO DEIXAR O TEXTO SOBRE A FOTO: medido no terço inferior das
 *    cinco fotos, texto bone dentro do quadro dá de 1,53 a 4,23:1 no pior
 *    corte de cada uma — todas abaixo dos 4,5:1. Não há "área escura da
 *    própria foto" para usar: são fachadas com céu claro. Na faixa bone o
 *    ink dá 18,64:1 e o gold-dk 4,59:1, sem depender da foto.
 *
 * 3. font-black uppercase -> peso 300, sem caixa alta forçada.
 *
 * 4. brightness-50 nos painéis inativos -> REMOVIDO. É filter por CSS sobre
 *    foto, que o AGENTS.md proíbe na mesma frase do overlay. O original usava
 *    o escurecimento para marcar qual painel está ativo; aqui quem marca é o
 *    próprio tamanho — 4 partes contra 1 é diferença de sobra — mais a troca
 *    da tira vertical pela barra do rodapé.
 *
 * Saíram também: o dark:, o bg-white/bg-neutral-950, o max-w-6xl (a galeria é
 * full-bleed, e container de largura máxima é proibido), o backdrop-blur da
 * pílula de categoria e a CTA "View Project", que apontaria para uma página
 * por obra que não existe aqui.
 *
 * ══ UM ACRÉSCIMO ══
 *
 * O original põe o onMouseEnter/onClick num <div>, que teclado não alcança.
 * Aqui cada painel é <button>, com onFocus abrindo junto: navegar por Tab
 * percorre a galeria.
 */

/* No celular a barra do painel fechado é baixa e não cabe o título inteiro.
   ⚠ "Residencial Bella Pietra" e "Residencial São Marinho" dão a MESMA
   primeira palavra — ver o aviso no relatório da rodada. */
function primeiraPalavra(titulo: string) {
  return titulo.split(" ")[0];
}

/** O painel aberto ocupa 4 partes; cada fechado, 1. */
const PESO_ABERTO = 4;

/** Mesma curva e duração do original. */
const CURVA = "cubic-bezier(0.25, 1, 0.5, 1)";

export function ElasticGallery({ paineis }: { paineis: PainelAutoria[] }) {
  /* O terceiro nasce aberto, como no original. */
  const [aberto, setAberto] = useState(paineis[2]?.numero ?? paineis[0]?.numero);
  const reduzido = useMovimentoReduzido();

  return (
    <ul className="flex h-[500px] w-full flex-col gap-2 min-[768px]:h-[600px] min-[768px]:flex-row min-[768px]:gap-4">
      {paineis.map((painel) => {
        const eAberto = painel.numero === aberto;

        return (
          <li
            key={painel.numero}
            style={{
              flexGrow: eAberto ? PESO_ABERTO : 1,
              transition: reduzido ? undefined : `flex-grow 700ms ${CURVA}`,
            }}
            className="relative min-h-0 min-w-0 flex-none basis-0 overflow-hidden"
          >
            <button
              type="button"
              aria-expanded={eAberto}
              onMouseEnter={() => setAberto(painel.numero)}
              onFocus={() => setAberto(painel.numero)}
              onClick={() => setAberto(painel.numero)}
              className="absolute inset-0 block cursor-pointer text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold-dk"
            >
              <Image
                src={painel.imagem}
                alt={painel.alt}
                fill
                /* O painel aberto chega a ~50vw; o fechado fica perto de
                   12vw. O sizes acompanha o aberto, que é o que precisa de
                   resolução. */
                sizes="(min-width: 768px) 50vw, 100vw"
                className={cn(
                  "object-cover",
                  !reduzido && "transition-transform duration-1000",
                  eAberto ? "scale-100" : "scale-110",
                )}
              />

              {/* ── Faixa do painel ABERTO: barra opaca no rodapé ────────── */}
              <span
                style={{ transition: reduzido ? undefined : `transform 500ms ${CURVA}, opacity 500ms ${CURVA}` }}
                className={cn(
                  "absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-bone px-4 py-4 min-[768px]:px-8 min-[768px]:py-6",
                  eAberto
                    ? "translate-y-0 opacity-100 delay-200"
                    : "pointer-events-none translate-y-full opacity-0",
                )}
              >
                {/* Sem o 01-05 do original: marcador numerado só se
                    justifica quando o conteúdo é sequência, e cinco obras são
                    um conjunto. O que fica é a construtora. */}
                <span className="truncate text-caption uppercase tracking-[0.1em] text-gold-dk">
                  {painel.categoria}
                </span>
                <span className="truncate font-display text-subheading font-light text-ink min-[768px]:text-heading-sm">
                  {painel.titulo}
                </span>
              </span>

              {/* ── Painel FECHADO ───────────────────────────────────────────
                  Desktop: tira vertical de bone na borda esquerda, com o
                  título rotacionado — é o [writing-mode:vertical-rl] do
                  original, só que sobre superfície opaca em vez de sobre a
                  foto. Celular: o acordeão é vertical e a tira não caberia,
                  então fica uma barra baixa com o número. */}
              <span
                style={{ transition: reduzido ? undefined : `opacity 500ms ${CURVA}` }}
                className={cn(
                  /* Ancorada no rodapé em ambos, como o bottom-8 do
                     original. Altura de conteúdo: inset-y-0 com bottom-auto
                     colapsava a caixa e jogava o texto para o topo. */
                  "absolute bottom-0 left-0 flex items-center gap-3 bg-bone px-4 py-2",
                  "min-[768px]:flex-col-reverse min-[768px]:gap-4 min-[768px]:px-2 min-[768px]:py-6",
                  eAberto ? "pointer-events-none opacity-0" : "opacity-100 delay-500",
                )}
              >
                {/* Desktop mostra o título inteiro; no celular a barra é
                    baixa e fica a primeira palavra, no lugar onde o original
                    punha o número. */}
                <span className="whitespace-nowrap font-display text-body-sm font-light text-ink min-[768px]:[writing-mode:vertical-rl]">
                  <span className="min-[768px]:hidden">{primeiraPalavra(painel.titulo)}</span>
                  <span className="max-[767px]:hidden">{painel.titulo}</span>
                </span>

                {/* ⚠ A CONSTRUTORA TAMBÉM NO ESTADO FECHADO. A atribuição de
                    autoria é a razão desta galeria existir — não pode
                    depender de hover para aparecer. */}
                <span className="whitespace-nowrap text-caption uppercase tracking-[0.1em] text-gold-dk min-[768px]:[writing-mode:vertical-rl]">
                  {painel.categoria}
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
