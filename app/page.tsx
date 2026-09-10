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
   menu, CTA da hero e rodapé vão para a rota. Ver lib/rotas.ts. */
export default function Home() {
  return (
    <>
      <Hero />
      <OQueFazemos />
      <ObrasHorizontal />
      <FaixaParalaxe />
      <ComoTrabalhamos />
      <Clientes />
      <SiteFooter />
    </>
  );
}
