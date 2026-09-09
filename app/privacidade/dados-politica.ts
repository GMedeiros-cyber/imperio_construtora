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

   ══⚠══ TODO NENHUM DESTES CAMPOS PODE IR AO AR COMO "(em definição)" ══⚠══

   O marcador é honesto enquanto o documento não é publicado: dado cadastral
   inventado em documento jurídico é problema de verdade, e um CNPJ plausível
   porém falso é pior que um campo vazio. Mas uma política de privacidade NO AR
   sem identificar o controlador não cumpre o art. 9º da LGPD — a identificação
   do controlador é justamente o que dá endereço à reclamação de quem quiser
   reclamar.

   Ou os campos são preenchidos antes de publicar, ou a rota não sobe. */

/** Marcador literal dos campos que dependem do cliente. Não substituir por
    texto plausível: ou vem o dado real, ou fica isto. */
export const PENDENTE = "(em definição)";

export const controlador = {
  /* Como a empresa está registrada na Receita — não é o nome fantasia. */
  razaoSocial: PENDENTE,
  nomeFantasia: "Império Construtora",
  cnpj: PENDENTE,
  /* Endereço completo do estabelecimento. Hoje o site só afirma a praça,
     "Guarulhos, SP", que não basta para identificar o controlador. */
  endereco: PENDENTE,
  municipio: "Guarulhos, SP",
  email: "contato@imperioconstrutora.com.br",
  /* Encarregado pelo tratamento de dados (art. 41 da LGPD): a pessoa ou canal
     que atende titular e autoridade. Pode ser o próprio e-mail acima, mas é
     decisão do cliente — e precisa estar declarada. */
  encarregado: PENDENTE,
} as const;

export const retencao = {
  /* Quanto tempo o pedido de quem NÃO fechou contrato fica guardado, contado
     do último contato. Decisão comercial do cliente. */
  pedidoSemContrato: PENDENTE,
  /* Quanto tempo o registro de quem VIROU CLIENTE fica guardado. Na LDF o
     número era o prazo da garantia dos móveis — o raciocínio de amarrar a
     retenção ao período em que a empresa ainda pode ser acionada vale aqui
     também, mas o prazo da construção civil é outro e a escolha é do cliente,
     com o advogado dele. */
  cliente: PENDENTE,
} as const;

export const destino = {
  /* Para onde o formulário entrega o pedido. Hoje a variável LEAD_WEBHOOK_URL
     está vazia em todo o repositório: nada é entregue e nada fica armazenado —
     a página de contato manda a pessoa escrever para o e-mail.

     ⚠ NO DIA EM QUE HOUVER UM DESTINO, a seção "Com quem a gente compartilha"
     muda no MESMO commit: passa a existir um intermediário a declarar, e quem
     o hospeda decide se ele é operador no sentido do art. 5º, VII. */
  sistema: PENDENTE,
  /* Quem desenvolve e mantém o site. Importa juridicamente: se o pedido
     trafega ou fica armazenado do lado de quem mantém, essa parte é OPERADORA
     e precisa ser nomeada. */
  desenvolvedor: PENDENTE,
} as const;

/* Data desta versão, em ISO. É a data em que o texto foi escrito — não é
   marcador pendente. Toda alteração de conteúdo sobe esta data junto. */
export const atualizadaEm = "2026-09-09";

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
