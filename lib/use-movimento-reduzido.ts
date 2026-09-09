"use client";

import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Lê prefers-reduced-motion. O prefixo "use" é exigência da regra de hooks
 * do React.
 */
export function useMovimentoReduzido() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
