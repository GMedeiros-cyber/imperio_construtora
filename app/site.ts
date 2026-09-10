import type { Metadata } from "next";

/* O endereço público do site, para tudo o que precisa de URL absoluta: o
   metadataBase do layout (canonical, og:url, og:image), o robots, o sitemap e
   o JSON-LD.

   ⚠ O DOMÍNIO AINDA NÃO ESTÁ CONFIRMADO. imperioconstrutora.com.br é o domínio
   do e-mail da empresa e resolve no DNS, mas em setembro de 2026 não servia
   site nenhum, nem com nem sem www. Se o site subir em outro endereço — ou só
   com www —, é aqui que muda, e o canonical de todas as rotas muda junto.

   SITE_URL sobrepõe o valor no build: serve para uma prévia (Vercel, túnel) que
   precise de og:image e canonical apontando para ela mesma. Sem barra no fim. */
export const URL_DO_SITE = process.env.SITE_URL ?? "https://imperioconstrutora.com.br";

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
