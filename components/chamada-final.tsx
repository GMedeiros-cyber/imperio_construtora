import { ArrowRight } from "lucide-react";
import Image from "next/image";

import fotoCta from "@/public/cta/canteiro-noturno.jpg";
import logoMarca from "@/public/hero/logo-imperio-nav.png";
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
 * O min-h existe porque só o aspect não basta: entre 768 e 992px a faixa ficaria
 * mais baixa que o próprio conteúdo e o texto vazaria.
 *
 * ⚠ E O w-full EXISTE POR CAUSA DO min-h. Com aspect-ratio e uma altura mínima
 * que o supere, o elemento cresce em LARGURA para manter a proporção: medido,
 * a faixa saía com 1305px dentro de um viewport de 768 e estourava a página na
 * horizontal. Com a largura fixada, o min-h só empurra a altura.
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
 * O botão é cheio, ao contrário do contorno da referência e do da hero: aquele
 * flutua sobre a foto da capa e não pode dominá-la, este é o fim da linha.
 * Contorno convida, cheio conclui.
 */
export function ChamadaFinal() {
  return (
    <section className="relative isolate flex w-full min-h-[24rem] flex-col items-center justify-center overflow-hidden px-gutter-sm py-16 text-center min-[768px]:aspect-[1920/565] min-[768px]:px-gutter min-[768px]:py-0">
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

      <p className="mt-4 max-w-[52ch] text-body text-ash">
        {chamadaFinal.apoio}
      </p>

      <a
        href={ROTA_CONTATO}
        className="mt-8 inline-flex h-12 items-center justify-center gap-3 rounded-pill bg-gold px-7 text-body-sm uppercase tracking-[0.1em] text-ink transition-colors hover:bg-gold-lt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
      >
        {chamadaFinal.botao}
        <ArrowRight aria-hidden className="size-4 shrink-0" strokeWidth={1} />
      </a>
    </section>
  );
}
