import type { Metadata } from "next";
import "./globals.css";

import { WhatsappFlutuante } from "@/components/whatsapp-flutuante";

export const metadata: Metadata = {
  title: "Império Construtora",
  description:
    "Império Construtora — construção e incorporação com padrão de acabamento e entrega no prazo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full">
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
      <body className="min-h-full bg-bone text-ink">
        {children}
        {/* No layout, e não em cada página: é a mesma peça em todas as rotas.
            Fica DEPOIS das rotas no DOM e fora da `.transicao-rota` — ver o
            topo do componente sobre o que isso implica com o menu aberto. */}
        <WhatsappFlutuante />
      </body>
    </html>
  );
}
