import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import {
  atualizadaEm,
  controlador,
  destino,
  retencao,
} from "./dados-politica";

export const metadata: Metadata = {
  title: "Política de Privacidade — Império Construtora",
  description:
    "Quem trata os seus dados, o que o formulário coleta, para quê, por quanto tempo e como exercer seus direitos. Este site não grava cookies.",
};

/* A Política de Privacidade. Um documento, não uma página de campanha.

   ══ NENHUM DADO CADASTRAL ESTÁ ESCRITO AQUI ══

   Razão social, CNPJ, endereço, prazos de retenção e a data desta versão vêm
   todos de ./dados-politica.ts, e os que ainda faltam estão lá marcados com o
   literal "(em definição)". O que mora nesta página é o TEXTO CORRIDO — ele não
   é dado, é redação, e redação pertence à rota que a exibe.

   ══⚠══ ESTA ROTA NÃO PODE IR AO AR COMO ESTÁ ══⚠══

   Os campos marcados "(em definição)" incluem a identificação do controlador.
   Uma política no ar sem identificar quem responde pelos dados não cumpre o
   art. 9º da LGPD. Ou os campos são preenchidos, ou a rota não sobe. A lista
   completa está no topo de ./dados-politica.ts.

   ══ O QUE MUDOU EM RELAÇÃO AO DOCUMENTO DE ORIGEM ══

   A estrutura e as nove seções são as do projeto LDF. O que foi reescrito, e
   não traduzido:

     1. OS DADOS COLETADOS são os do NOSSO formulário — tipo de obra e estágio
        da obra, não ambiente de móvel.

     2. O CAMINHO DO PEDIDO. Lá os dois caminhos terminam no WhatsApp da
        empresa. Aqui o caminho do WhatsApp foi removido do formulário quando
        ainda não havia número, e a variável de destino está vazia: hoje NADA é
        entregue e NADA fica armazenado. A seção de compartilhamento diz isso.
        O número chegou depois e entrou só como canal do controlador, no
        <address>; o formulário continua sem desvio para o WhatsApp. Se esse
        desvio voltar, a seção de compartilhamento muda no mesmo commit.

     3. OS COOKIES E OS TERCEIROS. Lá as fontes entram por next/font/google, que
        as serve do próprio domínio, e a política afirma que nenhum terceiro
        recebe requisição. Aqui a licença ITF proíbe auto-hospedar a Switzer e a
        Zodiak: elas vêm da Fontshare em execução, e isso é uma requisição a um
        terceiro que a política tem de declarar. Medido, não deduzido — ver o
        registro em ./dados-politica.ts.

   ══ HIERARQUIA ══

   Um <h1> só, o título do documento. Cada seção é <h2> com id — ancorável, e
   escrito para responder à dúvida de quem chegou ("Por quanto tempo vocês
   guardam") em vez de classificar juridicamente ("Do prazo de retenção"). */

/* A data de exibição é DERIVADA de `atualizadaEm`, que é a única fonte.
   `Date.UTC` mais `timeZone: "UTC"` evitam a armadilha clássica: uma data ISO
   sem hora é interpretada como meia-noite UTC, e formatada num servidor a oeste
   de Greenwich ela recua um dia. */
function dataPorExtenso(iso: string) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(ano, mes - 1, dia)));
}

/* Medida de leitura. Não é "container de largura máxima" no sentido que o
   AGENTS.md proíbe — a seção segue full-bleed com o padding lateral de sempre;
   o que tem teto é a COLUNA DE TEXTO, porque linha de 16px correndo 1920px dá
   duzentos e tantos caracteres e ninguém acha o começo da linha seguinte. */
const COLUNA = "max-w-[68ch]";

const H2 = "mt-16 text-subheading text-ink md:text-heading-sm";
const P = "mt-6 text-body-lg text-ink";
const P_SECUNDARIO = "mt-6 text-body text-graphite";
const UL = "mt-6 flex list-disc flex-col gap-3 pl-5 text-body-lg text-ink";
const LINK =
  "underline decoration-ash underline-offset-4 transition-colors hover:decoration-gold-dk hover:text-gold-dk " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dk";

/* O marcador aparece muitas vezes e precisa ser LEGÍVEL como pendência, não
   como texto comum — quem revisar o documento tem de bater o olho e achar. */
