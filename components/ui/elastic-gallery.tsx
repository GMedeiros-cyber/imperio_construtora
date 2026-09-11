"use client";

import Image from "next/image";
import { useState } from "react";

import type { PainelAutoria } from "@/lib/dados";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";
import { cn } from "@/lib/utils";

/*
 * Galeria de autoria — DUAS VERTENTES, e não uma que se adapta.
 *
 * ══ POR QUE O ACORDEÃO NÃO DESCE PARA O CELULAR ══
 *
 * Acordeão por hover é interação de PONTEIRO. No toque ele vira "toque para
 * expandir", que para cinco itens é pior do que uma lista — o leitor tem de
 * descobrir que aquilo abre, tocar, esperar a transição e repetir cinco vezes
 * para ver cinco fotos que caberiam em cinco rolagens.
 *
 * E a geometria não fechava. MEDIDO a 360, 390 e 414px, antes da troca: o
 * contêiner em coluna tinha 500px para cinco painéis; o aberto comia 4 partes
 * das 8 (234px) e cada fechado ficava com 58,5px, dos quais 36px eram a tarja
 * da legenda — sobravam 22,5px de foto. E a tarja do fechado mostrava só a
 * primeira palavra do título, então "Residencial Bella Pietra" e "Residencial
 * São Marinho" liam igual. Não é um efeito apertado: é um efeito que não
 * acontece.
 *
 * Abaixo de 768px, portanto: lista vertical simples, foto em proporção fixa,
 * construtora e nome ABAIXO dela. Sem expansão, sem hover, sem texto girado.
 * De 768px para cima o acordeão continua idêntico ao que era.
 *
 * As duas vertentes são estruturas IRMÃS, alternadas por display. Não é
 * duplicação de conteúdo para o leitor de tela: `display: none` tira a outra da
 * árvore de acessibilidade, e as fotos escondidas não são nem baixadas — imagem
 * com lazy dentro de display:none nunca chega a intersectar a janela.
 *
 * ⚠ AS DUAS VERTENTES TROCAM PELA MESMA CONSULTA, min-[768px]: a lista é
 * `min-[768px]:hidden` e o acordeão é `hidden min-[768px]:flex`. Uma consulta
 * só, ligando uma e desligando a outra, não tem largura em que as duas
 * apareçam ou somem juntas. NÃO troque um dos lados por max-[767px]: são duas
 * consultas diferentes, e a fronteira entre elas vira uma fresta.
 *
 * ══ O QUE VEIO DO COMPONENTE ORIGINAL, E O QUE MUDOU ══
 *
 * Preservado no acordeão: a altura fixa do contêiner (que é o que mantém a
 * animação estável), o flex-[4] contra flex-[1] com a mesma curva e duração, o
 * zoom sutil da foto inativa, o título rotacionado nos painéis fechados e o
 * terceiro painel aberto por padrão.
 *
 * A numeração 01-05 do original SAIU, do aberto e do fechado: marcador numerado
 * só se justifica quando o conteúdo é sequência, e cinco obras são um conjunto,
 * não uma ordem.
 *
 * 1. rounded-2xl -> CANTO RETO, nas duas vertentes. O DESIGN.md manda 0px em
 *    card e imagem, e o raio de 1440px só em botão, pastilha e tag.
 *
 *    ⚠ O RAIO JÁ VOLTOU UMA VEZ SEM REGISTRO. O commit 8f03a7c devolveu o
 *    rounded-2xl dizendo que o cliente tinha mandado abandonar o DESIGN.md —
 *    mas nada disso entrou na seção "Desvios", que é onde decisão de fugir do
 *    sistema fica registrada. Sem registro lá, é regressão. Se o raio for
 *    mesmo pedido, ele entra PRIMEIRO como Desvio no DESIGN.md, com escopo, e
 *    só depois aqui.
 *
 *    O overflow-hidden do <li> do acordeão continua: é ele que prende a foto
 *    no zoom de scale-110 do painel fechado.
 *
 * 2. bg-gradient-to-t from-black/80 sobre a foto -> REMOVIDO, overlay é
 *    proibido. No acordeão o texto foi para uma FAIXA OPACA de ink; na lista
 *    do celular ele nem encosta na foto: mora ABAIXO dela, sobre o ink da
 *    seção. Faixa opaca é superfície, não véu.
 *
 *    ⚠ POR QUE NÃO DEIXAR O TEXTO SOBRE A FOTO: medido no terço inferior das
 *    cinco fotos, texto bone dentro do quadro dá de 1,53 a 4,23:1 no pior corte
 *    de cada uma — todas abaixo dos 4,5:1. Não há "área escura da própria foto"
 *    para usar: são fachadas com céu claro.
 *
 * 3. font-black uppercase -> peso 300, sem caixa alta forçada.
 *
 * 4. brightness-50 nos painéis inativos -> REMOVIDO. É filter por CSS sobre
 *    foto, que o AGENTS.md proíbe na mesma frase do overlay.
 *
 * Saíram também: o dark:, o bg-white/bg-neutral-950, o max-w-6xl (a galeria é
 * full-bleed, e container de largura máxima é proibido), o backdrop-blur da
 * pílula de categoria e a CTA "View Project", que apontaria para uma página por
 * obra que não existe aqui.
 *
 * ══ UM ACRÉSCIMO ══
 *
 * O original põe o onMouseEnter/onClick num <div>, que teclado não alcança.
 * Aqui cada painel do acordeão é <button>, com onFocus abrindo junto: navegar
 * por Tab percorre a galeria.
 */

