import type { Metadata } from "next";
import "./globals.css";

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
        {/* Switzer 300/400 via Fontshare — a licença ITF não permite auto-hospedar. */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=switzer@300,400&display=swap"
        />
      </head>
      <body className="min-h-full bg-bone text-ink">{children}</body>
    </html>
  );
}
