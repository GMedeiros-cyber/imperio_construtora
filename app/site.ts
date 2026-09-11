import type { Metadata } from "next";

/* O endereço público do site, para tudo o que precisa de URL absoluta: o
   metadataBase do layout (canonical, og:url, og:image), o robots, o sitemap e
   o JSON-LD.

   ⚠ COM www, E O DOMÍNIO É construtoraimperio.com — NÃO imperioconstrutora.com.br.
   O valor antigo era o segundo, e ele não serve o site: todas as rotas
   declaravam como canônica uma URL de outro domínio. Medido em 11/09/2026, com
   navegador de verdade (o curl do Windows usa schannel e reprova o apex antes
   de chegar ao HTTP):

     https://www.construtoraimperio.com     200, É O SITE, cert válido, Vercel
     https://construtoraimperio.com         200, mas é a página "Parked Domain
                                            name on Hostinger DNS system"
     http://construtoraimperio.com          ora 308 para o https do apex (Vercel),
                                            ora a mesma página estacionada
     https://imperioconstrutora.com.br      ERR_CERT_COMMON_NAME_INVALID
     http://imperioconstrutora.com.br       302 para o www, e o www devolve 503
                                            "Site em construção"

   ⚠ O APEX ESTÁ COM DNS DIVIDIDO, e é por isso que ele responde duas coisas
   diferentes: construtoraimperio.com tem DOIS registros A — 216.198.79.1
   (Vercel) e 2.57.91.91 (Hostinger). Metade das visitas cai no site, a outra
   metade na página estacionada. O www é CNAME para vercel-dns e responde uma
   coisa só.

   Enquanto o apex não for arrumado no registrador (tirar o A da Hostinger e
   deixar só o redirecionamento para o www), o www é o único endereço que
   devolve o site de forma consistente e com certificado válido — então é ele o
   canônico. Arrumado o apex, a escolha entre os dois volta a ser preferência, e
   é aqui que muda.

   SITE_URL sobrepõe o valor no build: serve para uma prévia (Vercel, túnel) que
   precise de og:image e canonical apontando para ela mesma. Sem barra no fim. */
export const URL_DO_SITE = process.env.SITE_URL ?? "https://www.construtoraimperio.com";

/* O openGraph comum a todas as rotas, SEM url, title e description.

   Mora aqui, e não só no layout, porque a 404 precisa dele sem o `url: "./"`
   do layout: numa URL inválida o "./" vira /_not-found, o caminho interno do
   Next. O openGraph é substituído inteiro quando uma rota declara o seu (a
   mescla é rasa), então quem declara parte daqui para não perder a imagem.

   A imagem é gerada por scripts/gera-og.mjs: a foto da hero com a logo no
   canto, contraste da logo medido no arquivo final. */
export const OPEN_GRAPH_BASE = {
  type: "website",
  locale: "pt_BR",
  siteName: "Império Construtora",
  images: [
    {
      url: "/og/imperio-og.jpg",
      width: 1200,
      height: 630,
      type: "image/jpeg",
      alt: "Fachada de residência contemporânea ao entardecer, com a logo da Império Construtora no canto inferior esquerdo.",
    },
  ],
} satisfies Metadata["openGraph"];
