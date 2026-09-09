"use server";

import {
  ESTADO_INICIAL,
  opcoesEstagio,
  opcoesTipoObra,
  resumoDeErros,
  soDigitos,
  validar,
  type EstadoContato,
  type ValoresContato,
} from "./estado";

/* Envio do formulário de contato.

   SERVER ACTION, e não rota de API com fetch do cliente. A diferença que
   importa é uma só: `<form action={acao}>` funciona SEM JAVASCRIPT. O navegador
   faz o POST nativo, o servidor roda esta função e devolve a página já com o
   resultado.

   NENHUMA DEPENDÊNCIA NOVA. Sem zod, sem lib de validação, sem SDK de e-mail. A
   validação é escrita à mão porque são sete campos com regras curtas — uma
   biblioteca aqui custaria mais bytes que o formulário inteiro.

   ══ VALIDAÇÃO É SEMPRE DO SERVIDOR ══

   O `required` do HTML e o `type="email"` ajudam quem tem JS e navegador
   moderno, e não são garantia de nada: um POST direto ignora os dois. Quem
   DECIDE se o pedido entra é esta função, que chama `validar()` sempre.

   As regras moram em ./estado.ts porque um módulo "use server" só pode exportar
   função assíncrona — então esta action não conseguiria emprestar as regras
   dela a ninguém. */

/* Envio em menos disto, com o carimbo presente, é robô. */
const RAPIDO_DEMAIS_MS = 3000;

/* Canal real da Império, e o único que existe hoje. O telefone segue "(em
   definição)" e NÃO entra aqui até alguém informar o número. */
const EMAIL_IMPERIO = "contato@imperioconstrutora.com.br";

function texto(dados: FormData, campo: string) {
  const v = dados.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

export async function enviarContato(
  _anterior: EstadoContato,
  dados: FormData,
): Promise<EstadoContato> {
  const valores: ValoresContato = {
    nome: texto(dados, "nome"),
    telefone: texto(dados, "telefone"),
    email: texto(dados, "email"),
    tipoObra: dados
      .getAll("tipoObra")
      .filter((v): v is string => typeof v === "string"),
    estagio: texto(dados, "estagio"),
    mensagem: texto(dados, "mensagem"),
    consentimento: dados.get("consentimento") === "sim",
  };

  /* ══ ANTISPAM, ANTES DE QUALQUER OUTRA COISA ══

     Os dois descartes abaixo respondem SUCESSO e jogam fora. É de propósito:
     dizer "você é um robô" ensina o robô a tentar de outro jeito, e um humano
     nunca cai aqui.

     1. HONEYPOT. O campo `site` está fora da tela, com aria-hidden, tabindex -1
        e autocomplete off — gente não vê, não tabula e não preenche.
        Preenchido, é robô que leu o HTML e completou tudo. */
  if (texto(dados, "site") !== "") {
    return { estado: "sucesso", erros: {}, resumo: null, valores: ESTADO_INICIAL.valores };
  }

  /*   2. CARIMBO DE TEMPO. O campo `carimbo` é escrito PELO CLIENTE ao montar o
        formulário. Menos de 3 segundos entre montar e enviar é robô: ninguém lê
        seis campos e um consentimento nesse tempo.

        ⚠ SEM JS O CARIMBO NÃO EXISTE, e aí a checagem é PULADA em vez de
        reprovar. É a escolha certa e vale registrar por quê: a rota é estática,
        então um carimbo renderizado no servidor seria a hora do BUILD, igual
        para todo mundo e velho de horas — passaria sempre, e daria a impressão
        de proteção sem proteger. Melhor uma checagem que se declara ausente do
        que uma que mente. Quem não tem JS continua coberto pelo honeypot, que
        não depende de script nenhum. */
  const carimbo = Number(texto(dados, "carimbo"));
  if (
    Number.isFinite(carimbo) &&
    carimbo > 0 &&
    Date.now() - carimbo < RAPIDO_DEMAIS_MS
  ) {
    return { estado: "sucesso", erros: {}, resumo: null, valores: ESTADO_INICIAL.valores };
  }

  /* ══ VALIDAÇÃO ══ Ver ./estado.ts. */
  const erros = validar(valores, {
    tipos: opcoesTipoObra,
    estagios: opcoesEstagio,
  });

  const resumo = resumoDeErros(erros);
  if (resumo) {
    return { estado: "erro", erros, resumo, valores };
  }

  /* ══ ENTREGA ══

     O destino é um webhook, em LEAD_WEBHOOK_URL. Um POST com fetch, nenhum SDK,
     nenhum serviço de e-mail inventado.

     ⚠ ELE NÃO EXISTE HOJE. A variável não está configurada em lugar nenhum, e
     por isso NENHUM pedido é entregue ainda. A variável fica aqui, sem nome de
     fornecedor: no dia em que houver um endereço, ele entra e este arquivo não
     muda.

     ══ POR QUE ISTO NÃO TERMINA NO WHATSAPP ══

     O projeto de origem, com a variável vazia, redirecionava para o wa.me da
     empresa. Aqui NÃO DÁ: o telefone da Império segue "(em definição)" e
     inventar número é pior que não ter fallback. Então o caminho sem webhook
     avisa a pessoa e aponta o e-mail real, que é o único canal que existe hoje.

     Em desenvolvimento a coisa é outra: o pedido é registrado no console e a
     tela responde sucesso, para o fluxo poder ser testado de ponta a ponta sem
     webhook nenhum. É o mesmo arranjo do original.

     ⚠ NÃO troque a falha em produção por sucesso "para ficar bonito". Um
     formulário que diz "recebemos" sem ter para onde mandar é pior que um
     formulário fora do ar: o pedido some e a pessoa vai embora achando que
     enviou. */
  const destino = process.env.LEAD_WEBHOOK_URL;

  if (!destino) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[contato] LEAD_WEBHOOK_URL vazia — pedido não enviado:", valores);
      return { estado: "sucesso", erros: {}, resumo: null, valores: ESTADO_INICIAL.valores };
    }
    return {
      estado: "falha",
      erros: {},
      resumo: `Ainda não conseguimos receber pedidos por aqui. Escreva para ${EMAIL_IMPERIO} — respondemos em até um dia útil.`,
      valores,
    };
  }

  try {
    const resposta = await fetch(destino, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...valores,
        telefone: soDigitos(valores.telefone),
        recebidoEm: new Date().toISOString(),
        origem: "site/contato",
      }),
      /* Sem timeout o pedido pode ficar pendurado e a pessoa olhando um botão
         desabilitado. 10s é folgado para um webhook e curto para a espera. */
      signal: AbortSignal.timeout(10_000),
    });

    if (!resposta.ok) throw new Error(`webhook devolveu ${resposta.status}`);
  } catch (erro) {
    console.error("[contato] falha ao enviar:", erro);
    return {
      estado: "falha",
      erros: {},
      /* A mensagem diz O QUE FAZER, e os valores voltam junto — o formulário se
         repovoa e ninguém redigita nada. */
      resumo: `Não conseguimos enviar agora. Tente de novo em alguns minutos, ou escreva para ${EMAIL_IMPERIO}.`,
      valores,
    };
  }

  return { estado: "sucesso", erros: {}, resumo: null, valores: ESTADO_INICIAL.valores };
}
