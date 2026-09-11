"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { whatsappUrl } from "@/lib/dados";

/* WhatsApp flutuante, fixo no canto inferior direito de todas as rotas.

   Copiado do components/Zap.tsx da LDF. O que veio de lá: o <a> para o wa.me,
   o observador da capa, o reset de estado na renderização, a divisão entre CSS
   e JS para mostrar o botão, e a saída instantânea. O que mudou está abaixo.

   ══ ELE SÓ APARECE DEPOIS QUE A HERO SAI DA TELA ══

   Sobre a capa ele NÃO existe. A hero tem a fila de ícones sociais e o CTA no
   rodapé dela, rente à borda direita — o mesmo canto do botão. Na LDF os dois
   brigaram por espaço, e está registrado lá (globals.css, seção 8c) que subir a
   fila NÃO resolve: a 390px ela entra na manchete. A solução de lá, e a daqui,
   é o botão sair de cena enquanto a capa está na viewport. Quando ela sai
   inteira, a fila saiu junto — ela mora no pé da hero.

   IntersectionObserver, e não listener de `scroll`: `scroll` dispara a cada
   quadro no thread principal para responder uma pergunta que o observer
   responde sozinho.

   ⚠ `[rota]`, E NUNCA `[]`, NOS EFEITOS. O componente mora em app/layout.tsx,
   e o layout é o MESMO nó React a sessão inteira: só `children` troca. Com
   `[]` o efeito rodaria uma vez, na primeira rota — e entrando por /contato
   (sem hero) e navegando para a home, o botão pousaria sobre a capa. Foi
   exatamente o bug da LDF.

   ══ ROTA SEM HERO: QUEM MOSTRA É O CSS ══

   /contato e /privacidade não têm `#inicio`. Ali o botão vale desde o primeiro
   quadro, pela variante `body:not(:has(#inicio))` — reavaliada no próprio
   commit da rota, e funcionando sem JavaScript. O efeito NÃO marca
   `data-visivel` nessas rotas: o atributo sobreviveria à navegação e a home
   herdaria um botão visível sobre a capa.

   Sem JS, portanto: nas rotas sem hero ele aparece; na home, não — e ali
   quem não tem script tem o CTA da hero e o rodapé.

   ══ ELE SAI DA FRENTE DO MENU ABERTO — E ISTO NÃO EXISTIA NA LDF ══

   Havia uma `.transicao-rota` com fill `both` envolvendo cada página, e o
   fill prendia um contexto de empilhamento na rota inteira: o overlay do menu
   mora DENTRO dele e este botão mora fora, no layout, então qualquer z-index
   daqui ficava ACIMA do overlay aberto, por maior que fosse o z-50 de lá — e o
   canto inferior direito do overlay é justamente o CTA "Falar com a Império".

   ESSA CLASSE SAIU. O fade agora é só o do app/template.tsx, que usa
   `backwards` e solta o elemento ao terminar, então o z-[45] daqui volta a
   perder do z-50 do overlay, como sempre devia.

   O botão continua lendo o estado do overlay e se escondendo enquanto ele
   está na tela — agora por intenção, não por contorno: botão flutuante por
   cima de menu aberto é errado mesmo quando o z-index funciona, e durante os
   250ms de animação do template o contexto de empilhamento ainda existe. A leitura é pelo contrato ARIA do menu — o botão com `aria-controls`
   aponta o overlay — e não por classe. E é pelo `display` calculado, não pelo
   `aria-expanded`: o `aria-expanded` vira `false` no começo do fechamento, e
   o overlay ainda leva mais de um segundo recolhendo os painéis. Pelo
   `display`, o botão só volta quando o overlay terminou de sair.

   ══ AS ADAPTAÇÕES DE PELE ══

   - Fundo gold, ícone ink. Nada do verde do WhatsApp: a paleta do site é
     preto, dourado e a cor da letra.
   - SEM box-shadow. Na LDF o anel escuro de 2px era box-shadow; o AGENTS.md
     proíbe sombra em qualquer elemento, e aqui ele é BORDA de 1px em ink. Não
     é enfeite: o gold sobre o creme dá 2,7:1 e reprova o 3:1 de objeto
     gráfico — e o botão atravessa trechos creme (a política inteira é bone).
     Sobre o creme quem desenha a forma é a borda ink; sobre o escuro, o
     próprio gold. Com a borda, o gold também nunca encosta direto no creme,
     que é o que a regra do dourado pede.
   - Raio 1440px (`rounded-pill`), o permitido para botão.
   - 56px de alvo, como lá: acima dos 48 mínimos, porque é um botão que o
     polegar procura sem olhar. A borda entra na caixa, então o alvo é 56. */

/* O canto e a pele. z-[45]: acima do z-40 mais alto da página e abaixo do
   z-50 da navegação fixa. Com a `.transicao-rota` fora, esse "abaixo" voltou
   a ser verdade — ver o contexto de empilhamento no topo do arquivo. */
