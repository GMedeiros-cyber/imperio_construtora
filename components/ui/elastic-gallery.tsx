"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

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
 * Abaixo de 768px, portanto: foto em proporção fixa, construtora e nome ABAIXO
 * dela. Sem expansão, sem hover, sem texto girado. De 768px para cima o acordeão
 * continua idêntico ao que era.
 *
 * ══ POR QUE CARROSSEL, E NÃO A LISTA VERTICAL DE ANTES ══
 *
 * A lista resolvia a geometria, mas empilhava cinco fotos quadradas de largura
 * cheia: MEDIDO a 390px, a seção inteira tinha 3482px, e o leitor rolava cinco
 * painéis para passar de UMA seção. Agora é uma faixa horizontal de cards,
 * arrastável, com o próximo card aparecendo pela borda direita — é essa sobra
 * que ensina o gesto, sem instrução escrita.
 *
 * ⚠ É NAVEGAÇÃO, NÃO CARROSSEL AUTOMÁTICO. Não há timer, não há autoplay, nada
 * troca sozinho. Quem move a faixa é o leitor.
 *
 * ⚠ A ROLAGEM É A NATIVA DO NAVEGADOR, e não arraste por script. É isso que dá
 * de graça o toque, o trackpad, a inércia, o scroll-snap e — o mais importante
 * — a trava de eixo: num gesto diagonal o navegador decide se o dedo quer a
 * faixa ou a página, e a rolagem vertical não é sequestrada. Um onPointerMove
 * com preventDefault aqui quebraria as três coisas. O script só faz o que o
 * nativo não faz: setas do teclado, toque no indicador e o índice ativo.
 * A ÚNICA exceção é o movimento reduzido, em que inércia e deslize até a
 * parada são justamente o que não pode haver — ver o comentário em
 * CarrosselAutoria, que explica por que ali o toque é lido por pointer events
 * sob touch-action: pan-y, e por que essa é a única forma que mede certo.
 *
 * As duas vertentes são estruturas IRMÃS, alternadas por display. Não é
 * duplicação de conteúdo para o leitor de tela: `display: none` tira a outra da
 * árvore de acessibilidade, e as fotos escondidas não são nem baixadas — imagem
 * com lazy dentro de display:none nunca chega a intersectar a janela.
 *
 * ⚠ AS DUAS VERTENTES TROCAM PELA MESMA CONSULTA, min-[768px]: o carrossel é
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
 *    proibido. No acordeão o texto foi para uma FAIXA OPACA de ink; no
 *    carrossel do celular ele nem encosta na foto: mora ABAIXO dela, sobre o
 *    ink da seção. Faixa opaca é superfície, não véu.
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
      <CarrosselAutoria paineis={paineis} />
      <AcordeaoAutoria paineis={paineis} />
    </>
  );
}

/* ── Celular: carrossel de cards ──────────────────────────────────────── */

/* Nome acessível da faixa. Não aparece na tela: quem enxerga entende a faixa
   pela sobra do próximo card; quem usa leitor de tela ouve isto ao entrar. */
const ROTULO_FAIXA = "Obras com atuação técnica da Império";

