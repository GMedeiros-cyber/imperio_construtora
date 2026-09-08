import { obrasEntregues, secaoObras } from "@/lib/dados";
import { ObrasGrid } from "@/components/obras-grid";
import { SectionTitleBlock } from "@/components/section-title-block";

/** BLOCO 6 — Obras entregues: título com as setas do carrossel e o grid. */
export function ObrasEntregues() {
  return (
    <section
      id="obras"
      className="flex flex-col gap-section px-gutter-sm py-section md:px-gutter"
    >
      <SectionTitleBlock
        eyebrow={secaoObras.eyebrow}
        statement={secaoObras.statement}
        setas
      />
      <ObrasGrid itens={obrasEntregues} />
    </section>
  );
}
