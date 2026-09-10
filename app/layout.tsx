import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Império Construtora",
  description:
    "Império Construtora — construção e incorporação com padrão de acabamento e entrega no prazo.",
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
