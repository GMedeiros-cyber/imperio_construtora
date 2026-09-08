import { participacaoTecnica, secaoParticipacao } from "@/lib/dados";
import { ObrasGrid } from "@/components/obras-grid";
import { SectionTitleBlock } from "@/components/section-title-block";

/**
 * BLOCO 7 — Participação técnica
 * Mesma fileira de 3 cards do bloco 6. Nenhum card de acento aqui: só um por
 * página, e ele está no bloco 6.
 */
export function ParticipacaoTecnica() {
  return (
    <section className="flex flex-col gap-section px-gutter-sm py-section md:px-gutter">
      <SectionTitleBlock
        eyebrow={secaoParticipacao.eyebrow}
        statement={secaoParticipacao.statement}
      />
      <ObrasGrid itens={participacaoTecnica} />
    </section>
  );
}
