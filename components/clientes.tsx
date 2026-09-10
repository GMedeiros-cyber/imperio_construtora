import { LogoCloud } from "@/components/ui/logo-cloud";
import { secaoClientes } from "@/lib/dados";
import { logosClientes } from "@/lib/logos";

/**
 * BLOCO 9 — Carrossel de marcas
 *
 * ══ POR QUE ELA SUBIU PARA O SEGUNDO POSTO ══
 *
 * Era o penúltimo bloco. Prova social funciona no momento da dúvida, logo
 * depois da promessa da hero — no fim da página ela chegava tarde.
 *
 * ══ AS LOGOS NÃO TÊM MAIS PLACA, E ISSO FOI MEDIDO ══
 *
 * Houve uma versão com placa cinza atrás de cada marca. Ela existia para
 * salvar as monocromáticas pretas — mas quem salva de fato é o tratamento do
 * arquivo, que reverte a tinta escura e neutra para ash. Com ele no lugar, a
 * placa só piorava: sobre o ink direto o pior caso é a Leovit em 3,83:1,
 * contra 3,08:1 quando havia placa. Fundo mais escuro, mais contraste. Saiu.
 *
 * ══ O DEGRADÊ NÃO É DESTA SEÇÃO SOZINHA ══
 *
 * ⚠ Esta seção é o começo de UM ARCO que atravessa três blocos: ink aqui,
 * aquecendo até #16130E, que é exatamente onde o gradiente do OQueFazemos
 * começa; ele sobe até o dourado #6B6144; e o ObrasHorizontal recebe a volta,
 * do dourado de novo ao ink. Cada emenda tem a rampa pertencendo a UM lado só,
 * casada na cor exata do vizinho — duas rampas se encarando é o que produz as
 * "duas barras".
 *
 * Medido antes: o salto daqui para o OQueFazemos era de 16 a 35 por canal, e o
 * do OQueFazemos para as Obras chegava a 100. Mexeu na cor de ponta de
 * qualquer um dos três, remeça os outros dois.
 *
 * ⚠ A MANCHETE É CENTRADA, contra a regra de texto sempre à esquerda do
 * AGENTS.md. Foi pedido, e está registrado nos Desvios do DESIGN.md.
 */
export function Clientes() {
  return (
    <section className="relative px-gutter-sm py-section-lg md:px-gutter">
      {/* Zodiak peso 300, como a manchete da hero. Fica um degrau abaixo dela
          na escala — display aqui, encostado na hero, disputaria em vez de
          apoiar. */}
      <h2 className="mb-16 text-center text-heading-sm text-bone min-[768px]:text-heading">
        {secaoClientes.statement}
      </h2>

      <LogoCloud logos={logosClientes} />
    </section>
  );
}
