"use client";

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

   ══ FUNCIONA SEM JAVASCRIPT, E ISSO É O EIXO DO ARQUIVO ══

   `useActionState` com uma Server Action é o único arranjo que dá as duas
   coisas ao mesmo tempo: sem JS o navegador faz o POST nativo e o servidor
   devolve a página já com o resultado; com JS o mesmo estado volta sem
   navegação e sem recarregar. Não há dois caminhos de código — há um, e o
   script só melhora o que já funcionava.

   É por isso que o componente é `"use client"` e mesmo assim não exige cliente
   nenhum. O `"use client"` existe para o `useActionState` e para o carimbo de
   tempo; tirar o script de cena não quebra nada, só apaga o estado "enviando".

   ⚠ NÃO EXISTE `onSubmit` AQUI, e é a diferença mais importante em relação ao
   projeto de origem. Lá, com JS, o botão interceptava o envio e abria o
   WhatsApp da empresa em vez de postar na action. Aqui não há número de
   telefone — segue "(em definição)" —, então esse caminho saiu inteiro e o
   formulário voltou a ser `<form action={acao}>` puro. Com e sem script o
   pedido percorre exatamente o mesmo código, o que também significa que o
   antispam do servidor cobre os dois. Não reintroduza um `onSubmit` que desvie
   a action.

   ══ OS VALORES SOBREVIVEM AO ERRO ══

   Todo campo lê `defaultValue`/`defaultChecked` do estado devolvido pela
   action. Num envio falho — de validação ou de rede — a pessoa reencontra
   exatamente o que digitou, inclusive sem JS, onde a página é redesenhada do
   zero. Perder o texto de quem escreveu é o pior desfecho possível aqui.

   ══ POR QUE fieldset/legend, E NÃO UM LABEL SOLTO ══

   Tipo de obra e Estágio são GRUPOS de controles. Com `<fieldset><legend>`, o
   leitor de tela anuncia a pergunta do grupo antes de cada opção — "Tipo de
   obra, Varejo e franquias, caixa de seleção, não marcada". Com um <p> por cima
   de um monte de caixas, ele anuncia só "Varejo e franquias".

   E NÃO SÃO <select>. No celular, uma pastilha é um toque; um select é três —
   abrir, rolar, confirmar. Além disso o grupo de tipo é de múltipla escolha, e
   select múltiplo em telefone é dos piores controles que existem.

   ══ FOCO É outline, NUNCA ring ══

   O `ring` do Tailwind é implementado com box-shadow, e o AGENTS.md proíbe
   box-shadow em qualquer elemento. Todo estado de foco daqui usa `outline`. */

const ENVIANDO = "Enviando…";

/* Campo de texto e área compartilham a mesma pele: fundo transparente sobre o
   ink, hairline ash e canto reto — raio de 1440px é só de botão, pastilha e
   tag. 16px no corpo do campo não é estética: abaixo disso o iOS dá zoom ao
   focar o campo. */
const PELE_CAMPO =
  "w-full rounded-card border border-ash bg-transparent px-4 py-3 text-body text-bone " +
  "placeholder:text-ash focus:border-gold-lt focus:outline-2 focus:outline-offset-2 " +
  "focus:outline-gold-lt aria-[invalid=true]:border-gold-lt";

