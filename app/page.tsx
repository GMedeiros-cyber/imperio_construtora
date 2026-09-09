import { Clientes } from "@/components/clientes";
import { ComoTrabalhamos } from "@/components/como-trabalhamos";
import { FaixaParalaxe } from "@/components/faixa-paralaxe";
import { Hero } from "@/components/hero";
import { ObrasEntregues } from "@/components/obras-entregues";
import { ObrasHorizontal } from "@/components/obras-horizontal";
import { OQueFazemos } from "@/components/o-que-fazemos";
import { ParticipacaoTecnica } from "@/components/participacao-tecnica";
import { SiteFooter } from "@/components/site-footer";

/* Home — ordem dos blocos.

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
      <ObrasEntregues />
      <ParticipacaoTecnica />
      <ComoTrabalhamos />
      <Clientes />
      <SiteFooter />
    </>
  );
}
