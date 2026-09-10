import type { MetadataRoute } from "next";

import { URL_DO_SITE } from "./site";

/* Tudo liberado. Não há área privada, painel nem API para esconder: o site é
   uma home e duas páginas, e as três estão no sitemap.

   ⚠ NÃO bloqueie /_next/. O buscador precisa do CSS e do JS para renderizar a
   página como o visitante vê; bloquear ali é pedir para ser avaliado pela
   versão quebrada. A 404 não precisa de regra: o Next já a serve com noindex. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${URL_DO_SITE}/sitemap.xml`,
  };
}
