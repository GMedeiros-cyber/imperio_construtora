import { ElasticGallery } from "@/components/ui/elastic-gallery";
import { TextoEmLinhas } from "@/components/ui/texto-em-linhas";
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
 *   faixa 3  a galeria: acordeão full-bleed a partir de 768px, carrossel
 *            arrastável abaixo disso, com o primeiro card na margem das outras
 *            faixas
 *
 * ══ O FUNDO É DELA, E É INK CHAPADO ══
 *
 * ⚠ O bg-ink MORA AQUI, e não num invólucro da page. Até esta rodada a seção
 * não tinha fundo próprio: quem pintava era um arco dourado em app/page.tsx que
 * a envolvia junto com a chamada final. O arco saiu — a página ficou com um
 * bloom só, o de cima — e o fim dela virou o mesmo #0A0A0A que já vem da faixa
 * de paralaxe, sem emenda, até o rodapé. Tirar este bg-ink reabre o creme do
 * body por baixo do texto bone.
 *
 * O texto já era o de fundo escuro (bone, ash, gold) e continua: o ink chapado
 * é mais escuro que a base do gradiente que saiu, então o contraste subiu.
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
 *
 * ══ A REVELAÇÃO EM LINHAS PARA NA FAIXA 2 ══
 *
 * Manchete, subline e as quatro formas sobem linha a linha ao entrar na tela,
 * em DOIS grupos: o cabeçalho (faixa 1) e a lista (faixa 2). O cabeçalho é um
 * grupo só porque manchete e subline são lidos juntos — no desktop estão lado a
 * lado, alinhados pela base.
 *
 * ⚠ A GALERIA DA FAIXA 3 FICA DE FORA. O ElasticGallery já tem movimento
 * próprio nos painéis; somar uma revelação por cima vira ruído, e os rótulos
 * dela são `writing-mode: vertical-rl` — texto girado dentro de máscara
 * horizontal é problema que não vale criar. O eyebrow também fica de fora, pelo
 * mesmo motivo do OQueFazemos: é um flex com o ponto dourado como item irmão.
 *
 * ⚠ O bg-ink CONTINUA ONDE ESTAVA. As máscaras das linhas são transparentes e
 * não pintam nada; tirar o bg-ink daqui reabre o creme do body por baixo do
 * texto bone, exatamente como antes.
 */
export function ComoTrabalhamos() {
  return (
    <section
      id="como-trabalhamos"
      /* ⚠ O RESPIRO DE BAIXO É MAIOR QUE O DE CIMA, E É DE PROPÓSITO.

         Abaixo desta seção vem a chamada final, que é uma FAIXA COM FOTO — e
         esta seção termina numa galeria de fotos. Com os 64px iguais dos dois
         lados, era foto, um vão curto, e foto de novo, as duas sobre o mesmo
         ink: os dois blocos colavam e liam como um só.

         O `section-lg` (112px) é o maior degrau da escala de espaçamento do
         site, e já é o que o rodapé usa embaixo. Nenhum token novo.

         ⚠ O RESPIRO ENTRA AQUI, COMO PADDING, E NÃO COMO MARGIN NA CHAMADA
         FINAL. As duas seções são `bg-ink` mas o `body` é bone: uma margem
         entre elas abriria uma tira creme no meio do bloco escuro. */
      className="flex flex-col gap-section bg-ink pt-section pb-section-lg"
    >
      {/* ── FAIXA 1: cabeçalho ─────────────────────────────────────────── */}
      <div className="grid grid-cols-12 items-end gap-3 px-gutter-sm md:px-gutter">
        <p className="col-span-full flex items-center gap-[.38rem] text-eyebrow uppercase text-gold">
          <span
            aria-hidden
            className="inline-block size-[.31rem] shrink-0 rounded-pill bg-gold"
          />
          {comoTrabalhamos.eyebrow}
        </p>

        {/* 5 de 12. A quebra em duas linhas é da copy; dentro de 5 colunas
            cada uma dessas linhas ainda quebra por conta própria — ver a
            medição no relatório da rodada. */}
        {/* `contents` no invólucro: sem ele os dois filhos abaixo virariam UM
            item do grid de 12 e perderiam as colocações. */}
        {/* ⚠ ENTRE 992 E 1079px A MANCHETE VAI ATÉ A COLUNA 7, e o parágrafo
            ocupa a 8 à 11. A 64px a palavra "responsabilidade" mede 501px e
            não cabe em 5 colunas: ela invade a calha e, MEDIDO, termina em
            x=533 enquanto o parágrafo começava em x=502 (992px) e x=532
            (1053px) — seis caixas de linha em colisão. A partir de 1080px a
            coluna 7 já começa depois dela e a grade volta ao 5 + 4 de sempre.
            ⚠ O PARÁGRAFO CONTINUA COM QUATRO COLUNAS (8 à 11), e por isso o
            col-end anda junto com o col-start. MEDIDO, contando caractere a
            caractere por caixa de linha: em três colunas a medida caía para
            20 a 24 caracteres por linha, mais estreita do que a 390px (36) e
            do que a 1080 (30) — um parágrafo mais apertado numa tela MAIOR se
            enxerga. Com quatro, 27,5 a 30, que é a mesma medida de 1080.
            Quem deslocar a coluna desloca as duas pontas.
            max-[1080px], e não 1079: o Tailwind gera `width < N`, então 1080
            é o primeiro pixel FORA. Pelo mesmo motivo o mobile é
            max-[768px]: com 767 a largura 767 ficava sem regra nenhuma. */}
        <TextoEmLinhas>
          <h2 className="col-start-1 col-end-6 mt-8 text-statement-sm text-bone max-[768px]:col-end-13 min-[768px]:text-statement-md min-[992px]:text-statement-lg min-[992px]:max-[1080px]:col-end-8">
            {comoTrabalhamos.manchete.map((linha) => (
              <span key={linha} data-revelar className="block">
                {linha}
              </span>
            ))}
          </h2>

          {/* 4 de 12, começando na 7. items-end no grid é o que alinha a base
              desta pela base da manchete. */}
          <p
            data-revelar
            className="col-start-7 col-end-11 max-w-[50ch] text-body-lg text-ash max-[768px]:col-start-1 max-[768px]:col-end-13 max-[768px]:mt-6 min-[992px]:max-[1080px]:col-start-8 min-[992px]:max-[1080px]:col-end-12"
          >
            {comoTrabalhamos.subline}
          </p>
        </TextoEmLinhas>
      </div>

      {/* ── FAIXA 2: as quatro formas, largura cheia ────────────────────
          Sem régua, sem card, sem borda: o que separa as colunas é o gap de
          3rem, e o que separa a faixa do cabeçalho é o gap-section da seção,
          que são os 64px. */}
      <TextoEmLinhas>
        <ul className="grid grid-cols-1 gap-12 px-gutter-sm md:px-gutter min-[768px]:grid-cols-2 min-[992px]:grid-cols-4">
          {modelos.map((modelo) => (
            <li key={modelo.titulo}>
              <h3 data-revelar className="font-display text-forma text-bone">
                {modelo.titulo}
              </h3>
              <p data-revelar className="mt-3 max-w-[30ch] text-body text-ash">
                {modelo.descricao}
              </p>
            </li>
          ))}
        </ul>
      </TextoEmLinhas>

      {/* ── FAIXA 3: a galeria, full-bleed ─────────────────────────────── */}
      <ElasticGallery paineis={galeriaAutoria} />
    </section>
  );
}
