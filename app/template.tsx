/* Transição de rota — fade de entrada de 250ms, em TODAS as rotas.

   O template remonta a cada troca de segmento (é o que o diferencia do layout),
   então a animação de entrada roda de novo em toda navegação: / -> /contato,
   /contato -> /, /privacidade e a 404. Server Component, zero JavaScript: é uma
   animação CSS, e por isso também roda com o JavaScript desligado, a cada
   carregamento de página.

   ⚠ SÓ OPACIDADE — pelo mesmo motivo registrado em app/globals.css, junto dos
   keyframes `entrada-rota` que este arquivo reaproveita: transform num ancestral
   cria bloco contentor para `position: fixed`, e a navegação fixa e o pin da
   faixa de paralaxe estão DENTRO deste elemento.

   ⚠ `backwards`, E NÃO `both`: o quadro inicial (opacidade 0) vale antes de a
   animação começar, mas ao terminar ela solta o elemento — nada de animação
   "presa" no quadro final pelo resto da visita.

   Com prefers-reduced-motion: sem fade. O motion-safe só aplica a animação
   quando a preferência NÃO pede menos movimento, e sem ela o elemento já nasce
   opaco. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="motion-safe:animate-[entrada-rota_250ms_ease-out_backwards]">
      {children}
    </div>
  );
}
