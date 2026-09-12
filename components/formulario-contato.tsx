"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef } from "react";

import { enviarContato } from "@/app/contato/actions";
import {
  consentimento,
  ESTADO_INICIAL,
  LIMITE_MENSAGEM,
  LIMITE_NOME,
  opcoesEstagio,
  opcoesTipoObra,
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

   ⚠ O QUE NÃO VEIO DE LÁ, DE PROPÓSITO: o caminho de entrega por WhatsApp. Na
   LDF, com JS, o botão intercepta o envio e abre o wa.me da empresa em vez de
   postar na action. Aqui não: o pedido percorre um caminho só, a Server
   Action, com e sem script. Ver o bloco da ENTREGA em app/contato/actions.ts.
   Não reintroduza um `onSubmit` que desvie a action.

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

  /* FOCO NO RESUMO quando o envio falha. Sem isto o leitor de tela não fica
     sabendo de nada: a página não navegou, e o texto novo apareceu longe do
     ponto de foco. O resumo tem tabIndex -1 para receber foco por script sem
     entrar na ordem do Tab. */
  useEffect(() => {
    if (estado.estado === "erro" || estado.estado === "falha") {
      resumoRef.current?.focus();
    }
  }, [estado]);

  const v = estado.valores;
  const erro = estado.erros;

  /* ══ SUCESSO: o formulário SAI e a confirmação entra no lugar ══

     Em região `aria-live="polite"` com `role="status"`, para o leitor de tela
     anunciar sem interromper. Nada de navegar para outra rota — a pessoa
     perderia o contexto e o botão Voltar reenviaria o formulário — e nada de
     alert(), que é diálogo do navegador e não parte da página. */
  if (estado.estado === "sucesso") {
    return (
      <div className="form__sucesso" role="status" aria-live="polite">
        <p className="form__sucesso-titulo">Pedido recebido.</p>
        <p className="form__sucesso-texto">
          A gente responde em até um dia útil com os próximos passos.
        </p>
      </div>
    );
  }

  const falhou = estado.estado === "erro" || estado.estado === "falha";

  return (
    <form className="form" action={acao} noValidate>
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
      {falhou && estado.resumo ? (
        <div className="form__resumo" role="alert" tabIndex={-1} ref={resumoRef}>
          {estado.resumo}
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
