"use client";

import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { hero, menuHero } from "@/lib/dados";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";

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
          { yPercent: 100 },
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
      linhaDoTempo.current.play();
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
        nav.current?.querySelector<HTMLElement>(FOCAVEIS)?.focus();
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
        onClick={() => setAberto((v) => !v)}
        className="flex shrink-0 items-center gap-3 rounded-pill border border-bone px-7 py-[14px] text-body-sm uppercase tracking-[0.1em] text-bone"
      >
        <span
          ref={textos}
          className="flex h-[1.1em] flex-col items-end justify-start overflow-hidden"
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
            <div data-coluna className="flex flex-col items-start justify-end gap-6">
              <Image src={hero.logo} alt={hero.logoAlt} className="h-20 w-auto" />
              {/* Ash, e nao graphite: graphite e token de fundo claro e sobre
                  o ink do overlay dava 2,87:1. */}
              <p className="text-caption uppercase tracking-[0.1em] text-ash">
                {menuHero.eyebrow}
              </p>
            </div>

            <ul className="flex w-full list-none flex-col [&:hover_[data-item]]:opacity-40">
              {menuHero.itens.map((item) => (
                <li
                  key={item.href}
                  data-item
                  className="relative overflow-hidden transition-opacity duration-300 hover:opacity-100!"
                >
                  <a
                    href={item.href}
                    onClick={fechar}
                    className="flex w-full gap-[.75em] pb-[1.15em] pt-[.4em]"
                  >
                    <span data-titulo className="block text-caption text-gold" aria-hidden>
                      {item.numero}
                    </span>
                    <span
                      data-titulo
                      className="block font-light leading-none text-bone text-[2.9rem] min-[768px]:text-[3.7rem] min-[992px]:text-[4.8rem]"
                    >
                      {item.texto}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div data-coluna className="flex flex-col items-stretch justify-end gap-3">
              <p className="text-caption uppercase tracking-[0.1em] text-gold">
                {menuHero.contatoRotulo}
              </p>
              {menuHero.contatoLinhas.map((linha, indice) => (
                <p key={indice} className="text-body text-bone">
                  {linha}
                </p>
              ))}
              <a
                href="#contato"
                onClick={fechar}
                className="mt-6 rounded-pill bg-gold px-6 py-3 text-center text-body text-ink transition-colors hover:bg-gold-lt"
              >
                {menuHero.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