function CarrosselAutoria({ paineis }: { paineis: PainelAutoria[] }) {
  const faixa = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [ativo, setAtivo] = useState(0);
  const reduzido = useMovimentoReduzido();

  /* Onde a faixa tem de parar para o card `i` encostar na margem esquerda — a
     mesma conta que o scroll-snap faz: o offsetLeft do card menos o
     scroll-padding. Limitado ao fim da faixa, porque o último card não tem
     como encostar na margem: a faixa acaba antes. */
  const paradaDe = useCallback((i: number) => {
    const el = faixa.current;
    const card = cards.current[i];
    if (!el || !card) return 0;
    const recuo = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    return Math.min(card.offsetLeft - recuo, el.scrollWidth - el.clientWidth);
  }, []);

  /* O card cuja parada está mais perto de uma posição da faixa. */
  const maisProximoDe = useCallback(
    (posicao: number) => {
      let melhor = 0;
      let menor = Infinity;
      cards.current.forEach((_, i) => {
        const distancia = Math.abs(paradaDe(i) - posicao);
        /* `<=`: se duas paradas empatam no fim da faixa, vence a última. */
        if (distancia <= menor) {
          menor = distancia;
          melhor = i;
        }
      });
      return melhor;
    },
    [paradaDe],
  );

  const irPara = useCallback(
    (i: number) => {
      const el = faixa.current;
      if (!el) return;
      el.scrollTo({
        left: paradaDe(i),
        /* Movimento reduzido: o salto é imediato, sem deslizar. */
        behavior: reduzido ? "instant" : "smooth",
      });
    },
    [paradaDe, reduzido],
  );

  /* ── Movimento reduzido: o arraste por toque deixa de ser nativo ──────
     A rolagem nativa vem com duas animações que a preferência pede para não
     existir: a inércia depois que o dedo solta e o deslize até a parada. Não
     há CSS que desligue nenhuma das duas, e um scrollTo no touchend NÃO
     resolve: MEDIDO, o compositor do Chrome soma o delta do encaixe dele ao
     salto do script e a faixa para em 445 em vez de 305.
     Então, SÓ no movimento reduzido, a faixa ganha touch-action: pan-y e o
     dedo é lido por pointer events: a faixa anda exatamente o que o dedo
     andou, e ao soltar pula NA HORA para a parada mais perto. O pan-y é o que
     preserva a trava de eixo: o gesto vertical (e o diagonal) continua com o
     navegador, que rola a página e manda um pointercancel para cá.
     ⚠ O Chrome encaixa até rolagem PROGRAMÁTICA (scrollLeft = 100 lê 0 no
     mesmo instante). Por isso o snap é desligado enquanto o dedo está na
     faixa e religado ao soltar. Mouse fica de fora: não arrasta faixa. */
  const arrasto = useRef<{ x: number; inicio: number } | null>(null);

  const aoTocar = (e: PointerEvent<HTMLDivElement>) => {
    const el = faixa.current;
    if (!reduzido || !el || e.pointerType === "mouse") return;
    arrasto.current = { x: e.clientX, inicio: el.scrollLeft };
    el.style.scrollSnapType = "none";
  };
  const aoArrastar = (e: PointerEvent<HTMLDivElement>) => {
    const el = faixa.current;
    const a = arrasto.current;
    if (!el || !a) return;
    el.scrollLeft = a.inicio - (e.clientX - a.x);
  };
  const aoSoltar = () => {
    const el = faixa.current;
    if (!el || !arrasto.current) return;
    arrasto.current = null;
    el.style.scrollSnapType = "";
    irPara(maisProximoDe(el.scrollLeft));
  };

  /* O índice ativo sai da POSIÇÃO da faixa, e não de um estado que o script
     empurra: quem arrasta com o dedo não passa pelo script, e o indicador tem
     de acompanhar mesmo assim. Um cálculo por quadro, no máximo. */
  useEffect(() => {
    const el = faixa.current;
    if (!el) return;

    let quadro = 0;
    const medir = () => {
      quadro = 0;
      setAtivo(maisProximoDe(el.scrollLeft));
    };
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(medir);
    };

    el.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      el.removeEventListener("scroll", aoRolar);
      cancelAnimationFrame(quadro);
    };
  }, [maisProximoDe]);

  /* Setas e Home/End. Com o foco na FAIXA, elas só rolam; com o foco num
     CARD, o foco anda junto — senão a próxima Tab voltaria para o card de onde
     a seta saiu. */
  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const ultimo = paineis.length - 1;
    const doCard = cards.current.findIndex((card) => card === e.target);
    const origem = doCard >= 0 ? doCard : ativo;

    let destino: number;
    if (e.key === "ArrowRight") destino = Math.min(origem + 1, ultimo);
    else if (e.key === "ArrowLeft") destino = Math.max(origem - 1, 0);
    else if (e.key === "Home") destino = 0;
    else if (e.key === "End") destino = ultimo;
    else return;

    e.preventDefault();
    if (doCard >= 0) cards.current[destino]?.focus({ preventScroll: true });
    irPara(destino);
  };

  return (
    <div className="min-[768px]:hidden">
      {/* ── A faixa ──────────────────────────────────────────────────────
          overflow-x nela, e não na página: a faixa rola, a página não.
          ⚠ overscroll-x-contain: no fim da faixa o arraste horizontal para
          ali, em vez de vazar para o gesto de voltar página do navegador. Só
          no eixo x — o y continua encadeando para a página: MEDIDO, o toque
          vertical e o quase vertical sobre a faixa rolam a página (225px) e
          a faixa não sai do lugar; a roda vertical também (240px).
          O preço, medido: com a roda do trackpad em DIAGONAL (3,20) o Chrome
          trava a sequência inteira na faixa e não passa o y para a página —
          mas isso ele faz com QUALQUER overflow-x (fixture puro: 36px na
          faixa, 0 na página); o contain só acrescenta o caso do fim da
          faixa, onde sem ele o y passaria. Fica: voltar página sem querer
          é pior do que uma sequência de roda diagonal perdida.
          @container: a largura do card é em cqw, fração da FAIXA. Em % ela
          seria fração do <ul>, que é w-max e mede o próprio conteúdo —
          referência circular. */}
      <div
        ref={faixa}
        role="region"
        aria-roledescription="carrossel"
        aria-label={ROTULO_FAIXA}
        tabIndex={0}
        onKeyDown={aoTeclar}
        onPointerDown={aoTocar}
        onPointerMove={aoArrastar}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        className={cn(
          "@container relative snap-x snap-mandatory scroll-px-gutter-sm overflow-x-auto overscroll-x-contain [scrollbar-width:none] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold [&::-webkit-scrollbar]:hidden",
          reduzido && "touch-pan-y",
        )}
      >
        {/* py-2: a faixa corta nos dois eixos (overflow-x auto obriga o y a
            cortar também), e o anel de foco do card fica 4px FORA dele. Sem
            estes 8px o anel sairia serrado em cima e embaixo. */}
        <ul className="flex w-max gap-3 px-gutter-sm py-2">
          {paineis.map((painel, i) => (
            <li
              key={painel.numero}
              ref={(no) => {
                cards.current[i] = no;
              }}
              /* Card alcançável por Tab. Não é link — não existe página por
                 obra —, então é o próprio <li> que recebe o foco. */
              tabIndex={0}
              onFocus={() => irPara(i)}
              /* 75% da faixa deixa 1/4 para o próximo card aparecer pela
                 borda. O teto de 24rem segura a foto entre 512 e 767px, onde
                 75% daria um card de 575px de largura por 719 de altura.
                 ⚠ O TETO NÃO DESCE DE 24rem: abaixo disso, a 767px, o quarto
                 card deixa de ter parada própria (a faixa acaba antes de ele
                 encostar na margem) e o indicador pula do 3 para o 5. */
              className="w-[min(75cqw,24rem)] shrink-0 snap-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {/* 4:5, retrato. As cinco originais vão de 0,657 a 0,884, então
                  4:5 (0,8) corta pouco em qualquer uma; o quadrado da lista
                  anterior deixava a foto mais baixa do que ela é. */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={painel.imagem}
                  alt={painel.alt}
                  fill
                  sizes="(min-width: 512px) 384px, 75vw"
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
      </div>

      {/* ── O indicador ──────────────────────────────────────────────────
          Cinco traços na margem esquerda, alinhados com o texto. O ativo é
          GOLD E MAIS GROSSO (3px contra 1px): a espessura é o sinal que não
          depende de cor.
          Cada traço é um botão de 44x44 — tocar leva ao card. Fora da ordem
          de Tab e da árvore de acessibilidade DE PROPÓSITO: é atalho de
          ponteiro. Pelo teclado a faixa já anda com as setas e cada card já
          é uma parada de Tab; cinco paradas a mais só alongariam o caminho. */}
      <div aria-hidden className="mt-2 flex px-gutter-sm">
        {paineis.map((painel, i) => (
          <button
            key={painel.numero}
            type="button"
            tabIndex={-1}
            onClick={() => irPara(i)}
            className="flex size-11 shrink-0 cursor-pointer items-center"
          >
            <span
              className={cn(
                "block w-9",
                !reduzido && "transition-[height,background-color] duration-300",
                i === ativo ? "h-[3px] bg-gold" : "h-px bg-ash",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Desktop: acordeão elástico ───────────────────────────────────────── */

function AcordeaoAutoria({ paineis }: { paineis: PainelAutoria[] }) {
  /* O terceiro nasce aberto, como no original. */
  const [aberto, setAberto] = useState(paineis[2]?.numero ?? paineis[0]?.numero);
  const reduzido = useMovimentoReduzido();

  return (
    /* ⚠ A CALHA LATERAL ESTAVA FALTANDO AQUI. A faixa era full-bleed, colada
       nas duas bordas da tela, e a tira vertical do painel fechado tem `px-2`
       — medido, o texto saía a 9,0px da borda esquerda em 768, 992, 1440 e
       1920px, contra os 32px que toda outra seção do site respeita.

       Full-bleed vale para FOTO. Texto encostado na borda é texto que a mão
       cobre no toque e que o olho lê espremido. */
    <ul className="hidden h-[600px] w-full gap-4 px-gutter min-[768px]:flex">
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
