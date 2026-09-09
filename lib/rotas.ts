/* Rotas do site que outros arquivos precisam citar por nome.

   ══ POR QUE ESTE ARQUIVO EXISTE ══

   O contato virou uma ROTA (/contato) e deixou de ser uma âncora (#contato) na
   home. Três links do site apontavam para a âncora: o item "Contato" do menu, o
   CTA da hero e o item "Contato" do rodapé.

   ⚠ DOIS DELES TÊM O href ESCRITO EM lib/dados.ts — `menuHero.itens` e
   `rodape` —, e naquela rodada o dados.ts era de outra sessão e não podia ser
   tocado. Daí `paraRotaDeContato`: a view traduz a âncora velha na rota nova, em
   vez de o dado ser corrigido na origem.

   ISTO É REMENDO, E TEM DATA PARA SAIR. O certo é trocar "#contato" por
   "/contato" nos dois lugares do dados.ts e apagar a função. Enquanto ela
   existir, o dado do site diz uma coisa e a tela mostra outra — que é
   exatamente o tipo de divergência que some sem ninguém notar.

   Não existe mais nenhuma seção com id="contato" na home: o bloco 10 foi
   removido quando a rota nasceu. Uma âncora que sobrasse apontaria para o
   nada. */

export const ROTA_CONTATO = "/contato";

/** Traduz a âncora antiga na rota nova. Ver o aviso no topo do arquivo. */
export function paraRotaDeContato(href: string): string {
  return href === "#contato" ? ROTA_CONTATO : href;
}
