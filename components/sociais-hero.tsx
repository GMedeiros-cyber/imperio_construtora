import { IconeContato } from "@/components/icones-contato";
import { sociaisHero } from "@/lib/dados";

/* O desenho do SVG. O alvo de toque é maior, 48x48 — ver ALVO abaixo. O
   IconeContato aceita `tamanho`, então components/icones-contato.tsx, que é
   compartilhado com o menu e com o rodapé, fica intacto. */
const DESENHO = 40;

/* Alvo de toque 48x48 — acima do mínimo de 44 — e o SVG de 40 centrado nele. */
const ALVO = "flex size-12 items-center justify-center text-bone";

/* ⚠ A SOMBRA NÃO É DECORAÇÃO. Os ícones ficam sobre a FOTO da hero, que muda de
   valor ao longo da largura. A drop-shadow segue o traço do SVG e dá a ele um
   contorno escuro: é o que mantém o ícone legível nos trechos claros da foto,
   onde o bone sozinho sumiria. É filter no ÍCONE, não na foto — a proibição de
   filter do AGENTS.md é sobre a fotografia. */
const SOMBRA = "[filter:drop-shadow(0_1px_6px_rgba(0,0,0,0.55))]";

/**
 * BLOCO 1c — Ícones sociais da hero
 *
 * ⚠ NÃO ACOMPANHAM A ROLAGEM. Eles moraram numa coluna fixa junto do botão de
 * menu; voltaram para dentro da hero, no rodapé dela, na mesma linha do botão
 * de CTA — ícones primeiro, CTA fechando à direita. É o arranjo da hero da LDF.
 *
 * ⚠ SÓ FUNCIONA DENTRO DA HERO PORQUE DEIXARAM DE SER FIXED. A <section> da hero
 * é overflow-hidden, e foi exatamente por isso que eles tinham ido parar num
 * componente pendurado na rota. Estáticos, eles ficam dentro da caixa e o clip
 * não os alcança — medido em todas as larguras.
 *
 * Fundo transparente, sem placa e sem círculo. A pastilha ink que eles tinham
 * existia porque, FIXOS, cruzavam o creme do carrossel de marcas e sumiam
 * (1,00:1). Parados sobre a foto escura da hero, o problema não existe; quem
 * resolve os trechos claros da foto é a sombra.
 *
 * Abaixo de 768px a fila continua escondida.
 */
export function SociaisHero() {
  return (
    <ul className="hidden items-center gap-8 md:flex">
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
                className={`${ALVO} ${SOMBRA} cursor-pointer transition-colors hover:text-gold-lt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-lt`}
              >
                <IconeContato tipo={item.tipo} tamanho={DESENHO} />
              </a>
            ) : (
              <span role="img" aria-label={item.rotulo} className={`${ALVO} ${SOMBRA}`}>
                <IconeContato tipo={item.tipo} tamanho={DESENHO} />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
