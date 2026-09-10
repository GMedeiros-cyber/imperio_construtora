import { ChamadaFinal } from "@/components/chamada-final";
import { FundoGradiente } from "@/components/ui/background-rowds-shop-v1";
import { Clientes } from "@/components/clientes";
import { ComoTrabalhamos } from "@/components/como-trabalhamos";
import { FaixaParalaxe } from "@/components/faixa-paralaxe";
import { Hero } from "@/components/hero";
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

   No lugar que ela deixou entrou a ChamadaFinal, essa sim em ink. O ritmo da
   página fica claro / escuro (OQueFazemos) / claro / escuro (ChamadaFinal) /
   claro (rodapé): dois campos invertidos, nas duas pontas do miolo. */
export default function Home() {
  return (
    <>
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
      {/* ══ O ARCO DE BAIXO ══

          Espelha o de cima, e fecha a página. O ink entra pelo ComoTrabalhamos,
          aquece ao longo dele e floresce em dourado exatamente sobre a chamada
          final — o momento da decisão é o único da página, além da promessa lá
          em cima, que recebe luz. Depois o dourado apaga: os últimos 260px caem
          no ink do rodapé, e a emenda com ele é preto contra preto.

          ⚠ O FECHO TEM DE TERMINAR NA COR DO RODAPÉ. É o que faz a borda entre
          os dois não existir. Mexeu na cor de um, mexa no outro no mesmo
          commit. */}
      <div className="relative isolate">
        <FundoGradiente
          className="absolute inset-0 -z-10"
          bloom="linear-gradient(170deg, #0A0A0A 0%, #16130E 22%, #372F20 48%, #6B6144 82%, #6B6144 100%)"
          fecho="linear-gradient(to bottom, transparent calc(100% - 260px), #0A0A0A 100%)"
        />
        <ComoTrabalhamos />
        <ChamadaFinal />
      </div>

      <SiteFooter />
    </>
  );
}
