import { IconeContato } from "@/components/icones-contato";
import { sociaisHero } from "@/lib/dados";

/* 28px do padrão mais 25%. O IconeContato aceita `tamanho`, então o aumento
   sai daqui e components/icones-contato.tsx, que é compartilhado com o menu e
   com o rodapé, fica intacto. */
const TAMANHO = 35;

/**
 * BLOCO 1c — Ícones sociais da hero
 * Coluna vertical logo abaixo do botão de menu, dentro da MESMA coluna fixa
 * (components/navegacao-fixa.tsx): se um acompanhasse a rolagem e o outro
 * não, o conjunto se partia. Some abaixo de 768px, como antes.
 *
 * ⚠ A PASTILHA INK É MEDIÇÃO, NÃO ENFEITE. Fixos, os ícones cruzam as faixas
 * claras da página: medido atrás deles, a foto clara da seção de obras dá
 * 1,03:1 e o creme do carrossel de marcas 1,00:1 contra o bone — os ícones
 * sumiam. Sobre o ink chapado eles ficam em 18,6:1 em qualquer ponto.
 */
export function SociaisHero() {
  return (
    <ul className="hidden flex-col items-center gap-[25px] rounded-pill bg-ink px-[15px] py-[20px] md:flex">
      {sociaisHero.map((item) => {
        const externo = item.href?.startsWith("http");

        return (
          <li key={item.tipo}>
            {item.href ? (
              <a
                href={item.href}
                aria-label={item.rotulo}
                target={externo ? "_blank" : undefined}
                rel={externo ? "noreferrer" : undefined}
                className="block cursor-pointer text-bone transition-colors hover:text-gold-lt focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-lt"
              >
                <IconeContato tipo={item.tipo} tamanho={TAMANHO} />
              </a>
            ) : (
              <span role="img" aria-label={item.rotulo} className="block text-bone">
                <IconeContato tipo={item.tipo} tamanho={TAMANHO} />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
