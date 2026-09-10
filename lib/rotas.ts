/* Rotas do site que outros arquivos precisam citar por nome.

   O contato é uma ROTA (/contato), não uma âncora. Não existe nenhuma seção
   com id="contato" na home: o bloco foi removido quando a rota nasceu, e uma
   âncora que sobrasse apontaria para o nada.

   ══ O REMENDO QUE MORREU AQUI ══

   Existia `paraRotaDeContato`, que traduzia "#contato" em "/contato" na
   RENDERIZAÇÃO. Ela nasceu porque os dois href viviam em lib/dados.ts e aquele
   arquivo era de outra sessão naquela rodada, então não podia ser corrigido na
   origem.

   Foi corrigido: `menuHero.itens` e `rodape` agora dizem "/contato" no dado, e
   a função foi apagada junto com as duas chamadas. Enquanto ela existia, o dado
   do site dizia uma coisa e a tela mostrava outra — o tipo de divergência que
   some sem ninguém notar.

   ⚠ NÃO RESSUSCITE A TRADUÇÃO. Se aparecer um "#contato" em algum lugar, é bug
   no dado, e o conserto é no dado. */

export const ROTA_CONTATO = "/contato";
