"use client";

import { useEffect, useState } from "react";

/**
 * Casa uma media query e reage a mudanças dela em tempo de execução.
 * Começa em false no servidor, então o primeiro render é sempre o do
 * caso "não casa" — layouts devem tratar isso como o estado mobile.
 */
export function useMediaQuery(consulta: string) {
  const [casa, setCasa] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(consulta);
    const aplicar = () => setCasa(mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, [consulta]);

  return casa;
}
