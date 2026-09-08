import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Section Title Block (DESIGN.md)
 * Eyebrow, statement 48px abaixo e, quando a seção é um carrossel de cards,
 * o cluster de setas à direita. Sem fundo, sem régua: separação só por respiro.
 *
 * `tom="escuro"` inverte as cores para a única seção escura da página.
 */
export function SectionTitleBlock({
  eyebrow,
  statement,
  setas = false,
  tom = "claro",
}: {
  eyebrow: string;
  statement: string;
  setas?: boolean;
  tom?: "claro" | "escuro";
}) {
  const escuro = tom === "escuro";

  return (
    <div className="flex items-start justify-between gap-8">
      <div>
        <p
          className={cn(
            "text-caption uppercase",
            escuro ? "text-gold" : "text-graphite",
          )}
        >
          {eyebrow}
        </p>
        {/* 34px no mobile, 54px no desktop — a faixa que o DESIGN.md define */}
        <h2
          className={cn(
            "mt-12 max-w-4xl text-heading-sm md:text-heading",
            escuro ? "text-bone" : "text-ink",
          )}
        >
          {statement}
        </h2>
      </div>

      {setas ? (
        <div className="hidden shrink-0 gap-element md:flex">
          <SetaCarrossel rotulo="Obras anteriores">
            <ChevronLeft size={16} strokeWidth={1} />
          </SetaCarrossel>
          <SetaCarrossel rotulo="Próximas obras">
            <ChevronRight size={16} strokeWidth={1} />
          </SetaCarrossel>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Carousel Arrow Control (DESIGN.md)
 * As setas ainda não navegam nada — o grid não é carrossel.
 */
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