const PELE_PASTILHA =
  "cursor-pointer rounded-pill border border-ash px-4 py-2 text-body-sm text-bone " +
  "transition-colors peer-hover:border-bone peer-checked:border-gold peer-checked:bg-gold " +
  "peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 " +
  "peer-focus-visible:outline-gold-lt";

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
     campo na hora do POST. Mexer no valor de um input não controlado é
     justamente o que um efeito deve fazer. */
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
      <div role="status" aria-live="polite" className="border border-gold px-6 py-8">
        <p className="font-display text-heading-sm text-bone">Pedido recebido.</p>
        <p className="mt-4 max-w-[46ch] text-body text-ash">
          A gente responde em até um dia útil com os próximos passos.
        </p>
      </div>
    );
  }

  const falhou = estado.estado === "erro" || estado.estado === "falha";

  return (
    <form action={acao} noValidate className="flex flex-col gap-8">
      {/* ══ HONEYPOT ══
          Fora da tela, invisível para leitor de tela pelo aria-hidden, fora do
          Tab pelo tabIndex -1 e ignorado pelo preenchimento automático. Gente
          não chega nele por caminho nenhum; robô que lê o HTML e completa tudo,
          sim. A action descarta em silêncio — ver o comentário lá. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px overflow-hidden"
      >
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
        <div
          role="alert"
          tabIndex={-1}
          ref={resumoRef}
          className="border border-gold-lt px-4 py-3 text-body text-gold-lt outline-none"
        >
          {estado.resumo}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <label className="text-body-sm text-bone" htmlFor={campo("nome")}>
          Nome
        </label>
        <input
          className={PELE_CAMPO}
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
          <p className="text-body-sm text-gold-lt" id={erroId("nome")}>
            {erro.nome}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-body-sm text-bone" htmlFor={campo("telefone")}>
          Telefone
        </label>
        {/* `inputMode="tel"` levanta o teclado numérico no celular sem exigir
            máscara — e máscara pediria dependência, que não entra. */}
        <input
          className={PELE_CAMPO}
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
          <p className="text-body-sm text-gold-lt" id={erroId("telefone")}>
            {erro.telefone}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-body-sm text-bone" htmlFor={campo("email")}>
          E-mail
        </label>
        <input
          className={PELE_CAMPO}
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
          <p className="text-body-sm text-gold-lt" id={erroId("email")}>
            {erro.email}
          </p>
        ) : null}
      </div>

      {/* Múltipla escolha, checkbox por baixo das pastilhas. */}
      <fieldset
        aria-invalid={erro.tipoObra ? true : undefined}
        aria-describedby={erro.tipoObra ? erroId("tipoObra") : undefined}
      >
        <legend className="text-body-sm text-bone">Tipo de obra</legend>
        <p className="mt-1 text-caption text-ash">Pode marcar mais de um.</p>
        <div className="mt-4 flex flex-wrap gap-element">
          {opcoesTipoObra.map((op) => (
            <label key={op} className="inline-flex">
              <input
                type="checkbox"
                name="tipoObra"
                value={op}
                defaultChecked={v.tipoObra.includes(op)}
                className="peer sr-only"
              />
              <span className={PELE_PASTILHA}>{op}</span>
            </label>
          ))}
        </div>
        {erro.tipoObra ? (
          <p className="mt-2 text-body-sm text-gold-lt" id={erroId("tipoObra")}>
            {erro.tipoObra}
          </p>
        ) : null}
      </fieldset>

      {/* Escolha única, radio por baixo. */}
      <fieldset
        aria-invalid={erro.estagio ? true : undefined}
        aria-describedby={erro.estagio ? erroId("estagio") : undefined}
      >
        <legend className="text-body-sm text-bone">Estágio da obra</legend>
        <div className="mt-4 flex flex-wrap gap-element">
          {opcoesEstagio.map((op) => (
            <label key={op} className="inline-flex">
              <input
                type="radio"
                name="estagio"
                value={op}
                defaultChecked={v.estagio === op}
                className="peer sr-only"
              />
              <span className={PELE_PASTILHA}>{op}</span>
            </label>
          ))}
        </div>
        {erro.estagio ? (
          <p className="mt-2 text-body-sm text-gold-lt" id={erroId("estagio")}>
            {erro.estagio}
          </p>
        ) : null}
      </fieldset>

      <div className="flex flex-col gap-2">
        <label className="text-body-sm text-bone" htmlFor={campo("mensagem")}>
          Mensagem <span className="text-ash">(opcional)</span>
        </label>
        <textarea
          className={PELE_CAMPO}
          id={campo("mensagem")}
          name="mensagem"
          rows={4}
          maxLength={LIMITE_MENSAGEM}
          defaultValue={v.mensagem}
          aria-invalid={erro.mensagem ? true : undefined}
          aria-describedby={erro.mensagem ? erroId("mensagem") : undefined}
        />
        {erro.mensagem ? (
          <p className="text-body-sm text-gold-lt" id={erroId("mensagem")}>
            {erro.mensagem}
          </p>
        ) : null}
      </div>

      {/* ══ CONSENTIMENTO ══
          Caixa separada, e ANTES do botão. Consentimento embutido no ato de
          enviar ("ao enviar você concorda") não é consentimento: não há ato
          próprio, e não dá para enviar sem concordar sem querer.

          ⚠ NÃO HÁ LINK DE POLÍTICA DE PRIVACIDADE porque a rota não existe
          neste site. No projeto de origem havia uma linha logo abaixo, fora do
          rótulo, apontando para /politica-de-privacidade. Quando a nossa
          existir, a linha volta AQUI — fora do <label>, nunca dentro: misturar
          um link no texto que a pessoa assina é pôr um alvo de clique que
          navega para fora dentro do alvo que marca a caixa, e quem erra o alvo
          perde o formulário preenchido. */}
      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consentimento"
            value="sim"
            defaultChecked={v.consentimento}
            aria-invalid={erro.consentimento ? true : undefined}
            aria-describedby={erro.consentimento ? erroId("consentimento") : undefined}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="mt-0.5 size-5 shrink-0 rounded-card border border-ash transition-colors peer-checked:border-gold peer-checked:bg-gold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-lt"
          />
          <span className="max-w-[52ch] text-body-sm text-ash">{consentimento}</span>
        </label>
        {erro.consentimento ? (
          <p className="text-body-sm text-gold-lt" id={erroId("consentimento")}>
            {erro.consentimento}
          </p>
        ) : null}
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
