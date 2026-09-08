import { cabecalho } from "@/lib/dados";

/**
 * BLOCO 1 — Header Lockup
 * Sem fundo próprio: o creme da página é o fundo do header. Full-bleed,
 * ~16px de padding vertical.
 */
export function HeaderLockup() {
  return (
    <header className="flex items-center gap-4 px-gutter-sm py-4 md:gap-6 md:px-gutter">
      <p className="min-w-0 text-caption uppercase text-ink">
        {cabecalho.eyebrow.map((linha) => (
          <span key={linha} className="block">
            {linha}
          </span>
        ))}
      </p>

      {/* Marca circular de 32px — a coroa entra depois em SVG */}
      <span
        aria-label="Império Construtora"
        className="flex size-8 shrink-0 items-center justify-center rounded-pill border border-ash text-caption text-ink"
      >
        {cabecalho.marca}
      </span>

      <button
        type="button"
        className="ml-auto shrink-0 rounded-pill bg-ink px-6 py-3 text-body text-bone"
      >
        {cabecalho.menu}
      </button>
    </header>
  );
}
