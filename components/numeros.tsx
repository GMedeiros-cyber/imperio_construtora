import { numeros } from "@/lib/dados";

/**
 * BLOCO 4 — Números
 * Quatro colunas, gap 48px. Sem borda, sem card, sem régua.
 */
export function Numeros() {
  return (
    <section className="px-gutter-sm py-section md:px-gutter">
      <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
        {numeros.map((numero) => (
          <div key={numero.rotulo}>
            <p className="text-heading-sm text-ink md:text-heading">
              {numero.valor}
            </p>
            <p className="mt-element text-caption uppercase text-graphite">
              {numero.rotulo}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
