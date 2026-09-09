import Image, { getImageProps } from "next/image";

import { hero } from "@/lib/dados";
import { MenuHero } from "@/components/menu-hero";
import { SociaisHero } from "@/components/sociais-hero";
import { BotaoContatoHero } from "@/components/botao-contato-hero";
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

      {/* Navegação, dentro da imagem */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-8 p-8">
        <Image
          src={hero.logo}
          alt={hero.logoAlt}
          priority
          className="h-14 w-auto"
        />

        <div className="flex flex-col items-end gap-5">
          <MenuHero />
          <SociaisHero />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-12 p-8 lg:flex-row lg:items-end lg:justify-between">
        {/* Uma instância de DiaText por linha. A varredura acontece uma vez,
            na entrada: triggerOnView com once e sem repeat — nada de loop na
            hero. As cores são o dourado da marca; o texto em repouso é bone.

            Ritmo: 3,4s por linha em vez do padrão de 1,5s, e 0,35s de defasagem
            entre linhas em vez de 0,12s. A varredura estava rápida demais para
            ser lida como gesto. */}
        <h1 className="text-heading-sm leading-none text-bone md:text-heading xl:text-display">
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

        <div className="lg:max-w-md lg:shrink-0">
          <p className="text-body text-bone">{hero.paragrafo}</p>

          {/* isolate cria contexto de empilhamento: o botão tem camadas em
              z-30 e z-40 por dentro, e sem isso elas disputavam na raiz e
              apareciam POR CIMA do overlay do menu, que está em z-9. */}
          <div className="isolate mt-8">
            <BotaoContatoHero />
          </div>
        </div>
      </div>
    </section>
  );
}
