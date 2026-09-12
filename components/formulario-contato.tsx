"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";

import { enviarContato } from "@/app/contato/actions";
import {
  consentimento,
  ESTADO_INICIAL,
  LIMITE_MENSAGEM,
  LIMITE_NOME,
  opcoesEstagio,
  opcoesTipoObra,
  resumoDeErros,
  saneia,
  urlDoPedido,
  validar,
  type EstadoContato,
  type ValoresContato,
} from "@/app/contato/estado";

/* O formulário de /contato. Seis campos, um consentimento e um botão.

   ══ O QUE É OBRIGATÓRIO ══

   Nome, telefone, e-mail e o consentimento. Tipo de obra, Estágio da obra e
   Mensagem são opcionais, e os três dizem isso no rótulo. Sobram DOIS meios de
   contato exigidos — o formulário nunca fica sem como responder a quem
   escreveu.

   ══ ELE É CÓPIA DO FORMULÁRIO DA LDF ══

   components/FormularioContato.tsx de lá, com as classes .form__* que moram na
   seção "FORMULÁRIO DE CONTATO" do nosso app/globals.css. A estrutura do
   markup é a mesma linha a linha; o que mudou foram os campos — Tipo de obra e
   Estágio da obra no lugar de Ambiente —, a paleta e o que está listado no
   cabeçalho daquela seção do CSS.

   ⚠ A ENTREGA POR WHATSAPP VEIO DE LÁ TAMBÉM, E AGORA ESTÁ AQUI. Por uma
   rodada este arquivo dizia o contrário — "o pedido percorre um caminho só, a
   Server Action" —, e isso era verdade enquanto o webhook era questão de dias.
   Não era: medido em produção, 4 de 4 envios válidos morriam em "Ainda não
   conseguimos receber pedidos por aqui" e nenhum lead chegava. O desenho da
   LDF entrou inteiro, com a diferença registrada no `mensagemWhatsApp`.

   ══ FUNCIONA SEM JAVASCRIPT, E ISSO É O EIXO DO ARQUIVO ══

   `useActionState` com uma Server Action é o único arranjo que dá as duas
   coisas ao mesmo tempo: sem JS o navegador faz o POST nativo e o servidor
   devolve a página já com o resultado; com JS o mesmo estado volta sem
   navegação e sem recarregar. Não há dois caminhos de código — há um, e o
   script só melhora o que já funcionava.

   ══ OS VALORES SOBREVIVEM AO ERRO ══

   Todo campo lê `defaultValue`/`defaultChecked` do estado devolvido pela
   action. Num envio falho — de validação ou de rede — a pessoa reencontra
   exatamente o que digitou, inclusive sem JS, onde a página é redesenhada do
   zero. Perder o texto de quem escreveu é o pior desfecho possível aqui.

   ══ POR QUE fieldset/legend, E NÃO UM LABEL SOLTO ══

   Tipo de obra e Estágio são GRUPOS de controles. Com `<fieldset><legend>`, o
   leitor de tela anuncia a pergunta do grupo antes de cada opção — "Tipo de
   obra, Varejo e franquias, caixa de seleção, não marcada". Com um <p> por
   cima de um monte de caixas, ele anuncia só "Varejo e franquias".

   E NÃO SÃO <select>. No celular, uma pastilha é um toque; um select é três —
   abrir, rolar, confirmar. Além disso o grupo de tipo é de múltipla escolha, e
   select múltiplo em telefone é dos piores controles que existem.

   ══ FOCO É outline, E O ANEL É OBRIGATÓRIO ══

   Os campos não têm borda em repouso: quem preenche só sabe onde está pelo
   anel de foco. Ele é `outline` em bone, o mesmo em campo, pastilha, aceite e
   link da nota. */

