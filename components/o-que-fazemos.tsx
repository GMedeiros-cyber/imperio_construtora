import { oQueFazemos } from "@/lib/dados";

/**
 * BLOCO 2 — O que fazemos
 * Funde os antigos blocos de Números e Quem somos numa seção de duas colunas.
 */
export function OQueFazemos() {
  return (
    <section
      id="sobre"
      className="bg-bone px-gutter-sm py-24 md:px-gutter"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <p className="text-caption uppercase text-graphite">
            <span
              aria-hidden
              className="mr-2 inline-block size-1 rounded-pill bg-graphite align-middle"
            />
            {oQueFazemos.eyebrow}
          </p>
          <h2 className="mt-12 max-w-[32rem] text-heading-sm text-ink md:text-heading">
            {oQueFazemos.manchete}
          </h2>
        </div>

        <div className="flex flex-col gap-12">
          <p className="max-w-[36rem] text-body text-graphite">
            {oQueFazemos.paragrafo}
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {oQueFazemos.numeros.map((numero) => (
              <div key={numero.valor} className="max-w-[200px]">
                <p className="text-heading-sm text-ink">{numero.valor}</p>
                <p className="mt-element text-caption text-graphite">
                  {numero.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
