import { ChamadaFinal } from "@/components/chamada-final";
import { FundoGradiente } from "@/components/ui/background-rowds-shop-v1";
import { Clientes } from "@/components/clientes";
import { ComoTrabalhamos } from "@/components/como-trabalhamos";
import { FaixaParalaxe } from "@/components/faixa-paralaxe";
import { Hero } from "@/components/hero";
import { NavegacaoFixa } from "@/components/navegacao-fixa";
import { ObrasHorizontal } from "@/components/obras-horizontal";
import { OQueFazemos } from "@/components/o-que-fazemos";
import { SiteFooter } from "@/components/site-footer";

/* Home — ordem dos blocos.

   ObrasEntregues e ParticipacaoTecnica SAÍRAM, e o ComoTrabalhamos absorveu o
   que elas tinham de próprio. Eram duplicação: o "+100 lojas entregues" já
   está nos números do OQueFazemos, e as três obras do ObrasEntregues eram as
   MESMAS do ObrasHorizontal, duas seções acima.

   O bloco 10 (Contato) SAIU daqui e virou a rota /contato. Com ele foi embora
   o último id="contato" da home, então não sobrou âncora para ninguém apontar:
   menu, CTA da hero e rodapé vão para a rota. Ver lib/rotas.ts.

   ══ A FAIXA DE MARCAS SUBIU, E ISSO É DE PROPÓSITO ══

   Clientes era o penúltimo bloco e agora é o segundo. Prova social serve no
   momento da dúvida, logo depois da promessa da hero — no fim da página ela
   chegava tarde.

   Ela é CLARA, e não escura como se cogitou: as logos entram nas cores
   originais das marcas, e seis das dez reprovam em contraste sobre o ink. A
   medição está em lib/logos.ts. O corte embaixo da hero continua existindo,
   invertido — a foto escurece na base e o creme entra por baixo.

   No lugar que ela deixou entrou a ChamadaFinal. O ritmo da página é claro
   (hero e marcas) / escuro a partir do OQueFazemos e ATÉ O FIM: obras, faixa de
   paralaxe, como trabalhamos, chamada final e rodapé são todos ink. A única
   inversão de volta ao claro está no miolo, na seção de obras. */
export default function Home() {
  return (
    <>
      {/* Fora da hero de propósito: a coluna é fixa e acompanha a rolagem da
          página inteira. Ver components/navegacao-fixa.tsx. */}
      <NavegacaoFixa />

      <Hero />

      {/* ══ O ARCO ESCURO ══

          UM fundo só cobre as duas seções, e é por isso que ele mora aqui e não
          dentro de nenhuma delas. O gradiente sai do ink logo abaixo da hero,
          atravessa o carrossel de marcas aquecendo, floresce no dourado #6B6144
          a 82% da altura e VOLTA ao ink antes do fim.

          ⚠ O RETORNO AO PRETO É O PONTO. Enquanto o dourado terminava na borda,
          a seção de obras precisava de uma rampa para recebê-lo — e essa rampa
          virava uma faixa dourada no começo dela, com um risco visível na
          emenda. Com o arco fechando em ink, a borda é preto contra preto e não
          há o que emendar. Nenhuma das duas seções tem fundo próprio.

          ⚠ AS PARADAS CODIFICAM A PROPORÇÃO ENTRE OS DOIS BLOCOS: o carrossel
          ocupa os primeiros ~32%, e é lá que o #16130E cai — o valor em que o
          "O que fazemos" começava quando tinha fundo próprio. Mudou a altura de
          um dos dois, remeça o contraste do eyebrow dourado e do texto miúdo,
          que dependem de onde cada parada cai. Ver o cabeçalho do
          o-que-fazemos. */}
      <div className="relative isolate">
        <FundoGradiente className="absolute inset-0 -z-10" />
        <Clientes />
        <OQueFazemos />
      </div>
      <ObrasHorizontal />
      <FaixaParalaxe />
      {/* ══ O FIM DA PÁGINA É PRETO CHAPADO, SEM ARCO ══

          Aqui existia um SEGUNDO arco dourado, espelho do de cima, envolvendo
          ComoTrabalhamos e ChamadaFinal num invólucro com <FundoGradiente>. Ele
          SAIU: sobrou UM bloom só na página, o de cima. Dois florescimentos de
          dourado davam à página duas vezes o mesmo gesto, e o de baixo era o
          mais fraco dos dois — a chamada final é uma FAIXA com foto de fundo,
          que cobria o gradiente inteiro no trecho onde ele deveria fechar, e o
          pico precisava ser empurrado para o miolo do ComoTrabalhamos para não
          virar uma tira dourada solta acima da faixa.

          No lugar dele, ink chapado: o mesmo #0A0A0A da faixa de paralaxe segue
          sem interrupção pelo ComoTrabalhamos, passa por baixo da barra do CTA e
          entra no rodapé, que também é bg-ink. Quatro seções, uma cor — não há
          emenda para ninguém ver.

          ⚠ CADA SEÇÃO CARREGA O PRÓPRIO bg-ink AGORA. Sem o invólucro não há
          quem pinte o fundo por elas: tirar o bg-ink de qualquer uma reabre o
          creme do body no meio do bloco escuro.

          ⚠ O TEXTO DAS DUAS JÁ ESTAVA INVERTIDO (bone, ash, gold) e continua —
          o ink chapado é mais escuro que a base do bloom que saiu, então o
          contraste só subiu. Medido: nada abaixo de 4,5:1. */}
      <ComoTrabalhamos />
      <ChamadaFinal />

      <SiteFooter />
    </>
  );
}
