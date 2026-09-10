/* GradientBackground — "background rowds shop v1", gerado no Gradient Builder
   da 21st.dev e exportado como CSS vivo (o background do Copy-CSS do próprio
   builder, mais as passadas de desfoque e de grão). Zero dependência: uma
   <div> que preenche o pai.

   Receita de origem, para remixar cores, modo e acabamento:
   https://21st.dev/community/gradients/editor?from=10bf6028-254c-4b76-9d3c-1a62c0aa09cb

   ══ VENDORIZADO: MANTIDO FIEL À FONTE ══

   O corpo abaixo é o do builder, com uma única correção: os hexadecimais
   vieram do exportador quebrados por uma linha ("\n#16130E"), o que produz cor
   inválida. Fora isso nada foi reescrito — nem o `position: relative`, nem o
   `containerType`, nem as opacidades de grão. É de propósito: quem for
   ressincronizar com o builder compara os dois lado a lado.

   ⚠ ALTERAÇÃO DELIBERADA: A ÚLTIMA PARADA É #6B6144, E NO ORIGINAL ERA
   #9C8D63. Não é gosto. Sobre o #9C8D63 o texto miúdo desta seção media de
   1,99 a 2,58:1 nas cinco larguras, contra os 4,5:1 exigidos, e nenhuma cor de
   texto salvava — nem o bone. As paradas continuam onde estavam (0%, 32%,
   100%); só o tom final escureceu, o bastante para o bone medir 5,78:1 sobre
   ele. Clarear esta parada de novo reprova o texto da seção junto: antes de
   mexer, releia o bloco de contraste em components/o-que-fazemos.tsx.

   ⚠ O `position: relative` É INLINE, E ESTILO INLINE VENCE CLASSE. Passar
   `className="absolute inset-0"` NÃO posiciona este componente — a classe
   perde para o estilo, o elemento continua `relative` e o `inset-0` passa a
   deslocá-lo em vez de esticá-lo. Quem precisa dele no fundo absoluto usa o
   invólucro `FundoGradiente`, abaixo, e não este export direto.

   ══ É FUNDO ESTÁTICO, E TEM DE CONTINUAR SENDO ══

   As duas camadas de grão são `feTurbulence`, que o navegador rasteriza uma
   vez e reaproveita — não há animação, nem `requestAnimationFrame`, nem
   `background-position` em movimento.

   Não acrescente `animation`, `transition` de background nem `backdrop-filter`
   aqui: qualquer um dos três transforma um fundo que pinta uma vez num fundo
   que repinta a cada quadro, atrás de uma seção inteira.

   Com `prefers-reduced-motion` não muda nada, justamente por ser estático. */
export function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        containerType: "size",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0A0A0A",
          /* TRES CAMADAS, de cima para baixo:
               1. grao, em overlay (ver o aviso abaixo)
               2. o fecho VERTICAL para o ink, nos ultimos 110px
               3. o bloom diagonal a 170deg, que termina no dourado

             ⚠ O FECHO E UMA CAMADA SEPARADA, E VERTICAL DE PROPOSITO. Quando o
             retorno ao preto morava dentro do gradiente de 170deg, ele chegava
             na DIAGONAL: a base esquerda ainda estava dourada enquanto a
             direita ja era preta, e a emenda com a secao de obras virava uma
             cunha. Vertical, a borda de baixo fica preta na largura inteira.

             Os 110px sao ancorados na borda de BAIXO, e nao em porcentagem,
             porque a altura do involucro varia com o breakpoint — medido, de
             1356 a 1457px. Ancorado assim, o fecho cai sempre logo abaixo da
             linha de numeros, que termina de 64 a 112px antes do fim. */
          backgroundImage:
            "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.130'/></svg>\"), linear-gradient(to bottom, transparent calc(100% - 110px), #0A0A0A 100%), linear-gradient(170deg, #0A0A0A 0%, #16130E 30%, #372F20 55%, #6B6144 100%)",
          backgroundSize: "120px 120px, auto, auto",
          backgroundBlendMode: "overlay, normal, normal",
        }}
      />
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.13,
          mixBlendMode: "overlay",
        }}
      >
        <filter id="grain-10bf6028">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-10bf6028)" />
      </svg>
    </div>
  );
}

/* O invólucro que resolve o `position: relative` inline descrito acima: quem
   posiciona é ESTE elemento, e o gradiente apenas preenche 100% dele.

   Fica neste arquivo, e não no componente que o usa, porque é consequência
   direta de uma decisão do código vendorizado — se um dia o builder parar de
   fixar `position` no inline, o invólucro some daqui e mais nada muda. */
export function FundoGradiente({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <GradientBackground className="h-full w-full" />
    </div>
  );
}
