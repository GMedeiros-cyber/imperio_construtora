"use client";

import { useEffect, useState } from "react";

/**
 * Lê prefers-reduced-motion e reage a mudanças dela em tempo de execução.
 * O prefixo "use" é exigência da regra de hooks do React.
 */
export function useMovimentoReduzido() {
  const [reduzido, setReduzido] = useState(false);

  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => setReduzido(consulta.matches);
    aplicar();
    consulta.addEventListener("change", aplicar);
    return () => consulta.removeEventListener("change", aplicar);
  }, []);

  return reduzido;
}
