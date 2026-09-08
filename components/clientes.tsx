import { Fragment } from "react";

import { clientes, secaoClientes } from "@/lib/dados";
import { SectionTitleBlock } from "@/components/section-title-block";

/**
 * BLOCO 9 — Clientes
 * Lista tipográfica, sem logos: nomes em 34px peso 300 correndo em fluxo
 * horizontal, separados por " · " em ash.
 */
export function Clientes() {
  return (
    <section className="flex flex-col gap-section px-gutter-sm py-section md:px-gutter">
      <SectionTitleBlock
        eyebrow={secaoClientes.eyebrow}
        statement={secaoClientes.statement}
      />

      <p className="text-heading-sm text-ink">
        {clientes.map((nome, indice) => (
          <Fragment key={nome}>
            {indice > 0 ? <span className="text-ash"> · </span> : null}
            {nome}
          </Fragment>
        ))}
      </p>
    </section>
  );
}
