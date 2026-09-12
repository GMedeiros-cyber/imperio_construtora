/* Os dados que a Política de Privacidade precisa citar.

   ══ POR QUE ELES NÃO ESTÃO ESCRITOS NA PÁGINA ══

   É a mesma regra do resto do site, e aqui ela pesa mais: um CNPJ digitado à
   mão numa página legal que ninguém relê é exatamente o tipo de erro que só
   aparece quando alguém precisa dele. Concentrando tudo aqui, a lista do que
   ainda falta é uma leitura de arquivo, não uma varredura de texto corrido.

   ⚠ ESTE ARQUIVO NÃO É lib/dados.ts DE PROPÓSITO. Naquela rodada o dados.ts
   era de outra sessão e não podia ser tocado. Quando alguém for consolidar o
   conteúdo do site, este objeto é candidato natural a mudar de casa — e aí a
   página continua lendo de uma fonte só, que é o que importa.

   ══ NÃO HÁ MAIS MARCADOR DE PENDÊNCIA AQUI, E ISSO É NOVO ══

   Este arquivo tinha um `PENDENTE = "(em definição)"` e sete campos usando
   ele. Foram ao ar assim, e não deviam: uma política de privacidade publicada
   sem identificar o controlador não cumpre o art. 9º da LGPD — a identificação
   é justamente o que dá endereço à reclamação de quem quiser reclamar. Medido
   no HTML servido antes desta rodada: 14 ocorrências de "(em definição)".

   Razão social, endereço e CEP chegaram do cartão CNPJ; o encarregado virou
   uma declaração de canal (art. 41); e os dois prazos de retenção deixaram de
   existir junto com o armazenamento — o formulário não guarda mais nada, ele
   abre o WhatsApp.

   ⚠ SE VOLTAR A HAVER CAMPO PENDENTE, o marcador volta com ele. A regra que
   fica é a de antes: dado cadastral inventado em documento jurídico é problema
   de verdade, e um CNPJ plausível porém falso é pior que um campo vazio. Ou o
   campo é preenchido antes de publicar, ou a rota não sobe. */

import { creditos, telefone } from "@/lib/dados";

export const controlador = {
  /* Como a empresa está registrada na Receita — não é o nome fantasia, e por
     isso vem SEM ACENTO e em caixa alta: é a grafia do cartão CNPJ. */
  razaoSocial: "IMPERIO CONSTRUTORA LTDA",
  nomeFantasia: "Império Construtora",
  cnpj: "69.064.563/0001-40",
  /* Logradouro e bairro. Município, UF e CEP são campos à parte porque a
     página os monta em ordem própria — juntar tudo numa string só duplicaria
     "Guarulhos, SP", que já é dito pelo `municipio`. */
  endereco: "R. Visconde de Cairu, 623 — Lote 15B, Quadra 8, Jardim Paulista",
  cep: "07083-120",
  municipio: "Guarulhos, SP",
  email: "contato@imperioconstrutora.com.br",
  /* Lido de lib/dados.ts, a fonte única do número — não copiar para cá.
     Aqui ele é TEXTO PURO, sem link: canal de contato do titular num documento
     jurídico não precisa de WhatsApp, e o protocolo tel é proibido no site. */
  telefone: telefone.exibicao,
  /* ══ ENCARREGADO (art. 41 da LGPD) ══

     NÃO HÁ PESSOA NOMEADA, e isso é decisão registrada, não omissão. O art. 41
     manda o controlador INDICAR um encarregado e o §1º manda DIVULGAR a
     identidade e a informação de contato dele; a prática aceita um canal de
     atendimento no lugar de um nome próprio, e a ANPD trata o que não pode
     faltar como sendo a DECLARAÇÃO de que o encarregado existe e o ENDEREÇO
     por onde se fala com ele.

     É por isso que este campo guarda a designação e o texto da página diz a
     frase inteira: "a Império indica um encarregado (…) e o canal dele é o
     e-mail acima". Trocar quem atende não muda o endereço. */
  encarregado: "o canal de atendimento da empresa",
} as const;

/* ══ RETENÇÃO — O SITE NÃO GUARDA NADA, E ESSE É O ESTADO ATUAL ══

   As duas pendências que moravam aqui (`pedidoSemContrato` e `cliente`)
   SAÍRAM, e não por terem sido respondidas: elas deixaram de existir. O
   formulário não armazena mais nada em lugar nenhum — ele monta uma mensagem e
   abre a conversa no WhatsApp da empresa, e quem envia é a pessoa. O que
   sobra depois disso é uma conversa de WhatsApp, guardada pela empresa no
   aparelho dela e pela Meta na infraestrutura dela.

   ⚠ NÃO INVENTE PRAZO AQUI. Prazo de retenção de conversa de WhatsApp é
   decisão de rotina da empresa, não do site, e um número escrito nesta página
   seria uma promessa que o código não tem como cumprir.

   ⚠ QUANDO A LEAD_WEBHOOK_URL FOR PREENCHIDA, isto volta: passa a existir um
   sistema que RECEBE e GUARDA o pedido, e aí a pergunta "por quanto tempo"
   tem dono de novo. Os dois campos antigos voltam com ela, no mesmo commit,
   junto com a seção "Com quem a gente compartilha". */

export const destino = {
  /* Para onde o pedido vai HOJE: a conversa do WhatsApp da própria Império.
     Não há intermediário, não há banco de dados e não há e-mail automático. */
  sistema: "o WhatsApp da própria Império",
  /* Quem desenvolve e mantém o site. Importa juridicamente: se o pedido
     trafega ou fica armazenado do lado de quem mantém, essa parte é OPERADORA
     e precisa ser nomeada. Aqui não trafega — não há para onde —, e é por isso
     que o texto da página diz isso com essas palavras.

     Lido de `creditos` em lib/dados.ts, a mesma fonte do crédito do rodapé:
     dois lugares dizendo nomes diferentes é o tipo de divergência que ninguém
     revisa. */
  desenvolvedor: creditos.autor,
} as const;

/* Data desta versão, em ISO. É a data em que o texto foi escrito — não é
   marcador pendente. Toda alteração de conteúdo sobe esta data junto. */
export const atualizadaEm = "2026-09-12";

/* ── Terceiros que o navegador contacta, MEDIDOS, não deduzidos ────────────

   Aferido no build de produção, em / e em /contato, registrando todas as
   requisições e lendo cookies, localStorage e sessionStorage depois do load:

     cookies gravados .............. 0
     localStorage / sessionStorage . 0 chaves
     cabeçalhos Set-Cookie ......... 0
     domínios de terceiro .......... api.fontshare.com, cdn.fontshare.com

   ⚠ A FONTSHARE É A DIFERENÇA EM RELAÇÃO AO PROJETO DE ORIGEM. Lá as fontes
   entram por next/font/google, que baixa os arquivos no build e os serve do
   próprio domínio — e por isso a política de lá pode afirmar que nenhum
   terceiro recebe requisição. Aqui NÃO dá para afirmar o mesmo: a licença ITF
   proíbe auto-hospedar a Switzer e a Zodiak, elas vêm da API da Fontshare em
   execução, e nisso a Fontshare recebe o IP e o user agent de quem abre a
   página. A seção de cookies diz isso com essas palavras.

   Se algum dia entrar analytics, tag manager, pixel ou qualquer script de
   terceiro, a seção #cookies muda no MESMO commit — e o banner de
   consentimento entra antes de o script rodar. Página no ar dizendo "não
   usamos cookies" com script gravando cookie é declaração falsa em documento
   legal. */
export const terceiros = ["api.fontshare.com", "cdn.fontshare.com"] as const;
