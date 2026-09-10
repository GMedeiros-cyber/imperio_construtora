import type { Metadata } from "next";
import "./globals.css";

import { OPEN_GRAPH_BASE, URL_DO_SITE } from "./site";

/* ══ METADATA — O LAYOUT DÁ A MOLDURA, CADA ROTA DÁ O TEXTO ══

   title e description daqui valem para a HOME. /contato, /privacidade e a 404
   declaram os seus no próprio arquivo.

   ⚠ O openGraph NÃO TEM title NEM description, E ISSO É O PONTO. O Next herda
   o openGraph do layout inteiro para toda rota que não declara o seu — e, com
   os dois campos vazios, preenche og:title e og:description com o title e o
   description DA ROTA (resolve-metadata.js, inheritFromMetadata). O twitter
   é preenchido a partir daí, imagem incluída. Se alguém escrever um title no
   openGraph daqui, TODAS as rotas passam a ser compartilhadas com o título da
   home.

   ⚠ canonical E og:url SÃO "./", E NÃO "/". Um caminho relativo com ponto é
   resolvido contra o pathname de cada rota; "/" faria /contato e /privacidade
   se declararem cópias da home. */
export const metadata: Metadata = {
  metadataBase: new URL(URL_DO_SITE),
  title: "Império Construtora — construção e reforma em Guarulhos e São Paulo",
  description:
    "Construção, reforma e gestão de obras para varejo, corporativo, residencial e industrial em Guarulhos e São Paulo. Equipe própria e prazo fechado em contrato.",
  alternates: { canonical: "./" },
  openGraph: { ...OPEN_GRAPH_BASE, url: "./" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* ⚠ data-scroll-behavior="smooth" É O PAR DO `scroll-behavior: smooth` DO
       app/globals.css. Com ele o Next desliga a suavidade SÓ durante a troca
       de rota; âncora dentro da mesma página continua suave. Sem ele, medido a
       390px: do rodapé da home para /contato a rota nova nascia em y=1984 e
       rolava de volta ao topo por 749ms; do rodapé de /contato para / a home
       ficava parada em y=1812, porque o ScrollTrigger montava no meio da
       rolagem suave e restaurava a posição que leu. */
    <html lang="pt-BR" className="h-full" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        {/* Switzer e Zodiak, 300/400, via Fontshare — a licença ITF não permite
            auto-hospedar nenhuma das duas. */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=switzer@300,400&f[]=zodiak@300,400&display=swap"
        />
      </head>
      <body className="min-h-full bg-bone text-ink">{children}</body>
    </html>
  );
}
