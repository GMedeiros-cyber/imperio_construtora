import { Mail, MapPin } from "lucide-react";

/** 28px: os 20 originais mais 40%. Traço 1,5 para a borda pesar mais. */
export const TAMANHO_ICONE = 28;
export const TRACO_ICONE = 1.5;

export type TipoContato = "instagram" | "email" | "local";

/*
 * O lucide-react desta versão não traz mais nenhum ícone de marca — Instagram,
 * GitHub e afins saíram da biblioteca. O glifo do Instagram é desenhado aqui na
 * mesma linguagem dos demais: viewBox 24, traço em currentColor, pontas
 * arredondadas.
 */
function IconeInstagram({ tamanho, traco }: { tamanho: number; traco: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      fill="none"
      stroke="currentColor"
      strokeWidth={traco}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="block"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconeContato({
  tipo,
  tamanho = TAMANHO_ICONE,
  traco = TRACO_ICONE,
}: {
  tipo: TipoContato;
  tamanho?: number;
  traco?: number;
}) {
  if (tipo === "instagram") {
    return <IconeInstagram tamanho={tamanho} traco={traco} />;
  }

  const Glifo = tipo === "email" ? Mail : MapPin;
  return (
    <Glifo size={tamanho} strokeWidth={traco} aria-hidden className="block" />
  );
}
