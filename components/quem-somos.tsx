import { quemSomos } from "@/lib/dados";
import { SectionTitleBlock } from "@/components/section-title-block";

/**
 * BLOCO 5 — Quem somos
 * Section Title Block e, 32px abaixo, o parágrafo em duas colunas iguais.
 */
export function QuemSomos() {
  return (
    <section className="px-gutter-sm py-section md:px-gutter">
      <SectionTitleBlock
        eyebrow={quemSomos.eyebrow}
        statement={quemSomos.statement}
      />

      <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
        {quemSomos.colunas.map((coluna) => (
          <p key={coluna} className="text-body text-graphite">
            {coluna}
          </p>
        ))}
      </div>
    </section>
  );
}
