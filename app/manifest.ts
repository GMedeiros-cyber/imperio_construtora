import type { MetadataRoute } from "next";

/* Manifest mínimo. Ele existe por UM motivo concreto: sem ele o
 * `icone-192.png` não tem quem o use, e o atalho que o Android cria na tela
 * inicial fica com o `<title>` da home como rótulo — 67 caracteres, cortados
 * em meia dúzia de letras. Com `short_name`, o atalho chama "Império".
 *
 * ⚠ display: "browser", E NÃO "standalone". Com standalone o Chrome passa a
 * oferecer "instalar aplicativo" — e este é um site institucional de três
 * páginas, não um app. Com "browser" o manifest continua dando nome, cor e
 * ícone ao atalho, e nenhum navegador propõe instalação.
 *
 * ⚠ O theme_color NÃO É O `<meta name="theme-color">`, e isso é de propósito.
 * O do manifest só vale no contexto do atalho; a meta tag pintaria a barra de
 * endereço em TODA visita. Medida a cor real dos 8px do topo de cada rota:
 *
 *   /              rgb(17, 60, 84)     o céu da foto da hero
 *   /contato       rgb(10, 10, 10)     ink
 *   /privacidade   rgb(250, 248, 242)  bone
 *
 * As três discordam, então uma meta tag única erraria em pelo menos uma — na
 * política, que é creme, a barra ficaria preta contra a página clara. Aqui o
 * ink vale porque é a cor do atalho e da marca, não da barra de ninguém.
 *
 * O background_color é o bone do <body>, que é o canvas do site.
 *
 * Os ícones vêm de scripts/gera-icones.mjs. O apple-touch-icon NÃO entra
 * aqui: o iOS lê a <link rel="apple-touch-icon"> do metadata, não o manifest.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Império Construtora",
    short_name: "Império",
    description:
      "Construção, reforma e gestão de obras em Guarulhos e São Paulo.",
    lang: "pt-BR",
    start_url: "/",
    display: "browser",
    background_color: "#FAF8F2",
    theme_color: "#0A0A0A",
    icons: [
      { src: "/icones/icone-192.png", sizes: "192x192", type: "image/png" },
    ],
  };
}
