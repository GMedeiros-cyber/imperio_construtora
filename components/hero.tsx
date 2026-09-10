import { getImageProps } from "next/image";

import { hero } from "@/lib/dados";
import { BotaoContatoHero } from "@/components/botao-contato-hero";
import { LogoTopo } from "@/components/logo-topo";
import { SociaisHero } from "@/components/sociais-hero";
import { DiaText } from "@/components/ui/dia-text";

/**
 * BLOCO 1 — Hero
 * Seção full-bleed de 100vh: a foto cobre tudo, a navegação fica no topo
 * dentro dela e manchete e parágrafo se apoiam na base.
 *
 * REQUISITO DA FOTO DE FUNDO — não trocar sem conferir:
 * a imagem precisa ter o TERÇO INFERIOR ESCURO EM TODA A LARGURA, porque a
 * manchete e o parágrafo ficam em cima dele, em bone. Foto com base clara
 * reprova em contraste e não serve, por mais bonita que seja. Ao receber a
 * foto real, medir o contraste do texto bone sobre ela em 360, 390, 768,
 * 1440 e 1920px ANTES de aprovar — o mínimo é 4,5:1 para o parágrafo de
 * 16px e 3:1 para a manchete, que é texto grande.
 */
export function Hero() {
  const comum = { alt: hero.fundoAlt, sizes: "100vw", priority: true, quality: 80 };
  const {
    props: { srcSet: larga },
  } = getImageProps({ ...comum, src: hero.fundoLargo, width: 1920, height: 1080 });
  const {
    props: { srcSet: alta, ...restoDaFoto },
  } = getImageProps({ ...comum, src: hero.fundoAlto, width: 1200, height: 1500 });
  void alta;

  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden">
      {/* Direção de arte por <picture>, o padrão que o guia da versão indica:
          getImageProps mantém a otimização e o srcset por largura, e o
          <source media> escolhe o enquadramento. A larga (16:9) entra de
          768px para cima; a alta (4:5) é o padrão do mobile.

          O tratamento está GRAVADO NOS ARQUIVOS, não em CSS: escurecimento na
          base, sem véu no topo porque o céu de crepúsculo já dá contraste.
          NÃO acrescentar gradiente, overlay ou filter por CSS. Se a foto for
          trocada, refaça o tratamento no arquivo e remeça o contraste. */}
      <picture>
        <source media="(min-width: 768px)" srcSet={larga} />
        <img
          {...restoDaFoto}
          alt={hero.fundoAlt}
          className="absolute inset-0 size-full object-cover"
        />
      </picture>

      {/* Só a logo mora aqui. O botão de menu é FIXO e vive em
          components/navegacao-fixa.tsx, pendurado direto na rota — esta
          <section> é overflow-hidden e cortaria um fixed se um ancestral
          ganhasse transform. Os ícones sociais NÃO são fixos e ficam no
          rodapé desta seção, na fila do CTA. */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-8 p-8">
        <LogoTopo />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-12 p-8 lg:flex-row lg:items-end lg:justify-between">
        {/* Uma instância de DiaText por linha. A varredura acontece uma vez,
            na entrada: triggerOnView com once e sem repeat — nada de loop na
            hero. As cores são o dourado da marca; o texto em repouso é bone.

            Ritmo: 3,4s por linha em vez do padrão de 1,5s, e 0,35s de defasagem
            entre linhas em vez de 0,12s. A varredura estava rápida demais para
            ser lida como gesto. */}
        {/* Os três degraus da manchete são 18% maiores que a escala geral do
            site: text-hero-sm / md / lg, e não heading-sm / heading / display.
            Ver os tokens em app/globals.css e o registro em lib/utils.ts. */}
        <h1 className="text-hero-sm leading-none text-bone md:text-hero-md xl:text-hero-lg">
          {hero.manchete.map((linha, indice) => (
            <span key={linha} className="block">
              <DiaText
                text={linha}
                colors={["#B79653", "#D4B872", "#8A6D2F", "#B79653"]}
                textColor="#FAF8F2"
                triggerOnView
                once
                repeat={false}
                duration={3.4}
                delay={indice * 0.35}
              />
            </span>
          ))}
        </h1>

        <div className="lg:shrink-0">
          <p className="text-body text-bone lg:max-w-md">{hero.paragrafo}</p>

          {/* ══ A FILA DO CTA ══
              Ícones sociais primeiro, CTA fechando à direita, na mesma linha —
              o arranjo da hero da LDF. Os ícones voltaram para cá da coluna
              fixa: eles não acompanham a rolagem.

              ⚠ O max-w-md FICOU NO PARÁGRAFO, E NÃO NA COLUNA. Três ícones de
              48 com 2rem entre si somam 208px, mais 2rem até o CTA de 232px:
              472px. A coluna tinha teto de 448 e a fila estourava por ela. Com
              o teto só no parágrafo, a coluna cresce até a fila e o CTA fecha
              rente à borda direita.

              ⚠ SUBIR A FILA NÃO RESOLVE COLISÃO COM A MANCHETE — joga o ícone
              para dentro do título. Aconteceu na LDF. Se a manchete e a fila
              encostarem, o conserto é na largura, não na altura. */}
          <div className="mt-8 flex items-center gap-8">
            <SociaisHero />

            {/* isolate cria contexto de empilhamento: o botão tem camadas em
                z-30 e z-40 por dentro, e sem isso elas disputavam na raiz e
                apareciam POR CIMA do overlay do menu, que está em z-9. */}
            <div className="isolate">
              <BotaoContatoHero />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
