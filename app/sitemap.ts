import type { MetadataRoute } from "next";

import { ROTA_CONTATO } from "@/lib/rotas";

import { URL_DO_SITE } from "./site";

/* As três rotas do site. Rota nova entra aqui na mão — o sitemap não descobre
   páginas sozinho.

   ⚠ SEM lastModified. new Date() carimbaria a data do build em todas as rotas
   a cada deploy, mesmo sem mudança de conteúdo, e o Google passa a ignorar um
   lastmod que mente. Sem data real por página, melhor nenhuma.
   changeFrequency e priority também ficam de fora: o Google declara que ignora
   os dois. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: URL_DO_SITE },
    { url: `${URL_DO_SITE}${ROTA_CONTATO}` },
    { url: `${URL_DO_SITE}/privacidade` },
  ];
}
