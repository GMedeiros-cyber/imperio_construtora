import { ChevronLeft, ChevronRight } from "lucide-react";

import { secaoObras } from "@/lib/dados";

/**
 * BLOCO 4 — Section Title Block
 * Eyebrow, headline 48px abaixo e o cluster de setas à direita da linha do
 * título. Sem fundo, sem régua: separação só por respiro.
 *
 * As setas ainda não navegam nada — o bloco 5 é grid, não carrossel.
 */
export function SectionTitleBlock() {
  return (
    <div className="flex items-start justify-between gap-8 px-gutter-sm md:px-gutter">
      <div>
        <p className="text-caption uppercase text-graphite">{secaoObras.eyebrow}</p>
        {/* 34px no mobile, 54px no desktop — ambos dentro da faixa do DESIGN.md */}
        <h2 className="mt-12 max-w-4xl text-heading-sm text-ink md:text-heading">
          {secaoObras.headline}
        </h2>
      </div>

      <div className="hidden shrink-0 gap-element md:flex">
        <SetaCarrossel rotulo="Obras anteriores">
          <ChevronLeft size={16} strokeWidth={1} />
        </SetaCarrossel>
        <SetaCarrossel rotulo="Próximas obras">
          <ChevronRight size={16} strokeWidth={1} />
        </SetaCarrossel>
      </div>
    </div>
  );
}

function SetaCarrossel({
  rotulo,
  children,
}: {
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      className="flex size-8 items-center justify-center rounded-pill border border-ash text-ink transition-colors hover:border-ink"
    >
      {children}
    </button>
  );
}
