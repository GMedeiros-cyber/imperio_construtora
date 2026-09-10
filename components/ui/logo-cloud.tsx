import Image from "next/image";

import type { LogoCliente } from "@/lib/logos";
import { cn } from "@/lib/utils";

/**
 * Carrossel de marcas — placas em cinza-quase-preto correndo sobre o campo ink.
 *
 * ══ O CARROSSEL NÃO RESOLVE CONTRASTE, A PLACA RESOLVE ══
 *
 * Logo preta correndo sobre preto continua invisível. Quem faz a marca aparecer
 * é o par placa + tratamento: a placa é um degrau de valor acima do campo, e as
 * logos monocromáticas pretas — adidas, Authentic Feet, magicfeet — entram em
 * ash. As coloridas passam intactas. A regra que separa uma coisa da outra é
 * pixel a pixel e está no gerador: tinta ESCURA e NEUTRA vira ash, tinta com
 * croma fica como está. Por isso o símbolo laranja do Boali sobrevive enquanto
 * o wordmark preto dele vira cinza. Ver /logos/escuro e lib/logos.ts.
 *
 * ══ A MECÂNICA ══
 *
 * A trilha carrega DUAS cópias da lista e corre até -50%, o que desloca
 * exatamente o comprimento de uma cópia — o último quadro é igual ao primeiro
 * e não há emenda. A animação é CSS pura, sem JS e sem estado: o componente
 * continua sendo server component. A segunda cópia é aria-hidden, senão o
 * leitor de tela anuncia as dez marcas duas vezes.
 *
 * Pausa no hover, e com prefers-reduced-motion a trilha para e o trilho vira
 * rolagem manual — parar sem isso deixaria metade das marcas inalcançável.
 * As duas regras vivem em globals.css, junto do keyframe.
 *
 * A máscara nas pontas não é enfeite: sem ela a placa aparece e some cortada
 * no meio, na borda da viewport. Ela é sobre o TRILHO, não sobre foto — a
 * proibição de gradiente do AGENTS.md é para fotografia.
 */

function Placa({ logo, oculto }: { logo: LogoCliente; oculto?: boolean }) {
  return (
    <li
      aria-hidden={oculto || undefined}
      /* Canto reto: o raio 1440px é reservado a botão, pill e tag. Placa é
         superfície editorial, e superfície editorial é reta.
         O bone a 10% sobre o ink dá rgb(34,34,33) — o cinza próximo do preto,
         um degrau de valor acima do campo sem virar cinza médio. */
      className="flex h-28 w-48 shrink-0 items-center justify-center bg-bone/10 px-5 md:h-36 md:w-72 md:px-8"
    >
      {/* Altura e largura limitadas juntas: as proporções vão de 7,06:1 a
          0,84:1, então nas marcas largas quem trava é a largura e nas compactas
          é a altura. Com width e height em auto, um max-* encolhe a imagem
          inteira mantendo a proporção — não recorta. A escala entra como custom
          property porque o teto muda no breakpoint, e style inline não tem
          breakpoint. */}
      <Image
        src={logo.arquivo}
        alt={oculto ? "" : logo.nome}
        width={logo.largura}
        height={logo.altura}
        sizes="288px"
        /* Eager, e não o lazy padrão: a trilha mede mais de 6000px, então quase
           tudo nasce fora da viewport e o lazy só dispararia quando a placa já
           estivesse entrando em cena — aparecendo em branco e preenchendo
           depois. Medido: 15 das 20 não tinham carregado. São dez PNGs miúdos,
           servidos uma vez e reaproveitados pela segunda cópia. */
        loading="eager"
        style={{ "--escala": logo.escala } as React.CSSProperties}
        className="pointer-events-none h-auto max-h-[calc(2.25rem*var(--escala))] w-auto max-w-[min(calc(7rem*var(--escala)),100%)] select-none object-contain md:max-h-[calc(3rem*var(--escala))] md:max-w-[min(calc(10rem*var(--escala)),100%)]"
      />
    </li>
  );
}

export function LogoCloud({
  logos,
  className,
  ...props
}: React.ComponentProps<"div"> & { logos: LogoCliente[] }) {
  return (
    <div
      className={cn(
        "marcas-carrossel relative -mx-gutter-sm overflow-hidden md:-mx-gutter",
        /* Sangra até a borda da viewport: o carrossel ignora o gutter de
           propósito, é ele que dá a sensação de fluxo sem fim. */
        /* O fade é 2rem no mobile e 6rem no desktop. A 390px, 6rem de cada
           lado comiam metade da largura útil e sobrava uma placa e meia
           legível. */
        "[mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)]",
        "md:[mask-image:linear-gradient(to_right,transparent,black_6rem,black_calc(100%-6rem),transparent)]",
        className,
      )}
      {...props}
    >
      <ul className="marcas-trilha flex w-max gap-3 md:gap-5">
        {logos.map((logo) => (
          <Placa key={logo.arquivo} logo={logo} />
        ))}
        {logos.map((logo) => (
          <Placa key={`copia-${logo.arquivo}`} logo={logo} oculto />
        ))}
      </ul>
    </div>
  );
}
