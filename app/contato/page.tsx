import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import logoImperio from "@/public/hero/logo-imperio-nav.png";
import { FormularioContato } from "@/components/formulario-contato";
import { NavegacaoFixa } from "@/components/navegacao-fixa";
import { SiteFooter } from "@/components/site-footer";
import { telefone, whatsappUrl } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Contato — Império Construtora",
  description:
    "Fale com a Império Construtora: conte o tipo de obra, o estágio e o prazo. Respondemos em até um dia útil.",
};

/* A ROTA COMEÇA NO FORMULÁRIO. Não há capa.

   Quem chega em /contato veio preencher, e uma tela de capa antes disso é uma
   rolagem entre a pessoa e o que ela veio fazer. O <h1> da rota é o título do
   formulário.

   ══ O FUNDO É INK CHAPADO, E É PROVISÓRIO ══

   No projeto de origem esta seção tem um <FundoContato /> — pilha de
   radial-gradient com desfoque que respira atrás do ponteiro, sobre textura de
   madeira. A madeira é da outra marca e não foi copiada; a imagem que entra no
   lugar ainda não foi decidida.

   NÃO CRIEI um components/fundo-contato.tsx só para embrulhar `bg-ink`: com
   fundo chapado o componente seria uma <div> vazia, e um componente que não
   decide nada é peso morto. Quando a imagem for escolhida, ele nasce aqui — e
   aí o listener de ponteiro do original vale a cópia.

   ⚠ O DOURADO SÓ EXISTE NESTA ROTA PORQUE O FUNDO É ESCURO. A regra do
   AGENTS.md é literal: #B79653 só sobre fundo escuro; sobre o creme, só o
   #8A6D2F. Se o fundo desta seção clarear, todo o dourado daqui — pastilha
   marcada, botão — sai junto, e a cor de erro também: --color-erro reprova
   sobre o creme (3,58:1).

   ══ DUAS COLUNAS ACIMA DE 900px, NA ORDEM DO DOM ══

   Esquerda: manchete, lede e os canais reais. Direita: o formulário. Abaixo de
   900px vira uma coluna, e a ordem lida é a mesma do documento — nada de
   `order` no CSS, que move o pixel e não move o foco. */

/* Os canais que existem hoje. O telefone vem de `telefone` em lib/dados.ts,
   a fonte única do número — não escreva o número à mão aqui. */
const CANAIS = [
  {
    rotulo: "E-mail",
    valor: "contato@imperioconstrutora.com.br",
    href: "mailto:contato@imperioconstrutora.com.br",
  },
  {
    rotulo: "Instagram",
    valor: "@_construtoraimperio",
    href: "https://www.instagram.com/_construtoraimperio",
  },
  { rotulo: "Local", valor: "Guarulhos, SP" },
  /* WhatsApp, e não o protocolo tel — ver o comentário de `whatsappUrl` em lib/dados.ts. */
  { rotulo: "Telefone", valor: telefone.exibicao, href: whatsappUrl },
];

export default function PaginaContato() {
  return (
    /* transicao-rota: o mesmo fade de 240ms da home, para a ida e a volta pelo
       menu terem o mesmo gesto. */
    <div className="transicao-rota">
      {/* O MESMO botão e o MESMO overlay da home. Antes desta rota ganhar
          menu, quem entrava aqui só saía pelo botão do navegador: não havia
          nenhum caminho de volta além da logo. */}
      <NavegacaoFixa />

      <main className="bg-ink px-gutter py-16 max-[479px]:px-gutter-sm">
        {/* Chrome mínimo: só a marca, de volta para a home. A logo daqui
            continua sendo <Link href="/"> — é troca de rota, e não a volta ao
            topo da própria página que a logo da hero faz. */}
        <Link href="/" className="inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-lt" aria-label="Império Construtora, ir para o início">
          <Image src={logoImperio} alt="Império Construtora" height={56} priority />
        </Link>

        <div className="mt-16 grid grid-cols-1 gap-16 min-[900px]:grid-cols-2 min-[900px]:gap-24">
          <div>
            <h1 className="max-w-[18ch] font-display text-heading-sm text-bone md:text-heading">
              Conte para nós sobre a sua próxima obra.
            </h1>
            <p className="mt-8 max-w-[52ch] text-body-lg text-ash">
              Seis campos. Respondemos em até um dia útil com os próximos passos
              ou já com uma data para visitar o local.
            </p>

            <dl className="mt-12 flex flex-col gap-6">
              {CANAIS.map((canal) => (
                <div key={canal.rotulo}>
                  <dt className="text-caption uppercase text-gold">{canal.rotulo}</dt>
                  <dd className="mt-1 text-body-lg text-bone">
                    {canal.href ? (
                      <a
                        href={canal.href}
                        target={canal.href.startsWith("http") ? "_blank" : undefined}
                        rel={canal.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="underline decoration-ash underline-offset-4 transition-colors hover:decoration-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-lt"
                      >
                        {canal.valor}
                      </a>
                    ) : (
                      canal.valor
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <FormularioContato />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
