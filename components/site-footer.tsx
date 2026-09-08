import { rodape } from "@/lib/dados";

/**
 * BLOCO 11 — Full-Bleed Footer
 * Mesmo canvas creme, sem fundo próprio. Hairline 1px ash no topo — o único
 * divisor da página. O id #contato é da seção escura do bloco 10, não daqui.
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
                  {item.href ? <a href={item.href}>{item.texto}</a> : item.texto}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
