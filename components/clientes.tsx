import { LogoCloud } from "@/components/ui/logo-cloud";
import { SectionTitleBlock } from "@/components/section-title-block";
import { secaoClientes } from "@/lib/dados";
import { logosClientes } from "@/lib/logos";

/**
 * BLOCO 9 — Clientes
 * Saiu a lista tipográfica de nomes e entrou o grid de logos: 2 colunas no
 * mobile, 4 no desktop, com hairline entre as células. As logos vivem em
 * lib/logos.ts, não aqui.
 */
export function Clientes() {
  return (
    <section className="flex flex-col gap-section px-gutter-sm py-section md:px-gutter">
      <SectionTitleBlock
        eyebrow={secaoClientes.eyebrow}
        statement={secaoClientes.statement}
      />

      <LogoCloud logos={logosClientes} />
    </section>
  );
}
