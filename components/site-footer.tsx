import Image from "next/image";
import Link from "next/link";

import logoRodape from "@/public/hero/logo-imperio-nav.png";
import {
  creditos,
  menuHero,
  sociaisHero,
  telefone,
  telefoneHref,
} from "@/lib/dados";
import { AssinaturaParticulas } from "@/components/ui/assinatura-particulas";

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
   para o telefone, o e-mail e a praça da empresa, e errado para o endereço de
   uma obra.

   ══ O RODAPÉ FICOU ESCURO, E O ARQUIVO DO LOGO MUDOU COM ELE ══

   ⚠ AGORA É logo-imperio-nav.png, o dourado #B79653. Enquanto o rodapé era
   creme, o arquivo certo era o logo-imperio-rodape.png, em gold-dk #8A6D2F —
   medido, 4,68:1 sobre o bone contra 2,20:1 do dourado da hero. Com o fundo
   navy a conta inverte: o gold-dk mede 3,62:1 ali, que reprova para o mínimo
   de texto, e o dourado da hero passa folgado.

   Os dois arquivos continuam coexistindo de propósito. Se o rodapé voltar a
   ser claro, o arquivo volta junto — e o inverso também vale.

   ══ O FUNDO É INK ══

   A paleta do site e preto, dourado e a cor da letra. Nada mais entra. O
   rodape fecha em ink e a chamada final logo acima fecha em ink tambem, pelo
   gradiente do arco de baixo — a emenda entre os dois e preto contra preto e
   nao existe borda. Mexeu num, mexa no outro.

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

   O contato NÃO passa mais por aqui: ele já vem "/contato" do dado, desde que
   o remendo `paraRotaDeContato` foi apagado — ver lib/rotas.ts. Esta função
   cuida só das âncoras. */
function hrefDoRodape(href: string): string {
  return href.startsWith("#") ? `/${href}` : href;
}

/* Rótulo de coluna: o degrau mais baixo da escala, caixa alta, graphite.
   O foco é `outline` e nunca `ring` — o `ring` do Tailwind é box-shadow, e o
   AGENTS.md proíbe box-shadow em qualquer elemento. */
const ROTULO = "text-caption uppercase tracking-[0.1em] text-gold";
const LINK =
  "text-body-sm text-bone transition-colors hover:text-gold-lt " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dk";

export function SiteFooter() {
  /* Ano do copyright, avaliado na renderização — e como as rotas são estáticas,
     na prática é o ano do build. É o comportamento certo: um número escrito à
     mão envelhece em silêncio no dia 1º de janeiro, e este se corrige sozinho a
     cada publicação. */
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-ink px-gutter py-section text-bone max-[479px]:px-gutter-sm">
      <div className="grid gap-12 min-[900px]:grid-cols-[minmax(0,26rem)_1fr] min-[900px]:gap-24">
        {/* ── Identificação ────────────────────────────────────────────── */}
        <div>
          {/* h-16 = 64px de altura, largura automática: o import estático
              carrega as dimensões reais e o Next mantém a proporção. */}
          <Image
            src={logoRodape}
            alt="Império Construtora"
            className="h-16 w-auto"
          />

          <p className="mt-6 max-w-[46ch] text-body-sm text-ash">{SOBRE}</p>

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
              <a href={telefoneHref} className={LINK}>
                {telefone.exibicao}
              </a>
              <a href={`mailto:${EMAIL}`} className={LINK}>
                {EMAIL}
              </a>
              <span className="text-body-sm text-ash">Guarulhos, SP</span>
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
              {/* O e-mail NÃO mora aqui: ele é canal de contato, não rede
                  social, e já está no <address> de "Onde estamos". Nesta
                  coluna ficam só os perfis. */}
              <li>
                {/* ⚠ PENDENTE: a página de Facebook da Império não existe no
                    projeto. O "#" é literal e provisório — inventar uma URL
                    mandaria o visitante para o perfil de outra pessoa. Quando
                    o endereço chegar, ele entra aqui com target="_blank" e
                    rel="noopener", como o Instagram. */}
                <a href="#" className={LINK}>
                  Facebook
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
                  público. Fica o literal, na mesma convenção que o telefone
                  seguiu até ter número. Quando o CNPJ chegar, ele entra aqui;
                  se a decisão for não publicar, a coluna inteira sai. */}
              <li className="text-body-sm text-ash">CNPJ (em definição)</li>
            </ul>
          </div>
        </nav>
      </div>

      {/* ── Assinatura em partículas ───────────────────────────────────── */}
      <AssinaturaParticulas />

      {/* ── Barra de base ──────────────────────────────────────────────── */}
      {/* Copyright à esquerda, crédito no canto direito — o arranjo da barra
          de base da LDF, com o mesmo corte: abaixo de 640px os dois empilham
          alinhados à esquerda, porque um item solto na direita de uma tela
          estreita lê como resto de layout, não como assinatura.

          O crédito lê como o resto da barra (caption, ash), e não como link
          das colunas: aqui a hierarquia é a do copyright ao lado. */}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-x-12 gap-y-4 border-t border-bone/15 pt-8 max-[640px]:grid max-[640px]:justify-items-start">
        <p className="text-caption text-ash">
          © {ano} Império Construtora
        </p>
        <a
          href={creditos.url}
          target="_blank"
          rel="noopener"
          className="text-caption text-ash transition-colors hover:text-gold-lt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dk"
        >
          Desenvolvido por {creditos.autor}
        </a>
      </div>
    </footer>
  );
}
