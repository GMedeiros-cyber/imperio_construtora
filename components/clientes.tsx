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
 * ══ O CAMPO É PRETO, AS PLACAS SÃO CINZA ══
 *
 * As logos entram nas cores originais e seis das dez somem sobre o ink puro.
 * O que as faz aparecer é o par placa + tratamento: a placa é um degrau de
 * valor acima do campo, e as monocromáticas pretas viram ash. As coloridas
 * passam intactas. Ver o comentário do logo-cloud e lib/logos.ts.
 *
 * O carrossel é o formato, não a solução de contraste — logo preta correndo
 * sobre preto continua invisível. Ele existe para caber marca sem empilhar
 * linha e para dar movimento onde a página tinha um bloco parado.
 *
 * O ink aqui também encosta no gradiente do OQueFazemos, que começa em
 * #16130E: as duas seções viram uma região escura contínua depois da hero.
 * ⚠ Se o fundo do OQueFazemos sair, esta vizinhança precisa ser remedida.
 *
 * ⚠ SEM EYEBROW, E SEM STATEMENT GRANDE. Este bloco encosta na manchete da
 * hero; um segundo título de 54px ali disputa em vez de apoiar. A frase entra
 * miúda, como legenda das placas. Se a faixa voltar para o fim da página, o
 * Section Title Block volta com ela.
 */
export function Clientes() {
  return (
    <section className="bg-ink px-gutter-sm py-section-lg md:px-gutter">
      <p className="mb-12 max-w-[42ch] text-subheading text-ash">
        {secaoClientes.statement}
      </p>

      <LogoCloud logos={logosClientes} />
    </section>
  );
}