const BOTAO =
  "fixed bottom-gutter right-gutter z-[45] grid size-14 place-items-center " +
  "rounded-pill border border-ink bg-gold text-ink hover:bg-gold-lt " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dk " +
  "max-[479px]:bottom-gutter-sm max-[479px]:right-gutter-sm";

/* ══ O ESTADO DE PARTIDA É ESCONDIDO ══

   `invisible` (visibility: hidden) e não `hidden` (display: none): precisa
   transicionar, e visibility tira o botão da ordem de Tab e da árvore de
   acessibilidade de uma vez, sem depender de aria-hidden sincronizado.

   ⚠ A SAÍDA É INSTANTÂNEA E SÓ A ENTRADA ANIMA. Numa transição de CSS vale a
   do estado de DESTINO: `transition-none` aqui torna o esconder imediato. Na
   LDF a saída animada fazia o botão atravessar a capa sumindo ao navegar de
   uma rota sem hero para a home.

   O deslocamento de 8px só existe com movimento permitido: com
   prefers-reduced-motion o botão aparece direto no estado final. */
const ESCONDIDO =
  "invisible opacity-0 transition-none duration-[260ms] ease-out motion-safe:translate-y-2";

/* Rota com hero: o observador liga `data-visivel`. */
const VISIVEL_POR_JS =
  "data-visivel:visible data-visivel:opacity-100 data-visivel:translate-y-0 " +
  "motion-safe:data-visivel:transition-[opacity,translate,background-color]";

/* Rota sem hero: CSS puro. O `:not([data-sob-menu])` é o que deixa o menu
   aberto vencer esta regra — sem ele, a especificidade do `#inicio` dentro do
   :has() ganharia de qualquer atributo. */
const VISIVEL_SEM_HERO =
  "[body:not(:has(#inicio))_&:not([data-sob-menu])]:visible " +
  "[body:not(:has(#inicio))_&:not([data-sob-menu])]:opacity-100 " +
  "[body:not(:has(#inicio))_&:not([data-sob-menu])]:translate-y-0 " +
  "motion-safe:[body:not(:has(#inicio))_&:not([data-sob-menu])]:transition-[opacity,translate,background-color]";

export function WhatsappFlutuante() {
  const rota = usePathname();
  const [heroFora, setHeroFora] = useState(false);
  const [sobMenu, setSobMenu] = useState(false);

  /* ⚠ O RESET ACONTECE NA RENDERIZAÇÃO, E NÃO NO EFEITO. Efeito roda depois da
     pintura: zerar lá deixaria pelo menos um quadro pintado com o botão da
     rota anterior por cima da capa nova. Ajustar estado na renderização quando
     uma entrada muda é o padrão do React para isso — ele refaz na hora, sem
     pintar o intermediário. */
  const [rotaAnterior, setRotaAnterior] = useState(rota);
  if (rota !== rotaAnterior) {
    setRotaAnterior(rota);
    setHeroFora(false);
    setSobMenu(false);
  }

  useEffect(() => {
    const hero = document.getElementById("inicio");
    /* Sem hero, o efeito não faz nada: quem mostra é o CSS. Ver o topo. */
    if (!hero) return;

    /* threshold 0: vira quando a hero deixa de tocar a viewport, nem um pixel
       antes. */
    const observador = new IntersectionObserver(
      ([entrada]) => setHeroFora(!entrada.isIntersecting),
      { threshold: 0 },
    );
    observador.observe(hero);
    return () => observador.disconnect();
  }, [rota]);

  useEffect(() => {
    const botaoMenu = document.querySelector("button[aria-controls][aria-expanded]");
    const idOverlay = botaoMenu?.getAttribute("aria-controls");
    const overlay = idOverlay ? document.getElementById(idOverlay) : null;
    /* /privacidade não tem menu. */
    if (!overlay) return;

    /* O gsap do menu escreve display e visibility no style inline do overlay
       ao abrir e ao terminar de fechar; é essa escrita que o observador ouve. */
    const ler = () => setSobMenu(getComputedStyle(overlay).display !== "none");
    ler();
    const observador = new MutationObserver(ler);
    observador.observe(overlay, { attributes: true, attributeFilter: ["style", "class"] });
    return () => observador.disconnect();
  }, [rota]);

  return (
    <a
      className={`${BOTAO} ${ESCONDIDO} ${VISIVEL_POR_JS} ${VISIVEL_SEM_HERO}`}
      /* Atributos sem valor: o CSS casa com a presença, e o React omite o
         atributo inteiro quando é `undefined`. */
      data-visivel={heroFora && !sobMenu ? "" : undefined}
      data-sob-menu={sobMenu ? "" : undefined}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Império no WhatsApp"
    >
      <IconeWhatsApp />
    </a>
  );
}

/* O glifo do WhatsApp, o mesmo path do components/Icones.tsx da LDF. Preenchido
   em currentColor, então é o `text-ink` do botão que o pinta. Mora aqui porque
   só este botão o usa — o lucide-react desta versão não traz ícone de marca. */
function IconeWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="block size-[30px]">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.16 0-.43.06-.65.31-.22.24-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
