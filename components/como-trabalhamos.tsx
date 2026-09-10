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
 * ══ TRÊS FAIXAS, E NÃO DUAS COLUNAS ══
 *
 * ⚠ NÃO volte a dividir o conteúdo por coluna. A divisão é por FUNÇÃO:
 *
 *   faixa 1  cabeçalho — eyebrow, manchete e subline num grid de 12
 *   faixa 2  as quatro formas, LARGURA CHEIA em quatro colunas
 *   faixa 3  a galeria, full-bleed
 *
 * A manchete sozinha não tem massa para sustentar metade de uma seção
 * full-bleed, e as quatro formas são o conteúdo comercial mais importante da
 * página: em coluna estreita a 12px elas leem como nota de rodapé. O compasso
 * é o mesmo do OQueFazemos — manchete à esquerda, informação à direita, linha
 * de itens embaixo — e a repetição é intencional.
 *
 * ══ A ATRIBUIÇÃO ══
 *
 * As cinco obras da galeria são de OUTRAS construtoras. Isso não é resolvido
 * com um rótulo de aviso: a categoria de cada painel É a construtora
 * responsável, e aparece tanto no painel aberto quanto no fechado. A subline
 * diz o resto — que nesses casos a atuação foi técnica.
 */
export function ComoTrabalhamos() {
  return (
    <section
      id="como-trabalhamos"
      className="flex flex-col gap-section py-section"
    >
      {/* ── FAIXA 1: cabeçalho ─────────────────────────────────────────── */}
      <div className="grid grid-cols-12 items-end gap-3 px-gutter-sm md:px-gutter">
        <p className="col-span-full flex items-center gap-[.38rem] whitespace-nowrap text-eyebrow uppercase text-gold">
          <span
            aria-hidden
            className="inline-block size-[.31rem] shrink-0 rounded-pill bg-gold"
          />
          {comoTrabalhamos.eyebrow}
        </p>

        {/* 5 de 12. A quebra em duas linhas é da copy; dentro de 5 colunas
            cada uma dessas linhas ainda quebra por conta própria — ver a
            medição no relatório da rodada. */}
        <h2 className="col-start-1 col-end-6 mt-8 text-statement-sm text-bone max-[767px]:col-end-13 min-[768px]:text-statement-md min-[992px]:text-statement-lg">
          {comoTrabalhamos.manchete.map((linha) => (
            <span key={linha} className="block">
              {linha}
            </span>
          ))}
        </h2>

        {/* 4 de 12, começando na 7. items-end no grid é o que alinha a base
            desta pela base da manchete. */}
        <p className="col-start-7 col-end-11 max-w-[50ch] text-body-lg text-ash max-[767px]:col-start-1 max-[767px]:col-end-13 max-[767px]:mt-6">
          {comoTrabalhamos.subline}
        </p>
      </div>

      {/* ── FAIXA 2: as quatro formas, largura cheia ────────────────────
          Sem régua, sem card, sem borda: o que separa as colunas é o gap de
          3rem, e o que separa a faixa do cabeçalho é o gap-section da seção,
          que são os 64px. */}
      <ul className="grid grid-cols-1 gap-12 px-gutter-sm md:px-gutter min-[768px]:grid-cols-2 min-[992px]:grid-cols-4">
        {modelos.map((modelo) => (
          <li key={modelo.titulo}>
            <h3 className="font-display text-forma text-bone">{modelo.titulo}</h3>
            <p className="mt-3 max-w-[30ch] text-body text-ash">
              {modelo.descricao}
            </p>
          </li>
        ))}
      </ul>

      {/* ── FAIXA 3: a galeria, full-bleed ─────────────────────────────── */}
      <ElasticGallery paineis={galeriaAutoria} />
    </section>
  );
}
