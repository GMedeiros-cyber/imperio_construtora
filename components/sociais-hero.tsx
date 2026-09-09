import { IconeContato } from "@/components/icones-contato";
import { sociaisHero } from "@/lib/dados";

/**
 * BLOCO 1c — Ícones sociais da hero
 * Coluna vertical logo abaixo do botão de menu, alinhada com ele. Some abaixo
 * de 768px, onde a hero não tem folga lateral.
 */
export function SociaisHero() {
  return (
    <ul className="hidden flex-col items-center gap-5 md:flex">
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
                className="block text-bone transition-colors hover:text-gold-lt"
              >
                <IconeContato tipo={item.tipo} />
              </a>
            ) : (
              <span role="img" aria-label={item.rotulo} className="block text-bone">
                <IconeContato tipo={item.tipo} />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
