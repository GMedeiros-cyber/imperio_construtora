import Link from "next/link";

import { menuHero, sociaisHero } from "@/lib/dados";
import { paraRotaDeContato } from "@/lib/rotas";

/* BLOCO 11 — Full-Bleed Footer
   Estrutura copiada do rodapé do projeto LDF: bloco de identificação à
   esquerda, três colunas de links à direita, barra de base embaixo. A paleta e
   a tipografia são as nossas — creme, ink, graphite, ash e o dourado escuro.

   ══ O QUE VEIO DE LÁ, E É O MOTIVO DA CÓPIA ══

   Um único landmark <nav> para as três colunas, e cada <ul> amarrada ao seu
   <h3> por aria-labelledby. O leitor de tela anuncia "Menu, lista de 5 itens"
   em vez de três listas anônimas seguidas. O <address> tem o mesmo tratamento.

   `<address>` é semântico e vale registrar por quê: ele marca informação de
   contato DO documento, e não um endereço postal qualquer — é o elemento certo
   para o e-mail e a praça da empresa, e errado para o endereço de uma obra.

   ══ A MARCA AQUI É TEXTO, E NÃO O PNG DO LOGOTIPO ══

   ⚠ NÃO troque por <Image src={hero.logo}>. O arquivo é dourado sobre
   transparente, desenhado para fundo escuro: medido contra o bone ele dá de
   1,71 a 2,66:1, abaixo dos 3:1 que gráfico não textual exige, e cai direto na
   regra do AGENTS.md de que #B79653 só existe sobre fundo escuro. Contra o ink
   o mesmo arquivo dá de 7,0 a 10,9:1 — é por isso que ele serve na hero e em
   /contato, e não aqui.

   ══ A FRASE SOBRE A EMPRESA É CONDENSAÇÃO, NÃO AFIRMAÇÃO NOVA ══

   Sai do parágrafo da hero e da praça que já aparece nos sociais. Fica inline
   porque é COPY deste bloco — não é dado que outro componente vá querer ler. */
const SOBRE =
  "Construção, reforma e gestão de obras em Guarulhos e São Paulo. Equipe própria, prazo fechado em contrato e orçamento blindado do início ao fim.";

const EMAIL = "contato@imperioconstrutora.com.br";

/* O Instagram sai de `sociaisHero`, a MESMA fonte que a hero e o menu usam.
   Escrever a URL de novo aqui seria a segunda cópia que diverge da primeira. */
const INSTAGRAM =
  sociaisHero.find((s) => s.tipo === "instagram")?.href ??
  "https://www.instagram.com/_construtoraimperio";

/* MENU: "Início" mais a MESMA lista do menu do topo, lida de `menuHero.itens`.
   Não é uma segunda lista — é a de cima com uma entrada na frente, e é assim
   que as duas não podem divergir. */
const MENU = [{ texto: "Início", href: "/" }, ...menuHero.itens];

/* ⚠ O RODAPÉ APARECE EM TODA ROTA, e por isso o href precisa ser absoluto.
   `menuHero.itens` guarda âncoras da home ("#obras"), que numa página que não é
   a home apontariam para uma seção inexistente na própria página. A barra na
   frente resolve as duas coisas: "/#obras" volta para a home e rola até lá.

   `paraRotaDeContato` roda antes porque "#contato" não é âncora nenhuma desde
   que o contato virou rota — ver lib/rotas.ts. */
function hrefDoRodape(href: string): string {
  const destino = paraRotaDeContato(href);
  return destino.startsWith("#") ? `/${destino}` : destino;
}

/* Rótulo de coluna: o degrau mais baixo da escala, caixa alta, graphite.
   O foco é `outline` e nunca `ring` — o `ring` do Tailwind é box-shadow, e o
   AGENTS.md proíbe box-shadow em qualquer elemento. */
const ROTULO = "text-caption uppercase tracking-[0.1em] text-graphite";
const LINK =
  "text-body-sm text-ink transition-colors hover:text-gold-dk " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dk";

export function SiteFooter() {
  /* Ano do copyright, avaliado na renderização — e como as rotas são estáticas,
     na prática é o ano do build. É o comportamento certo: um número escrito à
     mão envelhece em silêncio no dia 1º de janeiro, e este se corrige sozinho a
     cada publicação. */
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-ash px-gutter py-section max-[479px]:px-gutter-sm">
      <div className="grid gap-12 min-[900px]:grid-cols-[minmax(0,26rem)_1fr] min-[900px]:gap-24">
        {/* ── Identificação ────────────────────────────────────────────── */}
        <div>
          <p className="font-display text-subheading font-light tracking-[0.12em] text-ink">
            IMPÉRIO
          </p>
          <p className="mt-1 text-caption uppercase tracking-[0.24em] text-graphite">
            Construtora
          </p>

          <p className="mt-6 max-w-[46ch] text-body-sm text-graphite">{SOBRE}</p>

          <div className="mt-8">
            <h3 className={ROTULO} id="rodape-onde">
              Onde estamos
            </h3>
            {/* `not-italic`: o navegador põe itálico em <address> por padrão, e
                o sistema não tem itálico. */}
            <address
              aria-labelledby="rodape-onde"
              className="mt-4 flex flex-col gap-element not-italic"
            >
              <a href={`mailto:${EMAIL}`} className={LINK}>
                {EMAIL}
              </a>
              <span className="text-body-sm text-graphite">Guarulhos, SP</span>
            </address>
          </div>
        </div>

        {/* ── Navegação: um landmark para as três colunas ───────────────── */}
        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-8 min-[600px]:grid-cols-3">
          <div>
            <h3 className={ROTULO} id="rodape-menu">
              Menu
            </h3>
            <ul aria-labelledby="rodape-menu" className="mt-4 flex flex-col gap-element">
              {MENU.map((item) => (
                <li key={item.href}>
                  <Link href={hrefDoRodape(item.href)} className={LINK}>
                    {item.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={ROTULO} id="rodape-social">
              Social
            </h3>
            <ul aria-labelledby="rodape-social" className="mt-4 flex flex-col gap-element">
              <li>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener"
                  className={LINK}
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={ROTULO} id="rodape-legal">
              Legal
            </h3>
            <ul aria-labelledby="rodape-legal" className="mt-4 flex flex-col gap-element">
              {/* ⚠ NÃO HÁ CNPJ NO PROJETO, e inventar um é falsificar registro
                  público. Fica o literal, na mesma convenção que o AGENTS.md já
                  fixou para o telefone. Quando o número chegar, ele entra aqui;
                  se a decisão for não publicar, a coluna inteira sai. */}
              <li className="text-body-sm text-graphite">CNPJ (em definição)</li>
            </ul>
          </div>
        </nav>
      </div>

      {/* ── Barra de base ──────────────────────────────────────────────── */}
      <div className="mt-16 border-t border-ash pt-8">
        {/* ⚠ SEM LINHA DE CRÉDITO. O rodapé da LDF assina "Design e site por
            <autor>", e aqui não existe esse dado em lugar nenhum do projeto —
            escrever um nome seria inventá-lo. Quando houver, entra ao lado do
            copyright, com target="_blank" e rel="noopener" como os demais
            externos. */}
        <p className="text-caption text-graphite">
          © {ano} Império Construtora
        </p>
      </div>
    </footer>
  );
}
