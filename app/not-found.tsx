import type { Metadata } from "next";
import Link from "next/link";

import { ROTA_CONTATO } from "@/lib/rotas";

import { OPEN_GRAPH_BASE } from "./site";

export const metadata: Metadata = {
  title: "Página não encontrada — Império Construtora",
  description:
    "Este endereço não existe no site da Império Construtora. Volte ao início ou fale com a gente pela página de contato.",
  /* Sem canonical e sem og:url. O layout declara "./" nos dois, e aqui "./"
     resolve para /_not-found, o caminho interno do Next — medido no HTML
     gerado. O openGraph é redeclarado a partir da base para manter a imagem,
     porque declarar qualquer campo dele descarta o do layout inteiro. A 404 já
     sai com noindex, que o Next injeta sozinho. */
  alternates: { canonical: null },
  openGraph: OPEN_GRAPH_BASE,
};

/* A 404. Um pôster, não uma página de erro.

   O mesmo gesto do resto do site: canvas bone, uma manchete grande em Zodiak
   300, uma linha de apoio em graphite e dois caminhos. Nada de ilustração,
   número 404 gigante ou piada — o DESIGN.md pede economia, e quem caiu aqui só
   precisa saber onde está e para onde ir.

   ⚠ SEM LOGO. A única que existe é a dourada #B79653, e dourado sobre o creme
   reprova (2,7:1). O "Voltar ao início" faz o papel que a logo faria.

   ⚠ SEM NAVEGAÇÃO FIXA E SEM RODAPÉ. A navegação desta página são os dois
   links, e o rodapé é ink: meia tela preta embaixo de uma página de uma frase.

   A manchete desce na escala de tokens por largura (34 -> 54 -> 84px), o desvio
   1 do DESIGN.md, e fica em no máximo duas linhas em todas as larguras.

   O conteúdo assenta na BASE da tela, como a manchete da hero: o vazio fica em
   cima, e os dois links caem na zona do polegar no celular. */
export default function NaoEncontrada() {
  return (
    <main className="flex min-h-svh flex-col justify-end px-gutter py-section max-[479px]:px-gutter-sm">
      <h1 className="max-w-[14ch] text-heading-sm md:text-heading xl:text-display">
        Esta página não existe.
      </h1>
      <p className="mt-8 max-w-[44ch] text-body-lg text-graphite">
        O endereço pode ter mudado ou nunca ter existido. Volte ao início ou
        fale com a gente.
      </p>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-pill bg-ink px-7 text-body-sm uppercase tracking-[0.1em] text-bone transition-colors hover:bg-graphite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Voltar ao início
        </Link>
        <Link
          href={ROTA_CONTATO}
          className="inline-flex h-12 items-center justify-center rounded-pill border border-ink px-7 text-body-sm uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Ir para o contato
        </Link>
      </div>
    </main>
  );
}
