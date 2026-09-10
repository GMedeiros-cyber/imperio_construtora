"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { hero, menuHero } from "@/lib/dados";
import { IconeContato } from "@/components/icones-contato";
import { ROTA_CONTATO } from "@/lib/rotas";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";

/* ⚠ AS ÂNCORAS SÃO RESOLVIDAS AQUI, NA VIEW, e não no dado.
   `menuHero.itens` guarda âncoras cruas da home ("#obras"), e o menu agora
   aparece TAMBÉM na rota /contato, onde "#obras" apontaria para uma seção que
   não existe na própria página — o clique não faria nada. A barra na frente
   resolve as duas coisas: "/#obras" volta para a home e rola até lá.

   É a mesma função que o site-footer já aplica pelo mesmo motivo (hrefDoRodape),
   e mora na view porque lib/dados.ts não é desta sessão. Quando as duas
   puderem ser unificadas, o lugar é um helper em lib/. */
function hrefDoMenu(href: string, naHome: boolean): string {
  return href.startsWith("#") && !naHome ? `/${href}` : href;
}

const FOCAVEIS = [
  "a[href]",
  "button:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * BLOCO 1b — Menu da hero
 * Botão pill no canto superior direito e overlay de tela cheia.
 *
 * O original aplica mix-blend-mode: difference na navbar inteira. Aqui NÃO:
 * a nossa logo é dourada e o difference inverteria o ouro, quebrando a marca.
 * O contraste já está resolvido no arquivo da foto.
 */
export function MenuHero() {
  const [aberto, setAberto] = useState(false);
  const reduzido = useMovimentoReduzido();
  const idOverlay = useId();
  const naHome = usePathname() === "/";

  const nav = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const textos = useRef<HTMLSpanElement>(null);
  const icone = useRef<HTMLSpanElement>(null);
  const linhaDoTempo = useRef<gsap.core.Timeline | null>(null);

  /* Timeline de abertura, montada uma vez e pausada. */
  useEffect(() => {
    if (reduzido) return;

    const contexto = gsap.context(() => {
      const raiz = nav.current;
      if (!raiz) return;

      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(raiz, { display: "none" });
        },
      });

      tl.set(raiz, { display: "block" })
        .to(raiz, { autoAlpha: 1, duration: 0.2, ease: "none" }, 0)
        .fromTo(
          raiz.querySelectorAll("[data-painel]"),
          { yPercent: -101 },
          { yPercent: 0, duration: 0.7, stagger: 0.15, ease: "power3.out" },
          0,
        )
        .fromTo(
          raiz.querySelectorAll("[data-titulo]"),
          /* 110 e nao 100: com line-height 1 a caixa do texto e menor que o
             desenho do glifo, e 100% do proprio box deixaria a ponta das
             letras assomando acima da linha de corte. */
          { yPercent: 110 },
          { yPercent: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" },
          0.55,
        )
        .fromTo(
          raiz.querySelectorAll("[data-coluna]"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
          0.65,
        );

      linhaDoTempo.current = tl;

      /* Sonda só de desenvolvimento, para capturar quadros exatos da
         animação na verificação. Sai do build de produção. */
      if (process.env.NODE_ENV === "development") {
        (window as Window & { __menuTimeline?: gsap.core.Timeline })
          .__menuTimeline = tl;
      }
    }, nav);

    return () => {
      contexto.revert();
      linhaDoTempo.current = null;
    };
  }, [reduzido]);

  /* Abre e fecha. Com movimento reduzido não há timeline: só display e
     opacidade, sem animação nenhuma. */
  useEffect(() => {
    const raiz = nav.current;
    if (!raiz) return;

    if (reduzido || !linhaDoTempo.current) {
      gsap.set(raiz, {
        display: aberto ? "block" : "none",
        autoAlpha: aberto ? 1 : 0,
      });
      return;
    }

    if (aberto) {
      /* display e visibility precisam valer JÁ: elemento com display:none ou
         visibility:hidden não recebe foco, e o set da timeline com autoAlpha
         só valeria no primeiro tick do gsap. */
      gsap.set(raiz, { display: "block", visibility: "visible" });

      /* invalidate ANTES de tocar, e este é o ponto: a timeline é montada com
         o overlay em display:none, quando todo elemento mede zero. yPercent
         110 vira 110% de zero, ou seja, deslocamento nenhum — e os itens
         apareciam já posicionados, sem animar. Invalidar força o gsap a
         remedir agora que o overlay tem altura. */
      linhaDoTempo.current.invalidate();
      linhaDoTempo.current.play(0);
    } else {
      linhaDoTempo.current.reverse();
    }

    gsap.to(Array.from(textos.current?.children ?? []), {
      yPercent: aberto ? -100 : 0,
      duration: 0.45,
      stagger: 0.2,
      ease: "power2.out",
    });
    gsap.to(icone.current, {
      rotate: aberto ? 315 : 0,
      duration: 0.45,
      ease: "power2.out",
    });
  }, [aberto, reduzido]);

  /* Trava a rolagem do corpo enquanto o overlay está aberto. */
  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    const anteriorPad = document.body.style.paddingRight;
    /* Compensa a largura da barra de rolagem, senao a página atrás pula. */
    const barra = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (barra > 0) document.body.style.paddingRight = `${barra}px`;
    return () => {
      document.body.style.overflow = anterior;
      document.body.style.paddingRight = anteriorPad;
    };
  }, [aberto]);

  /* Escape fecha; Tab circula dentro do overlay. */
  useEffect(() => {
    if (!aberto) return;

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setAberto(false);
        botao.current?.focus();
        return;
      }
      if (evento.key !== "Tab") return;

      const alvos = nav.current?.querySelectorAll<HTMLElement>(FOCAVEIS);
      if (!alvos?.length) return;
      const primeiro = alvos[0];
      const ultimo = alvos[alvos.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", aoTeclar);

    /* Dois quadros de espera: o foco só pega depois que o overlay pintou. */
    let quadro = 0;
    quadro = requestAnimationFrame(() => {
      quadro = requestAnimationFrame(() => {
        /* preventScroll é o ponto: o li tem overflow:hidden, o que faz dele
           um contêiner rolável. Sem isso, focar o link de dentro fazia o
           navegador rolar o conteúdo para trazê-lo à vista, desfazendo o
           deslocamento e deixando o primeiro item visível antes de animar. */
        nav.current
          ?.querySelector<HTMLElement>(FOCAVEIS)
          ?.focus({ preventScroll: true });
      });
    });

    return () => {
      cancelAnimationFrame(quadro);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  const fechar = useCallback(() => {
    setAberto(false);
    botao.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={botao}
        type="button"
        aria-expanded={aberto}
        aria-controls={idOverlay}
        onClick={() => {
          setAberto((v) => !v);
          /* O clique real já foca o botão; a chamada explícita torna o
             retorno de foco determinístico também por acionamento
             programático. */
          botao.current?.focus();
        }}
        /* relative z-10 põe o botão acima do overlay, que está em z-9. Os dois
           agora moram na mesma coluna fixa (components/navegacao-fixa.tsx), que
           é quem cria o contexto de empilhamento — a ordem entre eles continua
           valendo lá dentro. Sem isso o menu abre e não há como fechar no
           clique.

           px/py/tamanho são os valores antigos mais 25%: 28→35, 14→17,5 e
           text-body-sm (14px) → text-menu (17,5px). O ícone é size-[1em] e
           acompanha a fonte sozinho: 14px → 17,5px, medido.

           cursor-pointer porque <button> não ganha a mãozinha do navegador.

           ⚠ O FUNDO INK NÃO É ENFEITE. Fixo, o botão atravessa a página
           inteira, e a página tem faixas claras: medido atrás dele, o creme do
           carrossel de marcas e as fotos claras do "Como trabalhamos" dão
           1,00:1 contra o bone — o botão simplesmente sumia. Com a pastilha em
           ink chapado o texto fica em 18,6:1 e a borda dourada em 7,0:1 em
           qualquer ponto da rolagem. É também a paleta que o cliente pediu:
           preto, dourado e a cor da letra. */
        className="relative z-10 flex shrink-0 cursor-pointer items-center gap-3 rounded-pill border border-gold bg-ink px-[35px] py-[17.5px] text-menu uppercase tracking-[0.1em] text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-lt"
      >
        <span
          ref={textos}
          className="flex h-[1.1em] flex-col items-center justify-start overflow-hidden"
        >
          <span className="block leading-[1.1]">{menuHero.abrir}</span>
          <span aria-hidden className="block leading-[1.1]">
            {menuHero.fechar}
          </span>
        </span>

        <span ref={icone} className="block size-[1em]" aria-hidden>
          <svg viewBox="0 0 12 12" className="size-full" fill="none">
            <path d="M6 0.5v11M0.5 6h11" stroke="currentColor" strokeWidth="1" />
          </svg>
        </span>
      </button>

      <div
        ref={nav}
        id={idOverlay}
        className="invisible fixed inset-0 z-[9] hidden h-screen w-full opacity-0 max-[768px]:h-[100svh]"
      >
        {/* Os painéis ficam fora do bloco que rola: dentro dele, um inset-0
            cobriria só a primeira tela do conteúdo rolado. */}
        <div className="absolute inset-0 z-0">
          <div data-painel className="absolute inset-0 bg-ink" />
          <div data-painel className="absolute inset-0 bg-ink" />
        </div>

        <div className="relative z-[1] flex h-full w-full flex-col items-start justify-between gap-[5em] overflow-auto px-8 pb-8 pt-32">
          {/* Os dois breakpoints são arbitrários de propósito. O Tailwind
              emite as media queries arbitrárias ANTES das nomeadas, então
              misturar "md:" com "min-[992px]:" faz a de 768px vencer em
              1440px. Iguais, elas se ordenam entre si pela largura. */}
          <div className="flex h-full w-full flex-col gap-3 min-[768px]:grid min-[768px]:grid-cols-[1fr_auto] min-[992px]:grid-cols-[1fr_2fr_1fr]">
            <div data-coluna className="flex flex-col items-start justify-end">
              <Image src={hero.logo} alt={hero.logoAlt} className="h-20 w-auto" />
            </div>

            <ul className="flex w-full list-none flex-col [&:hover_[data-item]]:opacity-40">
              {menuHero.itens.map((item) => (
                <li
                  key={item.href}
                  data-item
                  className="relative overflow-hidden transition-opacity duration-300 hover:opacity-100!"
                >
                  {/* O wrapper é quem desliza; a máscara é o li. O tamanho do
                      título vive no <a> para que os paddings em em escalem
                      com ele — é essa folga que impede o glifo de escapar
                      do corte, já que line-height 1 deixa a caixa menor que
                      o desenho da letra. */}
                  <div data-titulo>
                    {/* <Link> e não <a>: da rota /contato para "/#obras" o <a>
                        faria recarga completa, e a recarga come a transição de
                        fade entre as duas rotas. */}
                    <Link
                      href={hrefDoMenu(item.href, naHome)}
                      onClick={fechar}
                      className="flex w-full gap-3 pb-[.62em] pt-[.4em] text-[2.9rem] min-[768px]:text-[3.7rem] min-[992px]:text-[4.8rem]"
                    >
                      <span className="block font-display font-light leading-none text-bone">
                        {item.texto}
                      </span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>

            <div data-coluna className="flex flex-col items-stretch justify-end gap-3">
              <p className="text-caption uppercase tracking-[0.1em] text-gold">
                {menuHero.contatoRotulo}
              </p>
              {menuHero.contatoLinhas.map((linha) => {
                const conteudo = (
                  <>
                    <IconeContato tipo={linha.tipo} />
                    <span>{linha.texto}</span>
                  </>
                );

                return (
                  <p key={linha.texto} className="text-body text-bone">
                    {linha.href ? (
                      <a
                        href={linha.href}
                        onClick={fechar}
                        target={linha.href.startsWith("http") ? "_blank" : undefined}
                        rel={linha.href.startsWith("http") ? "noreferrer" : undefined}
                        className="flex items-center gap-3 transition-colors hover:text-gold-lt"
                      >
                        {conteudo}
                      </a>
                    ) : (
                      <span className="flex items-center gap-3">{conteudo}</span>
                    )}
                  </p>
                );
              })}
              <Link
                href={ROTA_CONTATO}
                onClick={fechar}
                className="mt-6 rounded-pill bg-gold px-6 py-3 text-center text-body text-ink transition-colors hover:bg-gold-lt"
              >
                {menuHero.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
