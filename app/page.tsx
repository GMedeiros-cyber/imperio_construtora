import { ChamadaFinal } from "@/components/chamada-final";
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
      <Clientes />
      <OQueFazemos />
      <ObrasHorizontal />
      <FaixaParalaxe />
      <ComoTrabalhamos />
      <ChamadaFinal />
      <SiteFooter />
    </>
  );
}
