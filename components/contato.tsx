import { contato } from "@/lib/dados";
import { SectionTitleBlock } from "@/components/section-title-block";

/**
 * BLOCO 10 — Contato
 * Única seção escura da página além do card de acento. Full-bleed, fundo ink,
 * 112px de padding vertical. É aqui que o dourado aparece sobre escuro.
 */
export function Contato() {
  return (
    <section
      id="contato"
      className="bg-ink px-gutter-sm py-28 md:px-gutter"
    >
      <SectionTitleBlock
        eyebrow={contato.eyebrow}
        statement={contato.statement}
        tom="escuro"
      />

      <dl className="mt-12 grid grid-cols-[auto_1fr] gap-x-8 gap-y-element text-body-lg text-bone">
        {contato.linhas.map((linha) => (
          <div key={linha.rotulo} className="contents">
            <dt>{linha.rotulo}</dt>
            <dd>{linha.valor}</dd>
          </div>
        ))}
      </dl>

      <a
        href="#"
        className="mt-8 inline-block rounded-pill bg-gold px-6 py-3 text-body text-ink transition-colors hover:bg-gold-lt"
      >
        {contato.botao}
      </a>
    </section>
  );
}
