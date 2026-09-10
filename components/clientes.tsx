import { LogoCloud } from "@/components/ui/logo-cloud";
import { secaoClientes } from "@/lib/dados";
import { logosClientes } from "@/lib/logos";

/**
 * BLOCO 9 — Faixa de marcas
 *
 * ══ POR QUE ELA SUBIU PARA O SEGUNDO POSTO ══
 *
 * Era o penúltimo bloco. Prova social funciona no momento da dúvida, logo
 * depois da promessa da hero — no fim da página ela chegava tarde.
 *
 * ══ POR QUE NÃO É PRETA ══
 *
 * O pedido era faixa preta. As logos coloridas não sobrevivem a ela: seis das
 * dez medem abaixo de 3:1 sobre o ink, e três são pretas de nascença. A tabela
 * com os números está em lib/logos.ts. Preto e cor são excludentes — ou a
 * faixa é escura com as silhuetas bone, ou é clara com as marcas como elas
 * são. O corte que o preto daria embaixo da hero continua existindo, só que
 * invertido em valor: a foto escurece na base e o creme entra cortando.
 *
 * ⚠ SEM EYEBROW, E SEM STATEMENT GRANDE. Este bloco encosta na manchete da
 * hero; um segundo título de 54px ali disputa em vez de apoiar. A frase entra
 * miúda, como legenda das logos. Se a faixa voltar para o fim da página, o
 * Section Title Block volta com ela.
 *
 * O overflow-x-clip não é enfeite: as réguas da grade têm w-screen para sangrar
 * até a borda, e 100vw conta a barra de rolagem. Sem o clip isso vira scroll
 * horizontal na página inteira.
 */
export function Clientes() {
  return (
    <section className="overflow-x-clip px-gutter-sm py-section-lg md:px-gutter">
      <p className="mb-12 max-w-[42ch] text-subheading text-graphite">
        {secaoClientes.statement}
      </p>

      <LogoCloud logos={logosClientes} />
    </section>
  );
}
