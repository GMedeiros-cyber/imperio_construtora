import { modelos, secaoModelos, tipologias } from "@/lib/dados";
import { SectionTitleBlock } from "@/components/section-title-block";
import { TagPill } from "@/components/tag-pill";

/**
 * BLOCO 8 — Como trabalhamos
 * Grid de 4 colunas sem imagem, sem card, sem borda; e 32px abaixo a linha de
 * tag pills com as tipologias.
 */
export function ComoTrabalhamos() {
  return (
    <section className="flex flex-col gap-section px-gutter-sm py-section md:px-gutter">
      <SectionTitleBlock
        eyebrow={secaoModelos.eyebrow}
        statement={secaoModelos.statement}
      />

      <div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {modelos.map((modelo) => (
            <div key={modelo.titulo}>
              <h3 className="text-subheading font-light text-ink">
                {modelo.titulo}
              </h3>
              <p className="mt-element text-body-sm text-graphite">
                {modelo.descricao}
              </p>
            </div>
          ))}
        </div>

        <ul className="mt-8 flex flex-wrap gap-element">
          {tipologias.map((tipologia) => (
            <TagPill key={tipologia}>{tipologia}</TagPill>
          ))}
        </ul>
      </div>
    </section>
  );
}
