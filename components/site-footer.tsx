import { rodape } from "@/lib/dados";
import { paraRotaDeContato } from "@/lib/rotas";

/**
 * BLOCO 11 — Full-Bleed Footer
 * Mesmo canvas creme, sem fundo próprio. Hairline 1px ash no topo — o único
 * divisor da página.
 *
 * O item "Contato" da coluna de navegação ainda chega aqui com href "#contato",
 * escrito em lib/dados.ts. `paraRotaDeContato` o traduz para /contato — ver o
 * aviso em lib/rotas.ts, que explica por que a tradução é na view e quando ela
 * deve sair.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-ash px-gutter-sm py-section md:px-gutter">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {rodape.map((coluna) => (
          <div key={coluna.titulo}>
            <p className="text-caption uppercase text-graphite">{coluna.titulo}</p>
            <ul className="mt-4 flex flex-col gap-element">
              {/* Índice na key: os dois "(em definição)" têm o mesmo texto. */}
              {coluna.itens.map((item, indice) => (
                <li key={indice} className="text-body-sm text-ink">
                  {item.href ? (
                    <a
                      href={paraRotaDeContato(item.href)}
                      className="transition-colors hover:text-gold-dk"
                    >
                      {item.texto}
                    </a>
                  ) : (
                    item.texto
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