/* ══════════════════════════════════════════════════════════════════════════
   ⚠⚠⚠  A ENTREGA É POR WHATSAPP, E É PROVISÓRIA
   ══════════════════════════════════════════════════════════════════════════

   Com JavaScript, o botão NÃO posta na Server Action: ele abre o WhatsApp da
   Império com o pedido já escrito, em aba nova. Vale enquanto a
   LEAD_WEBHOOK_URL não existir — e ela não existe.

   ══ OS DOIS VISITANTES TERMINAM NO MESMO LUGAR ══

   Sem script o `onSubmit` não roda, o navegador faz o POST nativo e cai na
   Server Action, que REDIRECIONA para o mesmo wa.me com a mesma mensagem. Não
   há visitante mandado embora, e não há dado redigitado.

   ⚠ `mensagemWhatsApp` E `urlDoPedido` MORAM EM app/contato/estado.ts, e não
   neste arquivo. Os dois lados da fronteira montam o mesmo texto, e uma cópia
   aqui divergiria da outra sem ninguém notar — as duas continuariam
   funcionando. Não as traga para cá.

   ══ O QUE ESTE CAMINHO NÃO TEM, e precisa estar escrito porque some sem aviso ══

     1. O ANTISPAM DE SERVIDOR. Honeypot e carimbo de tempo moram na action, e
        este caminho não passa por ela. Um robô com JS ligado abre uma aba de
        WhatsApp na própria máquina — barulho, não vazamento. Quem não tem JS
        continua passando pela action.

     2. A CHECAGEM QUE DECIDE. A daqui usa `validar()`, a MESMA função da
        action (app/contato/estado.ts). Não diverge — mas continua sendo
        checagem de navegador, que qualquer um contorna.

   ⚠ TODO — DESFAZER QUANDO O WEBHOOK EXISTIR. No dia em que a
   LEAD_WEBHOOK_URL for preenchida, daqui saem o `aoEnviar`, o `estadoZap`, o
   `urlBloqueada`, o `urlAberta` e o `onSubmit` do <form>. O formulário volta a
   ser `<form action={acao}>` puro, e o `redirect()` da action cai junto por não
   ter mais como ser alcançado. O texto de sucesso do webhook já está escrito
   aqui embaixo, esperando. */

const ENVIANDO = "Enviando…";

