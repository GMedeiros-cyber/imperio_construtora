import { ArrowRight } from "lucide-react";
import Image from "next/image";

import logoMarca from "@/public/hero/logo-imperio-nav.png";
import { chamadaFinal } from "@/lib/dados";
import { ROTA_CONTATO } from "@/lib/rotas";

/**
 * BLOCO 9b — Chamada final
 *
 * Último bloco antes do rodapé, no lugar que a faixa de marcas deixou. É o
 * ponto de decisão da página, e é o único momento em que a marca aparece em
 * escala grande fora da hero.
 *
 * ══ POR QUE ESCURO ══
 *
 * A página fecha em creme: ComoTrabalhamos, depois o rodapé. Um bloco ink aqui
 * para o fluxo antes do rodapé em vez de deixá-lo escorrer, e é o "campo
 * invertido" que o DESIGN.md reserva para blocos em destaque. De quebra
 * resolve o logotipo: sobre ink vale o arquivo dourado #B79653 da hera —
 * 8,84:1 medido —, enquanto no creme só valeria o gold-dk, que é justamente o
 * que o rodapé usa logo abaixo. Assim a marca aparece duas vezes seguidas em
 * escalas, cores e fundos diferentes: aqui é assinatura, lá é colofão.
 *
 * ⚠ NÃO troque por logo-imperio-rodape.png. Aquele é o gold-dk para fundo
 * claro; sobre o ink ele apaga. Os dois arquivos coexistem de propósito —
 * ver o comentário do site-footer.
 *
 * ══ O BOTÃO É CHEIO, E OS OUTROS NÃO ══
 *
 * O da hera é contorno porque flutua sobre a foto e não pode dominá-la. Este é
 * o fim da linha: preenchido em gold com rótulo ink, igual ao envio do
 * formulário de contato. A hierarquia é intencional — contorno convida, cheio
 * conclui.
 */
export function ChamadaFinal() {
  return (
    <section className="bg-ink px-gutter-sm py-section-lg md:px-gutter">
      <Image
        src={logoMarca}
        alt="Império Construtora"
        /* 160x128 no arquivo, servido a 96px de altura: é a maior aparição da
           marca fora da hero, e o dobro do tamanho do rodapé. */
        className="h-24 w-auto"
        sizes="120px"
      />

      {/* Mais respiro acima da manchete do que abaixo: ela é o assunto, e a
          linha de apoio pertence a ela, não ao logotipo.

          ⚠ Os três degraus usam min-[]: e NÃO md:. Misturar os dois inverte a
          ordem no CSS gerado — com `md:text-heading min-[992px]:text-display` a
          manchete media 54px a 1440px, quando devia medir 84px. O resto do
          projeto já é min-[]: por isso. */}
      <h2 className="mt-16 max-w-[16ch] text-heading-sm text-bone min-[768px]:text-heading min-[992px]:text-display">
        {chamadaFinal.statement}
      </h2>

      <p className="mt-8 max-w-[52ch] text-body-lg text-ash">
        {chamadaFinal.apoio}
      </p>

      <a
        href={ROTA_CONTATO}
        className="mt-12 inline-flex h-14 items-center justify-center gap-3 rounded-pill bg-gold px-8 text-body-sm uppercase tracking-[0.1em] text-ink transition-colors hover:bg-gold-lt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
      >
        {chamadaFinal.botao}
        <ArrowRight aria-hidden className="size-4 shrink-0" strokeWidth={1} />
      </a>
    </section>
  );
}
