import Image from "next/image";

import { type Obra } from "@/lib/dados";

/**
 * Project / News Card (DESIGN.md)
 * 3 colunas, gap de coluna 48px, sem borda, sem sombra, raio 0.
 */
export function ObrasGrid({ itens }: { itens: Obra[] }) {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
      {itens.map((obra) =>
        obra.acento ? (
          <CardAcento key={obra.titulo} obra={obra} />
        ) : (
          <CardObra key={obra.titulo} obra={obra} />
        ),
      )}
    </div>
  );
}

function CardObra({ obra }: { obra: Obra }) {
  return (
    <article>
      {obra.imagem ? (
        <div className="relative aspect-square w-full">
          <Image
            src={obra.imagem}
            alt={obra.alt ?? ""}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <h3 className="mt-4 text-subheading font-light text-ink">{obra.titulo}</h3>
      <p className="mt-element line-clamp-3 text-body-sm text-graphite">
        {obra.descricao}
      </p>
    </article>
  );
}

/**
 * Chromatic Accent Card (DESIGN.md)
 * O único ponto de cor da página. Superfície ink, texto gold — o dourado só
 * existe sobre fundo escuro. Esticado na linha, conteúdo ancorado embaixo.
 */
function CardAcento({ obra }: { obra: Obra }) {
  return (
    <article className="flex h-full flex-col justify-end bg-ink p-card">
      <h3 className="text-subheading font-light text-gold">{obra.titulo}</h3>
      <p className="mt-element line-clamp-3 text-body-sm text-gold">
        {obra.descricao}
      </p>
    </article>
  );
}