export function FormularioContato() {
  const [estado, acao, pendente] = useActionState(enviarContato, ESTADO_INICIAL);

  /* Ids estáveis entre servidor e cliente, para o aria-describedby de cada
     campo. `useId` existe exatamente para isso — string fixa daria colisão se o
     formulário aparecesse duas vezes na página. */
  const id = useId();
  const campo = (n: string) => `${id}-${n}`;
  const erroId = (n: string) => `${id}-${n}-erro`;

  const resumoRef = useRef<HTMLDivElement>(null);

  /* O CARIMBO É ESCRITO NO CLIENTE, na montagem. Não pode vir do servidor: a
     rota é estática, então o valor seria a hora do build — igual para todo
     mundo e velho de horas. Sem JS ele fica vazio e a action PULA a checagem em
     vez de reprovar; o porquê está lá.

     ⚠ ESCRITO NO DOM POR REF, e não por estado. `setState` dentro de efeito
     dispara render em cascata e o lint reprova (react-hooks/set-state-in-effect)
     — com razão: o valor não participa de render nenhum, só precisa estar no
     campo na hora do POST. */
  const carimboRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (carimboRef.current) carimboRef.current.value = String(Date.now());
  }, []);

  /* O estado do caminho do WHATSAPP. Fica separado do `estado` da action de
     propósito: são dois caminhos, e misturar os dois num objeto só faria o
     resultado de um aparecer depois do outro sem ninguém entender por quê.
     Nulo enquanto ninguém tentou enviar por aqui. */
  const [estadoZap, setEstadoZap] = useState<EstadoContato | null>(null);

  /* ⚠ A URL DO WHATSAPP QUANDO A JANELA NÃO ABRIU.

     `window.open` devolve `null` quando o navegador bloqueia o pop-up, e o
     bloqueio é comum: basta o navegador não reconhecer o envio como gesto do
     usuário, ou a pessoa ter o bloqueador ligado. Guardando a URL aqui, o
     pedido não se perde — ela vira um link que a pessoa clica. */
  const [urlBloqueada, setUrlBloqueada] = useState<string | null>(null);

  /* A URL QUE FOI ABERTA COM SUCESSO, guardada para o link "abrir de novo" da
     tela de confirmação.

     ⚠ NÃO DÁ PARA REMONTAR A URL NA HORA DE DESENHAR AQUELA TELA: no sucesso
     os `valores` voltam ZERADOS de propósito — é o que impede o formulário de
     reaparecer preenchido se a pessoa voltar. Remontando dali sairia um
     wa.me com a mensagem vazia, que é pior do que não ter link. */
  const [urlAberta, setUrlAberta] = useState<string | null>(null);

  /* Quem manda na tela: o caminho do WhatsApp, quando houve tentativa; a
     action, senão. */
  const visivel = estadoZap ?? estado;

  /* FOCO NO RESUMO quando o envio falha. Sem isto o leitor de tela não fica
     sabendo de nada: a página não navegou, e o texto novo apareceu longe do
     ponto de foco. O resumo tem tabIndex -1 para receber foco por script sem
     entrar na ordem do Tab. */
  useEffect(() => {
    if (visivel.estado === "erro" || visivel.estado === "falha") {
      resumoRef.current?.focus();
    }
  }, [visivel]);

  /* ⚠ PROVISÓRIO — ver o bloco A ENTREGA É POR WHATSAPP no topo do arquivo.

     `preventDefault` é o que tira a Server Action do caminho quando há script.
     Sem script esta função não roda, o POST nativo vai para a action, e ela
     redireciona para o mesmo lugar. */
  function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const dados = new FormData(evento.currentTarget);
    const ler = (c: string) => {
      const x = dados.get(c);
      return typeof x === "string" ? x.trim() : "";
    };
    /* `saneia` é a MESMA da action: valor de tipo ou estágio fora da lista
       conhecida é descartado em silêncio, porque os dois são opcionais. */
    const valores: ValoresContato = saneia(
      {
        nome: ler("nome"),
        telefone: ler("telefone"),
        email: ler("email"),
        tipoObra: dados
          .getAll("tipoObra")
          .filter((x): x is string => typeof x === "string"),
        estagio: ler("estagio"),
        mensagem: ler("mensagem"),
        consentimento: dados.get("consentimento") === "sim",
      },
      { tipos: opcoesTipoObra, estagios: opcoesEstagio },
    );

    /* A MESMA validação da action. Ver app/contato/estado.ts. */
    const erros = validar(valores);
    const resumoAgora = resumoDeErros(erros);
    if (resumoAgora) {
      setEstadoZap({ estado: "erro", erros, resumo: resumoAgora, valores });
      return;
    }

    const url = urlDoPedido(valores);

    /* ══ O RETORNO DE `window.open` É VERIFICADO ══

       Com o pop-up bloqueado, `window.open` devolve `null` e nenhuma aba abre.
       Marcar sucesso sem olhar o resultado é o pior desfecho que este
       formulário pode ter: o pedido some e a pessoa vai embora achando que
       enviou — exatamente o defeito que esta rodada veio consertar no
       servidor.

       AS TRÊS CHECAGENS SÃO NECESSÁRIAS, e cada uma cobre um navegador
       diferente: `null` é o caso comum; `undefined` aparece em ambientes
       embutidos que não implementam o retorno; e uma janela que nasce com
       `closed === true` é o que alguns bloqueadores devolvem no lugar de
       `null` — abrem e fecham no mesmo quadro. */
    const janela = window.open(url, "_blank", "noopener,noreferrer");
    if (!janela || janela.closed) {
      setUrlBloqueada(url);
      /* SEM sucesso. O formulário fica na tela, com os valores intactos: a
         pessoa clica no link, ou aperta Enviar de novo — o segundo toque
         costuma passar, porque aí o navegador tem um gesto recente. */
      return;
    }

    setUrlBloqueada(null);
    setUrlAberta(url);
    setEstadoZap({
      estado: "sucesso",
      erros: {},
      resumo: null,
      valores: ESTADO_INICIAL.valores,
    });
  }

  const v = visivel.valores;
  const erro = visivel.erros;

  /* ══ SUCESSO: o formulário SAI e a confirmação entra no lugar ══

     Em região `aria-live="polite"` com `role="status"`, para o leitor de tela
     anunciar sem interromper. Nada de navegar para outra rota — a pessoa
     perderia o contexto e o botão Voltar reenviaria o formulário — e nada de
     alert(), que é diálogo do navegador e não parte da página.

     ⚠ SÃO DOIS TEXTOS, E A ORIGEM DECIDE QUAL. Não é preciosismo: os dois
     caminhos terminam em coisas diferentes, e um texto só mentiria para
     metade das pessoas.

       · pelo WHATSAPP (hoje, sempre): a conversa abriu com a mensagem escrita
         e ela ainda NÃO foi enviada. Dizer "recebido" aqui seria repetir o
         defeito que esta rodada veio consertar — a Império não recebeu nada
         enquanto a pessoa não tocar em enviar, no aplicativo.

       · pelo WEBHOOK (quando a LEAD_WEBHOOK_URL existir): aí sim o pedido
         chegou a um sistema, e "recebido" é verdade. Este ramo é
         inalcançável hoje. */
  if (visivel.estado === "sucesso") {
    const peloZap = estadoZap !== null;
    return (
      <div className="form__sucesso" role="status" aria-live="polite">
        {peloZap ? (
          <>
            <p className="form__sucesso-titulo">O WhatsApp abriu com o seu pedido.</p>
            <p className="form__sucesso-texto">
              A conversa abriu em outra aba, com tudo o que você preencheu já
              escrito. Falta só tocar em enviar por lá — até isso acontecer, a
              Império ainda não recebeu nada.
            </p>
            {/* A aba pode ter aberto atrás da janela, ou ter sido fechada sem
                querer. O link é a mesma URL, e leva a mensagem inteira junto. */}
            <a
              className="form__sucesso-link"
              href={urlAberta ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Não achou a aba? Abrir o WhatsApp de novo
            </a>
          </>
        ) : (
          <>
            <p className="form__sucesso-titulo">Pedido recebido.</p>
            <p className="form__sucesso-texto">
              A gente responde em até um dia útil com os próximos passos.
            </p>
          </>
        )}
      </div>
    );
  }

  const falhou = visivel.estado === "erro" || visivel.estado === "falha";

  return (
    <form className="form" action={acao} onSubmit={aoEnviar} noValidate>
      {/* ══ HONEYPOT ══
          Fora da tela pela classe, invisível para leitor de tela pelo
          aria-hidden, fora do Tab pelo tabIndex -1 e ignorado pelo
          preenchimento automático. Gente não chega nele por caminho nenhum;
          robô que lê o HTML e completa tudo, sim. A action descarta em
          silêncio — ver o comentário lá. */}
      <div className="form__isca" aria-hidden="true">
        <label htmlFor={campo("site")}>Não preencha este campo</label>
        <input
          id={campo("site")}
          name="site"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <input type="hidden" name="carimbo" defaultValue="" ref={carimboRef} />

      {/* O RESUMO, no topo e antes de tudo. É o que dá ao leitor de tela a
          notícia de que o envio falhou; sem ele, a única pista seria visual.
          `role="alert"` anuncia na hora. */}
      {falhou && visivel.resumo ? (
        <div className="form__resumo" role="alert" tabIndex={-1} ref={resumoRef}>
          {visivel.resumo}
        </div>
      ) : null}

      {/* ══ O POP-UP FOI BLOQUEADO ══

          `role="alert"` porque é notícia que interrompe: a pessoa acha que
          enviou e não enviou. O link carrega a MESMA url que a janela teria
          aberto, com a mensagem inteira dentro — nada precisa ser redigitado.

          Fica ACIMA do formulário e não no lugar dele: o pedido continua na
          tela, então tentar de novo é apertar o botão. */}
      {urlBloqueada ? (
        <div className="form__bloqueado" role="alert">
          <p className="form__bloqueado-titulo">O WhatsApp não abriu.</p>
          <p className="form__bloqueado-texto">
            O navegador bloqueou a janela. O seu pedido está pronto — abra a
            conversa pelo link abaixo, com a mensagem já escrita.
          </p>
          <a
            className="form__bloqueado-link"
            href={urlBloqueada}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir o WhatsApp
          </a>
        </div>
      ) : null}

      <div className="form__campo">
        <label className="form__rotulo" htmlFor={campo("nome")}>
          Nome
        </label>
        <input
          className="form__entrada"
          id={campo("nome")}
          name="nome"
          type="text"
          autoComplete="name"
          required
          maxLength={LIMITE_NOME.max}
          defaultValue={v.nome}
          aria-invalid={erro.nome ? true : undefined}
          aria-describedby={erro.nome ? erroId("nome") : undefined}
        />
        {erro.nome ? (
          <p className="form__erro" id={erroId("nome")}>
            {erro.nome}
          </p>
        ) : null}
      </div>

      <div className="form__campo">
        <label className="form__rotulo" htmlFor={campo("telefone")}>
          Telefone
        </label>
        {/* `inputMode="tel"` levanta o teclado numérico no celular sem exigir
            máscara — e máscara pediria dependência, que não entra. */}
        <input
          className="form__entrada"
          id={campo("telefone")}
          name="telefone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="(11) 90000-0000"
          defaultValue={v.telefone}
          aria-invalid={erro.telefone ? true : undefined}
          aria-describedby={erro.telefone ? erroId("telefone") : undefined}
        />
        {erro.telefone ? (
          <p className="form__erro" id={erroId("telefone")}>
            {erro.telefone}
          </p>
        ) : null}
      </div>

      <div className="form__campo">
        <label className="form__rotulo" htmlFor={campo("email")}>
          E-mail
        </label>
        <input
          className="form__entrada"
          id={campo("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          defaultValue={v.email}
          aria-invalid={erro.email ? true : undefined}
          aria-describedby={erro.email ? erroId("email") : undefined}
        />
        {erro.email ? (
          <p className="form__erro" id={erroId("email")}>
            {erro.email}
          </p>
        ) : null}
      </div>

      {/* Múltipla escolha, checkbox por baixo das pastilhas.

          ⚠ SEM aria-invalid E SEM BLOCO DE ERRO: o grupo é OPCIONAL. Não há
          estado inválido para anunciar — valor fora da lista é descartado em
          silêncio pelo `saneia()` do servidor, não devolvido como erro. */}
      <fieldset className="form__grupo">
        <legend className="form__rotulo">
          Tipo de obra <span className="form__opcional">(opcional)</span>
        </legend>
        <p className="form__ajuda">Pode marcar mais de um.</p>
        <div className="form__pastilhas">
          {opcoesTipoObra.map((op) => (
            <label className="form__pastilha" key={op}>
              <input
                type="checkbox"
                name="tipoObra"
                value={op}
                defaultChecked={v.tipoObra.includes(op)}
              />
              <span>{op}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Escolha única, radio por baixo. Opcional, como o de cima. */}
      <fieldset className="form__grupo">
        <legend className="form__rotulo">
          Estágio da obra <span className="form__opcional">(opcional)</span>
        </legend>
        <div className="form__pastilhas">
          {opcoesEstagio.map((op) => (
            <label className="form__pastilha" key={op}>
              <input
                type="radio"
                name="estagio"
                value={op}
                defaultChecked={v.estagio === op}
              />
              <span>{op}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form__campo">
        <label className="form__rotulo" htmlFor={campo("mensagem")}>
          Mensagem <span className="form__opcional">(opcional)</span>
        </label>
        <textarea
          className="form__entrada form__area"
          id={campo("mensagem")}
          name="mensagem"
          rows={4}
          maxLength={LIMITE_MENSAGEM}
          defaultValue={v.mensagem}
          aria-invalid={erro.mensagem ? true : undefined}
          aria-describedby={erro.mensagem ? erroId("mensagem") : undefined}
        />
        {erro.mensagem ? (
          <p className="form__erro" id={erroId("mensagem")}>
            {erro.mensagem}
          </p>
        ) : null}
      </div>

      {/* ══ CONSENTIMENTO ══
          Caixa separada, e ANTES do botão. Consentimento embutido no ato de
          enviar ("ao enviar você concorda") não é consentimento: não há ato
          próprio, e não dá para enviar sem concordar sem querer.

          ══ O LINK DA POLÍTICA FICA FORA DA DECLARAÇÃO ══

          O que está dentro do <label> é a DECLARAÇÃO que a pessoa assina;
          misturar nela um link é misturar o que se aceita com onde se lê sobre
          isso — e, na prática, é pôr um alvo de clique que navega para fora
          dentro do alvo de clique que marca a caixa. Quem erra o alvo perde o
          formulário preenchido.

          A nota abaixo é a saída: mesmo bloco, fora do rótulo, alcançável pelo
          Tab logo depois da caixa. Ela NÃO é decoração — sem ela o checkbox
          pede autorização sem dizer para quê, e o consentimento deixa de ser
          informado. */}
      <div className="form__consentimento">
        <label className="form__aceite">
          <input
            type="checkbox"
            name="consentimento"
            value="sim"
            defaultChecked={v.consentimento}
            aria-invalid={erro.consentimento ? true : undefined}
            aria-describedby={erro.consentimento ? erroId("consentimento") : undefined}
          />
          <span>{consentimento}</span>
        </label>
        {erro.consentimento ? (
          <p className="form__erro" id={erroId("consentimento")}>
            {erro.consentimento}
          </p>
        ) : null}
        <p className="form__nota-politica">
          Quais dados, por quanto tempo e como pedir para apagar:{" "}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </p>
      </div>

      <button
        type="submit"
        disabled={pendente}
        className="inline-flex h-14 w-fit items-center justify-center rounded-pill bg-gold px-8 text-body-sm uppercase tracking-[0.1em] text-ink transition-colors hover:bg-gold-lt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone disabled:opacity-70"
      >
        {pendente ? ENVIANDO : "Enviar pedido"}
      </button>
    </form>
  );
}