function Pendente({ valor }: { valor: string }) {
  return <span className="text-graphite">{valor}</span>;
}

export default function PaginaPrivacidade() {
  const email = controlador.email;

  return (
    <>
      <main className="bg-bone px-gutter py-16 max-[479px]:px-gutter-sm">
        {/* Chrome mínimo: só a marca, de volta para a home.

            ⚠ NÃO troque por <Image src={hero.logo}>. O arquivo do logotipo é
            dourado sobre transparente e mede de 1,71 a 2,66:1 contra o bone —
            abaixo dos 3:1 de gráfico não textual, e contra a regra de que o
            #B79653 só existe sobre fundo escuro. Em /contato ele serve porque
            lá o fundo é ink. */}
        <Link
          href="/"
          className={`inline-block ${LINK} no-underline`}
          aria-label="Império Construtora, ir para o início"
        >
          <span className="font-display text-subheading font-light tracking-[0.12em] text-ink">
            IMPÉRIO
          </span>
        </Link>

        <article className={`${COLUNA} mt-16`}>
          <header>
            <h1 className="text-heading-sm text-ink md:text-heading">
              Política de Privacidade
            </h1>
            <p className={P}>
              O que a Império faz com o que você escreve no formulário deste
              site: quais dados, para quê, com quem, por quanto tempo — e o que
              você pode exigir a respeito.
            </p>
            <p className="mt-8 text-caption uppercase tracking-[0.1em] text-graphite">
              Última atualização em{" "}
              <time dateTime={atualizadaEm}>{dataPorExtenso(atualizadaEm)}</time>
            </p>
          </header>

          <section id="controlador">
            <h2 className={H2}>Quem está com os seus dados</h2>
            <p className={P}>
              Quem decide o que é feito com os seus dados — o{" "}
              <strong className="font-normal text-ink">controlador</strong>, no
              vocabulário da LGPD — é a empresa abaixo. É para ela que você
              reclama, e é dela que você cobra.
            </p>
            <address className="mt-6 flex flex-col gap-1 text-body-lg not-italic text-ink">
              <span>
                {controlador.nomeFantasia} — razão social{" "}
                <Pendente valor={controlador.razaoSocial} />
              </span>
              <span>
                CNPJ <Pendente valor={controlador.cnpj} />
              </span>
              <span>
                Endereço <Pendente valor={controlador.endereco} />, em{" "}
                {controlador.municipio}
              </span>
              <span className="mt-4">
                Encarregado pelo tratamento de dados{" "}
                <Pendente valor={controlador.encarregado} />
              </span>
              <a href={`mailto:${email}`} className={`mt-4 ${LINK}`}>
                {email}
              </a>
              {/* Texto puro, sem link — ver o comentário em dados-politica.ts. */}
              <span>{controlador.telefone}</span>
            </address>
            <p className={P_SECUNDARIO}>
              Qualquer pedido sobre os seus dados — ver, corrigir, apagar,
              revogar — vai para esse e-mail. Não existe formulário separado nem
              canal especial: é o mesmo endereço que responde o resto.
            </p>
          </section>

          <section id="dados">
            <h2 className={H2}>Que dados a gente coleta</h2>
            <p className={P}>
              Só o que o formulário de contato pede, e nada além. Quando você
              envia um pedido, chegam até a Império:
            </p>
            <ul className={UL}>
              <li>seu nome;</li>
              <li>seu telefone;</li>
              <li>seu e-mail;</li>
              <li>o tipo de obra que você marcou — pode ser mais de um;</li>
              <li>o estágio em que a obra está;</li>
              <li>a mensagem, quando você escreve uma — o campo é opcional;</li>
              <li>a data e a hora do envio.</li>
            </ul>
            <p className={P}>
              Não pedimos CPF, RG, dado de pagamento nem o endereço da obra. Se
              algum desses for necessário mais adiante, será pedido diretamente a
              você, na conversa, e não por este site.
            </p>
          </section>

          <section id="para-que">
            <h2 className={H2}>Para que a gente usa</h2>
            <p className={P}>
              Para duas coisas, e as duas são o que você esperaria de quem pediu
              um orçamento:
            </p>
            <ul className={UL}>
              <li>
                <strong className="font-normal">Responder ao seu pedido</strong>{" "}
                — entender o que você quer construir ou reformar, tirar dúvidas,
                combinar uma visita ao local e apresentar o orçamento.
              </li>
              <li>
                <strong className="font-normal">
                  Fazer contato comercial sobre essa obra
                </strong>{" "}
                — retomar a conversa se ela parar, avisar de prazo e falar de
                condições.
              </li>
            </ul>
            <p className={P}>
              Não usamos os seus dados para perfilamento, não montamos público de
              anúncio com eles e não decidimos nada sobre você de forma
              automatizada.
            </p>
          </section>

          <section id="base-legal">
            <h2 className={H2}>Com que direito a gente trata</h2>
            <p className={P}>
              São duas bases legais diferentes, e elas valem separadamente — essa
              separação é o que garante que você não perca uma coisa ao recusar a
              outra.
            </p>
            <ul className={UL}>
              <li>
                <strong className="font-normal">Responder ao seu pedido:</strong>{" "}
                procedimentos preliminares de contrato, a pedido do titular —
                art. 7º, V da LGPD. Você pediu um orçamento; a Império precisa
                dos seus dados para dar esse orçamento. Aqui não há consentimento
                a dar nem a revogar: é o que você foi lá fazer.
              </li>
              <li>
                <strong className="font-normal">
                  Contato comercial depois disso:
                </strong>{" "}
                consentimento — art. 7º, I da LGPD. É a caixa que você marca no
                formulário, e é só ela.
              </li>
            </ul>
            <p className={P}>
              <strong className="font-normal">
                Revogar o consentimento não cancela a resposta ao seu pedido.
              </strong>{" "}
              Se você pedir para parar de receber contato comercial, a Império
              para — e continua devendo, e entregando, a resposta ao orçamento
              que você solicitou. São coisas separadas de propósito.
            </p>
          </section>

          <section id="compartilhamento">
            <h2 className={H2}>Com quem a gente compartilha</h2>
            <p className={P}>
              O seu pedido não é vendido, alugado nem cedido a ninguém. Ele passa
              apenas por quem precisa tocá-lo para que a Império consiga
              responder:
            </p>
            <ul className={UL}>
              <li>
                <strong className="font-normal">
                  O sistema que recebe o pedido.
                </strong>{" "}
                <Pendente valor={destino.sistema} />. Hoje o formulário não
                entrega o pedido a sistema nenhum: enquanto esse destino não
                existir, a página de contato pede que você escreva direto para o
                e-mail da empresa, e a conversa acontece por e-mail.
              </li>
              <li>
                <strong className="font-normal">Quem desenvolve o site.</strong>{" "}
                <Pendente valor={destino.desenvolvedor} />.
              </li>
              <li>
                <strong className="font-normal">Hospedagem.</strong> As páginas e
                o processamento do formulário rodam na infraestrutura do provedor
                de hospedagem contratado, que registra o acesso como qualquer
                servidor web faz.
              </li>
              <li>
                <strong className="font-normal">
                  Quem serve as fontes tipográficas.
                </strong>{" "}
                As duas fontes deste site são carregadas da Fontshare no momento
                em que a página abre, e por isso ela recebe o seu endereço IP e o
                seu navegador. Isso vale para qualquer página do site, mesmo sem
                você preencher nada — e não envolve nenhum dado do formulário.
              </li>
            </ul>
            <p className={P}>
              Fora esses, ninguém. Não há rede de publicidade, corretora de dados
              nem parceiro comercial recebendo o seu contato.
            </p>
          </section>

          <section id="prazo">
            <h2 className={H2}>Por quanto tempo a gente guarda</h2>
            <ul className={UL}>
              <li>
                <strong className="font-normal">
                  Se você pediu orçamento e não fechou:
                </strong>{" "}
                <Pendente valor={retencao.pedidoSemContrato} />, contados do
                último contato entre nós. Depois disso o dado é eliminado.
              </li>
              <li>
                <strong className="font-normal">Se você virou cliente:</strong>{" "}
                <Pendente valor={retencao.cliente} />, contados da entrega da
                obra.
              </li>
            </ul>
            <p className={P}>
              O prazo de cliente não é um número redondo escolhido por
              comodidade: durante todo o período em que a empresa ainda pode ser
              acionada por uma obra, ela precisa conseguir dizer de quem era essa
              obra, o que foi executado e quando. Guardar menos que esse período
              seria não ter como responder por ele.
            </p>
          </section>

          <section id="direitos">
            <h2 className={H2}>Os seus direitos, e como usar</h2>
            <p className={P}>
              O art. 18 da LGPD te dá o seguinte, sobre os dados que a Império
              tem a seu respeito:
            </p>
            <ul className={UL}>
              <li>
                <strong className="font-normal">Confirmação</strong> — saber se
                existe algum tratamento dos seus dados.
              </li>
              <li>
                <strong className="font-normal">Acesso</strong> — ver quais dados
                a Império tem.
              </li>
              <li>
                <strong className="font-normal">Correção</strong> — consertar
                dado incompleto, inexato ou desatualizado.
              </li>
              <li>
                <strong className="font-normal">
                  Anonimização, bloqueio ou eliminação
                </strong>{" "}
                — de dado desnecessário, excessivo ou tratado fora da lei.
              </li>
              <li>
                <strong className="font-normal">Portabilidade</strong> — receber
                os seus dados em formato que dê para levar a outro fornecedor.
              </li>
              <li>
                <strong className="font-normal">Eliminação</strong> — apagar os
                dados tratados com base no seu consentimento.
              </li>
              <li>
                <strong className="font-normal">
                  Informação sobre compartilhamento
                </strong>{" "}
                — saber com que entidades públicas e privadas a Império
                compartilhou os seus dados.
              </li>
              <li>
                <strong className="font-normal">
                  Revogação do consentimento
                </strong>{" "}
                — a qualquer momento, sem justificar, e sem perder a resposta ao
                pedido que você fez.
              </li>
            </ul>
            <p className={P}>
              Para exercer qualquer um deles, escreva para{" "}
              <a href={`mailto:${email}`} className={LINK}>
                {email}
              </a>
              . Diga qual direito você quer exercer e o nome e o e-mail que você
              usou no formulário — é o que permite achar o seu registro. A
              Império responde em até 15 dias.
            </p>
          </section>

          <section id="cookies">
            <h2 className={H2}>Cookies: este site não usa</h2>
            <p className="mt-6 border-l-2 border-ash pl-6 text-body-lg text-ink">
              Este site não grava nenhum cookie no seu navegador. Nenhum, nem os
              chamados &ldquo;essenciais&rdquo;.
            </p>
            <p className={P}>
              Não há Google Analytics, não há gerenciador de tags, não há pixel
              de rede social e não há script de terceiro em nenhuma página. Nada
              é guardado no seu navegador entre uma visita e outra.
            </p>
            <p className={P}>
              <strong className="font-normal">
                Uma requisição sai daqui para fora, e ela precisa ser dita:
              </strong>{" "}
              as duas fontes tipográficas do site são carregadas da Fontshare
              quando a página abre. Isso não grava cookie, mas faz com que a
              Fontshare receba o seu endereço IP e o seu navegador, como acontece
              em qualquer arquivo que o site busca fora do próprio domínio. A
              licença dessas fontes não permite que a gente as hospede aqui.
            </p>
            <p className={P}>
              É por isso que você não vê banner de cookies. Não existe um porque
              não há cookie a consentir. Se isso mudar, esta seção muda junto e no
              mesmo dia, e o banner aparece antes de qualquer script novo rodar.
            </p>
          </section>

          <section id="mudancas">
            <h2 className={H2}>Se esta política mudar</h2>
            <p className={P}>
              A data no topo desta página é a da versão vigente. Mudança que
              altere o que é coletado, para quê ou com quem é compartilhado vem
              acompanhada de nova data — e, quando depender do seu consentimento,
              de um novo pedido de consentimento, não de um aviso.
            </p>
            <p className={P_SECUNDARIO}>
              Dúvida sobre qualquer coisa aqui:{" "}
              <a href={`mailto:${email}`} className={LINK}>
                {email}
              </a>
              , ou pelos canais da{" "}
              <Link href="/contato" className={LINK}>
                página de contato
              </Link>
              .
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
