import Image from "next/image";

import fotoCta from "@/public/cta/canteiro-noturno.jpg";
import logoMarca from "@/public/hero/logo-imperio-nav.png";
import { BotaoContato } from "@/components/ui/botao-contato";
import { chamadaFinal } from "@/lib/dados";
import { ROTA_CONTATO } from "@/lib/rotas";

/**
 * BLOCO 9b — Chamada final
 *
 * ══ É UMA FAIXA RETA, FULL-BLEED, COLADA NO RODAPÉ ══
 *
 * Não é card e não é seção de altura cheia. Já foi as duas coisas: como seção
 * ocupava a altura de um bloco inteiro, com a marca a 96px e a manchete a 84px,
 * e como card ficava recuado do gutter com o texto à esquerda. A referência
 * pedida é uma barra: sangra de borda a borda, é baixa, e encosta no rodapé sem
 * respiro entre os dois.
 *
 * ⚠ O CONTEÚDO É CENTRALIZADO. É a segunda exceção da página à regra de texto
 * sempre à esquerda — a outra é a manchete do carrossel de marcas. Foi pedido,
 * e a forma da faixa depende disso: logo, manchete e botão empilhados no eixo.
 *
 * ⚠ SEM PADDING VERTICAL NA SEÇÃO, e a altura vem do aspect. É o que mantém a
 * faixa colada no rodapé. Um py aqui reabriria a folga que a referência não tem.
 *
 * ══ A ALTURA, E POR QUE ELA ENCOLHEU 30% ══
 *
 * A faixa media 424px a 1440px (aspect 1920/565 + min-h 24rem) e o pedido foi
 * ~297px. ⚠ NÃO CABIA SÓ ENCOLHENDO A CAIXA: o conteúdo empilhado somava 328px
 * e o texto vazaria. Por isso SAIU A LINHA DE APOIO — o <p> com
 * chamadaFinal.apoio. As referências pedidas têm três coisas: logo, manchete e
 * botão. Sem ela o empilhado mede 281px medidos (logo 48 + 32 + manchete de
 * duas linhas ~113 + 32 + botão 56 — o botão da hero, desde que os dois
 * foram unificados; com a pílula de 48px de antes eram 268).
 *
 * ⚠ chamadaFinal.apoio CONTINUA EM lib/dados.ts, só não é renderizado. Não
 * apague de lá — o texto não é lixo, é decisão de composição desta faixa.
 *
 * As duas medidas trabalham juntas e o cruzamento delas é o ponto:
 *   aspect 1920/396  dá 297px a 1440px, 396px a 1920px
 *   min-h  18,5rem   = 296px, o piso de 768px até ~1434px, onde o aspect passa
 *
 * ⚠ O min-h TEM DE FICAR ABAIXO DOS 297px, senão ele vence o aspect a 1440 e o
 * alvo se perde; e ACIMA dos 281px do conteúdo, senão o texto vaza pelo
 * overflow-hidden entre 768 e 1200, onde o aspect sozinho daria 158 a 247px.
 * A janela inteira é de 281 a 297 — MEDIDO, sobram 7px em cima e 7 embaixo
 * de 768 a 1440px. Mexeu num, remeça o outro; e o botão é o de
 * components/ui/botao-contato.tsx: mudou a altura dele, esta conta muda junto.
 *
 * ⚠ E O w-full EXISTE POR CAUSA DO min-h. Com aspect-ratio e uma altura mínima
 * que o supere, o elemento cresce em LARGURA para manter a proporção: medido,
 * a faixa saía com 1305px dentro de um viewport de 768 e estourava a página na
 * horizontal. Com a largura fixada, o min-h só empurra a altura.
 *
 * ══ O bg-ink POR BAIXO DA FOTO ══
 *
 * A foto cobre a faixa inteira, então o bg-ink quase nunca aparece — ele existe
 * para o intervalo entre o layout e o decode da imagem, e porque a seção deixou
 * de ter um fundo emprestado: até esta rodada um arco dourado em app/page.tsx
 * envolvia esta faixa e o ComoTrabalhamos. O arco saiu, a página ficou com um
 * bloom só, e o fim dela é ink chapado da paralaxe ao rodapé.
 *
 * ══ A FOTO ══
 *
 * ⚠ O TRATAMENTO ESTÁ NO ARQUIVO, NÃO NO CSS. O escurecimento é um véu uniforme
 * gravado em /public/cta pelo scripts/trata-foto-cta.mjs. Não acrescente
 * overlay, gradiente ou filter por cima daqui — se faltar contraste, muda o véu
 * do script e remede.
 *
 * Uniforme, e não rampa lateral, porque o conteúdo é centralizado: a parte
 * escura tem de estar no meio, e com o texto podendo ocupar qualquer largura o
 * uniforme é o único que não deixa buraco.
 *
 * ══ O LOGOTIPO E O BOTÃO ══
 *
 * ⚠ É o logo-imperio-nav.png, dourado #B79653, porque o fundo é escuro. O
 * logo-imperio-rodape.png é o gold-dk e existe para superfície clara.
 *
 * O botão é O MESMO da hero — components/ui/botao-contato.tsx. Aqui ele já
 * foi uma pílula dourada cheia com seta; foi unificado a pedido, com o da hero
 * como referência. Não recrie um botão local nesta faixa.
 */
export function ChamadaFinal() {
  return (
    <section className="relative isolate flex w-full min-h-[18.5rem] flex-col items-center justify-center overflow-hidden bg-ink px-gutter-sm py-12 text-center min-[768px]:aspect-[1920/396] min-[768px]:px-gutter min-[768px]:py-0">
      <Image
        src={fotoCta}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-10 object-cover"
        placeholder="blur"
      />

      <Image
        src={logoMarca}
        alt="Império Construtora"
        className="h-11 w-auto min-[768px]:h-12"
        sizes="70px"
      />

      <h2 className="mt-7 max-w-[18ch] text-heading-sm text-bone min-[768px]:mt-8 min-[768px]:text-heading">
        {chamadaFinal.statement}
      </h2>

      {/* O MESMO botão da hero — components/ui/botao-contato.tsx. O div
          isolate prende as camadas internas dele (z-30, z-40) aqui dentro. */}
      <div className="isolate mt-8">
        <BotaoContato href={ROTA_CONTATO} rotulo={chamadaFinal.botao} />
      </div>
    </section>
  );
}