/** O painel aberto ocupa 4 partes; cada fechado, 1. */
const PESO_ABERTO = 4;

/** Mesma curva e duração do original. */
const CURVA = "cubic-bezier(0.25, 1, 0.5, 1)";

export function ElasticGallery({ paineis }: { paineis: PainelAutoria[] }) {
  return (
    <>
      <ListaAutoria paineis={paineis} />
      <AcordeaoAutoria paineis={paineis} />
    </>
  );
}

/* ── Celular: lista vertical ──────────────────────────────────────────── */

function ListaAutoria({ paineis }: { paineis: PainelAutoria[] }) {
  return (
    /* px-gutter-sm alinha a lista com o cabeçalho e as quatro formas, que já
       usam essa margem. O full-bleed da galeria é decisão do desktop, onde o
       acordeão precisa da largura inteira para o 4-contra-1 aparecer. */
    <ul className="flex flex-col gap-10 px-gutter-sm min-[768px]:hidden">
      {paineis.map((painel) => (
        <li key={painel.numero}>
          {/* Quadrada, como as fotos do scroll horizontal de obras. As cinco
              originais são retrato (de 0,657 a 0,884), então o quadrado corta
              pouco; deitada cortaria a fachada pela metade. */}
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={painel.imagem}
              alt={painel.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* ⚠ A CONSTRUTORA VEM ANTES DO NOME, como no painel aberto do
              acordeão: a atribuição de autoria é a razão desta galeria
              existir. */}
          <p className="mt-4 text-caption uppercase tracking-[0.1em] text-gold">
            {painel.categoria}
          </p>
          <h3 className="mt-1 font-display text-subheading font-light text-bone">
            {painel.titulo}
          </h3>
        </li>
      ))}
    </ul>
  );
}

/* ── Desktop: acordeão elástico ───────────────────────────────────────── */

function AcordeaoAutoria({ paineis }: { paineis: PainelAutoria[] }) {
  /* O terceiro nasce aberto, como no original. */
  const [aberto, setAberto] = useState(paineis[2]?.numero ?? paineis[0]?.numero);
  const reduzido = useMovimentoReduzido();

  return (
    <ul className="hidden h-[600px] w-full gap-4 min-[768px]:flex">
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
                sizes="50vw"
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
                  "absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-ink px-8 py-6",
                  eAberto
                    ? "translate-y-0 opacity-100 delay-200"
                    : "pointer-events-none translate-y-full opacity-0",
                )}
              >
                <span className="truncate text-caption uppercase tracking-[0.1em] text-gold">
                  {painel.categoria}
                </span>
                <span className="truncate font-display text-heading-sm font-light text-bone">
                  {painel.titulo}
                </span>
              </span>

              {/* ── Painel FECHADO: tira vertical na borda esquerda ──────────
                  É o [writing-mode:vertical-rl] do original, só que sobre
                  superfície opaca em vez de sobre a foto. */}
              <span
                style={{ transition: reduzido ? undefined : `opacity 500ms ${CURVA}` }}
                className={cn(
                  /* Ancorada no rodapé, como o bottom-8 do original. Altura de
                     conteúdo: inset-y-0 com bottom-auto colapsava a caixa e
                     jogava o texto para o topo. */
                  "absolute bottom-0 left-0 flex flex-col-reverse items-center gap-4 bg-ink px-2 py-6",
                  eAberto ? "pointer-events-none opacity-0" : "opacity-100 delay-500",
                )}
              >
                <span className="whitespace-nowrap font-display text-body-sm font-light text-bone [writing-mode:vertical-rl]">
                  {painel.titulo}
                </span>

                {/* ⚠ A CONSTRUTORA TAMBÉM NO ESTADO FECHADO. A atribuição de
                    autoria é a razão desta galeria existir — não pode depender
                    de hover para aparecer. */}
                <span className="whitespace-nowrap text-caption uppercase tracking-[0.1em] text-gold [writing-mode:vertical-rl]">
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
