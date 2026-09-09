"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";
import { PROPORCAO_ASSINATURA } from "@/components/ui/particle-wordmark";

/* ssr:false só é permitido em componente de cliente, daí este invólucro.
   O iframe carrega um documento HTML inteiro com Canvas 2D em
   requestAnimationFrame — é peso morto no fim da página e não pode entrar no
   HTML inicial. */
const ParticleWordmark = dynamic(
  () =>
    import("@/components/ui/particle-wordmark").then((m) => m.ParticleWordmark),
  { ssr: false },
);

/** Palavra chapada: fallback de movimento reduzido e reserva de espaço. */
function PalavraChapada({ visivel }: { visivel: boolean }) {
  return (
    <p
      aria-hidden={visivel ? undefined : "true"}
      className="text-center font-display text-obra-sm tracking-[0.06em] text-gold-dk min-[768px]:text-obra-md min-[992px]:text-obra-lg"
      style={visivel ? undefined : { visibility: "hidden" }}
    >
      IMPÉRIO
    </p>
  );
}

/**
 * A assinatura em partículas do fim do rodapé.
 *
 * Três caminhos, nesta ordem:
 *
 * 1. Movimento reduzido — o iframe NÃO é montado. Fica a palavra em Zodiak
 *    300, gold-dk, que é o único dourado que o AGENTS.md admite sobre o creme.
 * 2. Antes de a seção entrar em cena — nada é montado, e a caixa fica
 *    reservada com a palavra invisível, para a altura não pular depois.
 * 3. Em cena — entra o iframe. O IntersectionObserver de dentro dele pausa o
 *    desenho quando a seção sai da tela, mas o iframe em si já custa antes
 *    disso; por isso a montagem também é adiada aqui fora.
 */
export function AssinaturaParticulas() {
  const caixa = useRef<HTMLDivElement>(null);
  const [emCena, setEmCena] = useState(false);
  const reduzido = useMovimentoReduzido();

  useEffect(() => {
    const alvo = caixa.current;
    if (!alvo || reduzido) return;
    /* Sem IntersectionObserver monta assim mesmo, mas no quadro seguinte:
       setState no corpo do efeito encadeia render, e o lint reprova. */
    if (typeof IntersectionObserver === "undefined") {
      const quadro = requestAnimationFrame(() => setEmCena(true));
      return () => cancelAnimationFrame(quadro);
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        /* Uma vez montado, fica: desmontar e remontar o iframe recompila o
           documento inteiro a cada rolagem de ida e volta. */
        setEmCena(true);
        observador.disconnect();
      },
      { rootMargin: "200px" },
    );
    observador.observe(alvo);
    return () => observador.disconnect();
  }, [reduzido]);

  if (reduzido) {
    return (
      <div ref={caixa} className="mt-16">
        <PalavraChapada visivel />
      </div>
    );
  }

  return (
    <div
      ref={caixa}
      className="mt-16"
      style={{ aspectRatio: String(PROPORCAO_ASSINATURA) }}
    >
      {emCena ? (
        <>
          <ParticleWordmark />
          {/* O canvas não é texto para ninguém: buscador e leitor de tela só
              acham o nome por aqui. */}
          <span className="sr-only">Império Construtora</span>
        </>
      ) : (
        <PalavraChapada visivel={false} />
      )}
    </div>
  );
}

export default AssinaturaParticulas;
