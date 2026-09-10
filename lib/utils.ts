import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * O tailwind-merge não conhece a escala de tipo do nosso @theme. Sem isto ele
 * classifica `text-caption` como cor de texto e, ao encontrar `text-gold` na
 * mesma chamada de cn(), descarta o tamanho — o elemento cai para 16px.
 * Registrar os tamanhos como font-size mantém tamanho e cor convivendo.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      /* Sem isto o tailwind-merge trata "font-display" como peso de fonte e
         descarta a família quando cn() recebe as duas coisas. */
      "font-family": [{ font: ["display", "sans", "switzer", "zodiak"] }],
      "font-size": [
        {
          text: [
            "caption",
            "body-sm",
            "body",
            "body-lg",
            "subheading",
            "heading-sm",
            "heading",
            "display",
            /* Escala da seção "O que fazemos" — três degraus por largura. */
            "statement-lg",
            "statement-md",
            "statement-sm",
            "numeral-lg",
            "numeral-md",
            "numeral-sm",
            /* Título da obra no scroll horizontal — três degraus. */
            "obra-lg",
            "obra-md",
            "obra-sm",
            /* Título das quatro formas de contratar. */
            "forma",
            "eyebrow",
          ],
        },
      ],
    },
  },
});

/**
 * Junta classes condicionais (clsx) e resolve conflitos do Tailwind (tailwind-merge).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
