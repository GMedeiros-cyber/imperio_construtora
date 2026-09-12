import Image from "next/image";
import Link from "next/link";

import logoRodape from "@/public/hero/logo-imperio-nav.png";
import {
  creditos,
  menuHero,
  sociaisHero,
  telefone,
  whatsappUrl,
} from "@/lib/dados";
import { AssinaturaParticulas } from "@/components/ui/assinatura-particulas";
import { controlador } from "@/app/privacidade/dados-politica";

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

/* ⚠ ALVO DE TOQUE DE 44px. O texto tem 18 a 20px de altura; sem piso, cada link
   era um alvo de 18px no celular. `min-h-11 min-w-11` dá a caixa de 44×44 e o
   items-center mantém o texto no meio dela. Por isso as listas daqui NÃO têm
   gap: o respiro entre um item e outro já é a sobra da caixa de 44px, e somar
   o gap-element de 8px esticaria a coluna à toa. */
const ALVO = "inline-flex min-h-11 min-w-11 items-center";
const LINK =
  `${ALVO} text-body-sm text-bone transition-colors hover:text-gold-lt ` +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dk";

export function SiteFooter() {
  /* Ano do copyright, avaliado na renderização — e como as rotas são estáticas,
     na prática é o ano do build. É o comportamento certo: um número escrito à
     mão envelhece em silêncio no dia 1º de janeiro, e este se corrige sozinho a
     cada publicação. */
  const ano = new Date().getFullYear();

  return (
    /* ⚠ O PÉ É MAIS FUNDO QUE O TOPO A PARTIR DE 640px, e é por causa do
       WhatsApp flutuante. Ele é fixo no canto inferior direito, e o crédito
       da barra de base mora no MESMO canto: com 64px de pé, no fim da rolagem
       o botão cobria o crédito. Com 112px (section-lg) a linha do crédito
       fica acima do topo do botão, com folga. Abaixo de 640px a barra empilha
       à esquerda e o crédito sai do caminho sozinho, então o pé volta a 64. */
    <footer className="bg-ink px-gutter pb-section pt-section text-bone max-[479px]:px-gutter-sm min-[640px]:pb-section-lg">
      {/* ⚠ A PRIMEIRA TRILHA É EM px, E NÃO EM rem, DE PROPÓSITO. Ela era
          `minmax(0,26rem)`: sob zoom de texto a 200% os 416px viravam 832 e
          comiam a coluna da navegação, que então não cabia. Medido antes, nas
          três rotas que têm rodapé: 78px de rolagem horizontal a 992px e 3px a
          1440px.

          416px é o MESMO valor em repouso — nada muda em zoom normal. E é
          medida de LAYOUT, não de tipo: a escala de espaçamento deste site já
          é toda em px (--spacing-gutter: 32px), então a trilha em px é a
          consistente. */}
      <div className="grid gap-12 min-[900px]:grid-cols-[minmax(0,416px)_1fr] min-[900px]:gap-24">
        {/* ── Identificação ────────────────────────────────────────────── */}
        {/* Aqui havia um `max-[680px]:pe-14`, pela mesma razão que saiu da coluna
            da política: o botão flutuante cobria este parágrafo no celular. Ele
            some ao rolar agora, e o recuo saiu junto — ele custava 56px de
            largura de leitura num bloco que já é estreito. */}
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
              className="mt-2 flex flex-col not-italic"
            >
              {/* WhatsApp, e não o protocolo tel — ver `whatsappUrl` em lib/dados.ts. */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                {telefone.exibicao}
              </a>
              <a href={`mailto:${EMAIL}`} className={LINK}>
                {EMAIL}
              </a>
              {/* Não é link, mas mora na mesma pauta de 44px dos dois acima. */}
              <span className={`${ALVO} text-body-sm text-ash`}>Guarulhos, SP</span>
            </address>
          </div>
        </div>

        {/* ── Navegação: um landmark para as três colunas ─────────────────

            ⚠ ABAIXO DE 640px AS COLUNAS EMPILHAM, E ABAIXO DE 768px O <nav>
            TEM TETO DE LARGURA. Os dois existem pelo mesmo motivo: o botão
            MENU é fixo no canto superior direito e, NO FIM DA ROLAGEM — que é
            posição de repouso, não de trânsito —, a coluna Social parava
            debaixo dele. MEDIDO: "SOCIAL" ficava 22px coberto e "Instagram"
            35px a 360px, e 7 e 20px a 390px.

            A reserva do botão é a largura dele mais o p-8 do invólucro fixo:
            105,3 + 32 = 137,3px no celular. O teto de 9rem (144px) deixa
            margem sobre esse número. Com uma coluna só, nenhum item precisa
            quebrar para caber: "Como trabalhamos", o mais largo, mede 116px.

            ⚠ AS TRÊS COLUNAS SÓ VOLTAM A 640px, E NÃO A 600. Dentro do teto,
            a 600px cada coluna ficaria com 109px e "Como trabalhamos" (116px)
            quebrava em duas linhas. A 640 sobram 122px por coluna e nada
            quebra — MEDIDO em 600, 620, 639, 640, 767 e 768.

            Não é padding-right global nem mexe no z-index do botão: o teto é
            só deste <nav>, e as outras seções não se movem. */}
        <nav
          aria-label="Rodapé"
          /* ⚠ ESTE `pe-14` FICA, e os outros dois saíram. A diferença é ONDE
             o rodapé está: no FIM da rolagem, e é justamente lá que os dois
             botões flutuantes voltam a aparecer sempre (ver
             lib/use-esconder-ao-rolar.ts — quem chegou ao rodapé pode querer
             agir). A última coluna da navegação encosta na borda direita, que
             é onde eles moram; medido antes, o CNPJ ficava coberto pelos dois
             a 768px.

             ⚠ SÃO DOIS VALORES, E O SEGUNDO É PELO BOTÃO MENU. 56px limpam o
             botão do WhatsApp, que mede 56. O MENU é mais largo e mora no
             canto de CIMA — e no fim da rolagem, com o rodapé inteiro na tela,
             a coluna "Legal" cai dentro da faixa dele. Medido a 768px: o MENU
             ocupa 583→736 e o CNPJ 485→680, 97px de sobreposição; para limpar
             são precisos 185px da borda, ou seja 153 de recuo. Os 160px do
             `pe-40` cobrem a faixa inteira de 640 a 899px, onde a navegação
             ocupa a largura toda.

             De 900px para cima ela vai para a segunda trilha da grade e já
             nasce longe do canto: ali os 56px bastam.

             E não cobra largura de leitura: são três rótulos curtos numa
             navegação com folga de sobra, não um parágrafo. */
          className="grid gap-8 pe-14 min-[640px]:max-[900px]:pe-[160px] max-[640px]:grid-cols-1 max-[768px]:max-w-[calc(100%-9rem)] min-[640px]:grid-cols-[repeat(auto-fit,minmax(4rem,1fr))]"
        >
          <div>
            <h3 className={ROTULO} id="rodape-menu">
              Menu
            </h3>
            <ul aria-labelledby="rodape-menu" className="mt-2 flex flex-col">
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
            <ul aria-labelledby="rodape-social" className="mt-2 flex flex-col">
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

              {/* ⚠ O FACEBOOK SAIU, E VOLTA QUANDO A URL CHEGAR. A página da
                  Império não existe no projeto, e inventar uma mandaria o
                  visitante para o perfil de outra pessoa. Enquanto isso:

                  - `href="#"` não serve: medido, o Enter no link rolava a
                    página inteira de volta ao topo (scrollY 10785 -> 0 a
                    390px) com o foco preso num link fora da tela;
                  - rótulo sem link também não: numa lista de links, um item
                    que não clica é affordance quebrada — a pessoa tenta e
                    nada acontece.

                  Quando o endereço chegar, o item volta aqui como <li> com
                  <a href={FACEBOOK} target="_blank" rel="noopener"
                  className={LINK}>, igual ao Instagram acima. */}
            </ul>
          </div>

          <div>
            <h3 className={ROTULO} id="rodape-legal">
              Legal
            </h3>
            <ul aria-labelledby="rodape-legal" className="mt-2 flex flex-col">
              {/* O CNPJ vem de app/privacidade/dados-politica.ts, a fonte única
                  do dado cadastral — não escreva o número à mão aqui. Ele é
                  texto, não link: identifica a empresa, não leva a lugar
                  nenhum. */}
              <li className={`${ALVO} text-body-sm text-ash`}>
                CNPJ {controlador.cnpj}
              </li>
              {/* ⚠ ATÉ ESTA RODADA A POLÍTICA SÓ ERA ALCANÇÁVEL PELO
                  FORMULÁRIO de /contato. Quem não preenchesse o formulário não
                  tinha como chegar nela — e política de privacidade que só
                  aparece na hora de consentir não é acessível. O lugar dela é
                  aqui, na coluna Legal, em toda rota. */}
              <li>
                <Link href="/privacidade" className={LINK}>
                  Política de Privacidade
                </Link>
              </li>
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
      {/* ⚠ ESTE `pe-14` TAMBÉM FICA. Esta é a última linha da página e encosta
          no canto inferior direito — e o botão flutuante volta a aparecer
          sempre no fim da rolagem, por decisão de desenho (ver
          lib/use-esconder-ao-rolar.ts). Medido antes: ele cobria "Desenvolvido
          por Tribus Labs" a 768, 1440 e 1920px, e o crédito é LINK, não só
          texto. 56px é a largura do botão.

          Sem `max-[...]`: o crédito é empurrado para a direita pelo
          `justify-between` em qualquer largura. O custo é zero — a linha tem
          espaço de sobra. */}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-x-12 gap-y-4 border-t border-bone/15 pt-8 pe-14 max-[640px]:grid max-[640px]:justify-items-start">
        <p className="text-caption text-ash">
          © {ano} Império Construtora
        </p>
        <a
          href={creditos.url}
          target="_blank"
          rel="noopener"
          className={`${ALVO} text-caption text-ash transition-colors hover:text-gold-lt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dk`}
        >
          Desenvolvido por {creditos.autor}
        </a>
      </div>
    </footer>
  );
}
