"use server";

import { redirect } from "next/navigation";

import {
  ESTADO_INICIAL,
  opcoesEstagio,
  opcoesTipoObra,
  resumoDeErros,
  saneia,
  soDigitos,
  urlDoPedido,
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

/* O canal que a mensagem de falha aponta. O telefone já existe (`telefone` em
   lib/dados.ts), mas a mensagem continua mandando para o e-mail: trocar o
   destino do fallback é decisão à parte, ver o bloco da ENTREGA abaixo. */
const EMAIL_IMPERIO = "contato@imperioconstrutora.com.br";

function texto(dados: FormData, campo: string) {
  const v = dados.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

export async function enviarContato(
  _anterior: EstadoContato,
  dados: FormData,
): Promise<EstadoContato> {
  /* `saneia` joga fora valor de tipo/estágio que não esteja na lista, em
     silêncio — os dois são opcionais, então "não reconheci" e "não respondeu"
     dão no mesmo. Ver o comentário dele em ./estado.ts. */
  const valores: ValoresContato = saneia(
    {
      nome: texto(dados, "nome"),
      telefone: texto(dados, "telefone"),
      email: texto(dados, "email"),
      tipoObra: dados
        .getAll("tipoObra")
        .filter((v): v is string => typeof v === "string"),
      estagio: texto(dados, "estagio"),
      mensagem: texto(dados, "mensagem"),
      consentimento: dados.get("consentimento") === "sim",
    },
    { tipos: opcoesTipoObra, estagios: opcoesEstagio },
  );

  /* ══ ANTISPAM — AS DUAS ARMADILHAS NÃO RESPONDEM MAIS "SUCESSO" ══

     ⚠ ERA ASSIM, E ERA UM DEFEITO: cada uma delas devolvia `estado: "sucesso"`
     e jogava o pedido fora. Contra robô a técnica é clássica; contra GENTE ela
     mente. E gente caía: medido, um envio a 2.060ms da montagem do formulário
     respondia "Pedido recebido." sem nada ter sido recebido — e 3 segundos é
     pouco para quem chega com preenchimento automático do navegador, confere e
     aperta. O formulário vazio, com um clique a 1.302ms, também respondia
     sucesso, sem sequer validar.

     AGORA AS DUAS SÓ MARCAM. Elas não desviam o fluxo e não encerram nada: a
     validação roda para todo mundo, e o que a suspeita faz é UMA coisa só —
     tirar o pedido do webhook, lá na ENTREGA. O visitante suspeito segue para
     o mesmo WhatsApp de todo mundo, e isso não custa nada: um redirecionamento
     não envia mensagem nenhuma: abre uma conversa com o texto escrito, que só
     vai adiante se alguém tocar em enviar.

     Assim a proteção continua valendo exatamente onde ela importa — no dia em
     que houver webhook —, e não há caminho em que a tela diga uma coisa e o
     servidor faça outra.

     1. HONEYPOT. O campo `site` está fora da tela, com aria-hidden, tabindex -1
        e autocomplete off — gente não vê, não tabula e não preenche.
        Preenchido, é robô que leu o HTML e completou tudo.

     2. CARIMBO DE TEMPO. O campo `carimbo` é escrito PELO CLIENTE ao montar o
        formulário. Menos de 3 segundos entre montar e enviar é indício de robô.
        Indício, e não veredito — é por isso que ele não decide mais sozinho o
        destino do pedido.

        ⚠ SEM JS O CARIMBO NÃO EXISTE, e aí a checagem é PULADA em vez de
        reprovar. É a escolha certa e vale registrar por quê: a rota é estática,
        então um carimbo renderizado no servidor seria a hora do BUILD, igual
        para todo mundo e velho de horas — passaria sempre, e daria a impressão
        de proteção sem proteger. Melhor uma checagem que se declara ausente do
        que uma que mente. Quem não tem JS continua coberto pelo honeypot, que
        não depende de script nenhum. */
  const carimbo = Number(texto(dados, "carimbo"));
  const rapidoDemais =
    Number.isFinite(carimbo) && carimbo > 0 && Date.now() - carimbo < RAPIDO_DEMAIS_MS;

  const suspeito = texto(dados, "site") !== "" || rapidoDemais;

  /* ══ VALIDAÇÃO ══ Ver ./estado.ts. Obrigatórios: nome, telefone, e-mail e
     consentimento. Tipo de obra e Estágio são opcionais e não passam por aqui.

     ⚠ A VALIDAÇÃO DO SERVIDOR TAMBÉM PAROU DE EXIGIR OS DOIS. Tirar só do
     cliente deixaria o servidor derrubando envio válido — e como o formulário
     tem `noValidate`, nem no navegador isso apareceria: o erro só surgiria
     depois do POST, sem nada na tela explicando qual campo faltou. */
  const erros = validar(valores);

  const resumo = resumoDeErros(erros);
  if (resumo) {
    return { estado: "erro", erros, resumo, valores };
  }

  /* ══ ENTREGA ══

     DOIS DESTINOS, NESTA ORDEM: o webhook, se existir; o WhatsApp, sempre que
     ele não existir. O visitante nunca fica em tela morta e nunca redigita.

     ══ 1. O WEBHOOK, QUANDO HOUVER ══

     O destino definitivo é um webhook em LEAD_WEBHOOK_URL. Um POST com fetch,
     nenhum SDK, nenhum serviço de e-mail inventado. ELE NÃO EXISTE HOJE: a
     variável não está configurada em lugar nenhum. No dia em que houver um
     endereço, ele entra na variável e este arquivo não muda.

     É aqui, e só aqui, que a suspeita de robô pesa: pedido marcado como
     suspeito não vai para o webhook. Ver o bloco do ANTISPAM acima.

     ══ 2. O WHATSAPP, QUE É O CAMINHO DE HOJE ══

     Com a variável vazia, o pedido vai para o wa.me da Império com a mensagem
     já escrita — a MESMA que o componente monta quando há JavaScript, porque
     as duas pontas chamam `urlDoPedido()` de app/contato/estado.ts. Uma cópia
     só; duas divergiriam sem ninguém notar, já que as duas continuariam
     funcionando.

     ⚠ ERA UMA FALHA, E ISSO PRECISA FICAR REGISTRADO. Com a variável vazia,
     este caminho devolvia "Ainda não conseguimos receber pedidos por aqui" e
     mandava a pessoa escrever um e-mail. Fazia sentido enquanto o webhook era
     questão de dias e a Império não tinha número de WhatsApp. Medido em
     produção: 4 de 4 envios válidos morriam ali, e nenhum lead chegava.

     Quem cai NESTA função é justamente quem NÃO tem JavaScript — com script, o
     componente já abriu a conversa e nem chega aqui. Ir ao ar mandando embora
     com mensagem de erro exatamente quem tem menos recurso é escolher o pior
     desfecho possível.

     ⚠ O `redirect()` FICA FORA DO try/catch. Ele não devolve valor: sinaliza
     lançando uma exceção interna do Next, e um catch por perto a engoliria —
     o desvio nunca aconteceria e a pessoa veria um erro genérico. Por isso ele
     está AQUI EM CIMA, antes do bloco protegido, e não dentro dele.

     ⚠ NADA AQUI DIZ "RECEBIDO". Um formulário que afirma ter recebido sem ter
     para onde mandar é pior que um formulário fora do ar. O que a tela diz, no
     caminho com JavaScript, é que o WhatsApp abriu e que falta a pessoa enviar
     de lá. Ver o bloco de sucesso em components/formulario-contato.tsx. */
  const destino = process.env.LEAD_WEBHOOK_URL;

  if (!destino || suspeito) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[contato] direto para o WhatsApp (webhook ${destino ? "configurado" : "vazio"}, suspeito=${suspeito}):`,
        valores,
      );
    }
    redirect(urlDoPedido(valores));
  }

  try {
    const resposta = await fetch(destino, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      /* ⚠ CAMPO OPCIONAL VAZIO NÃO VAI NO CORPO. Com Tipo de obra e Estágio
         opcionais, mandar `"tipoObra": []` e `"estagio": ""` obriga quem
         monta o e-mail do outro lado a testar array vazio e string vazia — e
         quem esquecer de testar imprime um rótulo órfão, "Tipo de obra:", sem
         nada depois. Chave ausente é o único formato que nenhum template
         renderiza por acidente. O mesmo vale para a mensagem. */
      body: JSON.stringify({
        nome: valores.nome,
        telefone: soDigitos(valores.telefone),
        email: valores.email,
        ...(valores.tipoObra.length > 0 ? { tipoObra: valores.tipoObra } : {}),
        ...(valores.estagio ? { estagio: valores.estagio } : {}),
        ...(valores.mensagem ? { mensagem: valores.mensagem } : {}),
        consentimento: valores.consentimento,
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

  /* ⚠ ESTE SUCESSO É O DO WEBHOOK, E HOJE ELE É INALCANÇÁVEL: com
     LEAD_WEBHOOK_URL vazia, o `redirect()` lá em cima já levou todo mundo para
     o WhatsApp. Ele só volta a existir no dia em que a variável for preenchida.

     ⚠ QUANDO ESSE DIA CHEGAR, CONFIRA O TEXTO DA TELA DE SUCESSO. O
     components/formulario-contato.tsx tem DOIS textos de sucesso, e escolhe
     pela origem: o caminho do WhatsApp diz que a conversa abriu e que falta
     enviar; este aqui diz que o pedido foi recebido. Os dois já estão escritos
     — o que não pode é este caminho passar a usar o texto do outro. */
  return { estado: "sucesso", erros: {}, resumo: null, valores: ESTADO_INICIAL.valores };
}
