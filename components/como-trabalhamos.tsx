import { ElasticGallery } from "@/components/ui/elastic-gallery";
import { comoTrabalhamos, galeriaAutoria, modelos } from "@/lib/dados";

/**
 * BLOCO — Como trabalhamos
 *
 * Esta seção substitui TRÊS que existiam antes: ObrasEntregues,
 * ParticipacaoTecnica e a versão anterior de ComoTrabalhamos.
 *
 * ══ POR QUE AS OUTRAS DUAS SAÍRAM ══
 *
 * O "+100 lojas e unidades comerciais entregues" já aparece na lista de
 * números do OQueFazemos, e o ObrasEntregues mostrava Artwalk, PETZ e Boali —
 * as MESMAS três obras do scroll horizontal, duas seções acima. Era o mesmo
 * conteúdo dito três vezes.
 *
 * O que não se repete em lugar nenhum, e é o que esta seção carrega: a
 * distinção de autoria, as quatro formas de contratar e as obras de
 * participação técnica.
 *
 * ══ A ATRIBUIÇÃO ══
 *
 * As cinco obras da galeria são de OUTRAS construtoras. Isso não é resolvido
 * com um rótulo de aviso: a categoria de cada painel É a construtora
 * responsável, então quem lê vê de quem é a obra ao lado do nome dela. A
 * subline diz o resto — que nesses casos a atuação foi técnica.
 */
export function ComoTrabalhamos() {
  return (
    <section
      id="como-trabalhamos"
      className="flex flex-col gap-section py-section"
    >
      {/* ⚠ A MANCHETE OCUPA A LARGURA INTEIRA, e não a metade esquerda.

          Medido: a 4rem, "Uma só responsabilidade técnica." precisa de 962px
          numa linha. Em grade de duas colunas a coluna esquerda dá 633px a
          1440 e 873px a 1920 — a linha quebra em qualquer largura nossa, e a
          manchete de duas linhas virava sete. Com a largura inteira ela cabe
          em duas a partir de 992px.

          O escalonamento — cabeçalho em cima, informação recuada à direita —
          é o mesmo padrão do OQueFazemos, então a seção não fica órfã de
          estilo. A galeria abaixo é full-bleed, por isso o padding lateral
          vive aqui e não na seção. */}
      <div className="flex flex-col gap-12 px-gutter-sm md:px-gutter">
        <div>
          <p className="flex items-center gap-[.38rem] whitespace-nowrap text-eyebrow uppercase text-ink">
            <span
              aria-hidden
              className="inline-block size-[.31rem] shrink-0 rounded-pill bg-ink"
            />
            {comoTrabalhamos.eyebrow}
          </p>

          <h2 className="mt-6 text-statement-sm text-ink min-[768px]:text-statement-md min-[992px]:text-statement-lg">
            {comoTrabalhamos.manchete.map((linha) => (
              <span key={linha} className="block">
                {linha}
              </span>
            ))}
          </h2>
        </div>

        <div className="flex flex-col gap-10 min-[900px]:ml-[50%] min-[900px]:pl-12">
          <p className="max-w-[54ch] text-body-lg text-graphite">
            {comoTrabalhamos.subline}
          </p>

          <ul className="flex flex-col gap-8">
            {modelos.map((modelo) => (
              <li key={modelo.titulo}>
                <h3 className="text-subheading font-light text-ink">
                  {modelo.titulo}
                </h3>
                <p className="mt-2 max-w-[60ch] text-body-sm text-graphite">
                  {modelo.descricao}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full-bleed: largura inteira, sem gutter. */}
      <ElasticGallery paineis={galeriaAutoria} />
    </section>
  );
}
