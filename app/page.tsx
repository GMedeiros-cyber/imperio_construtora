import { Clientes } from "@/components/clientes";
import { ComoTrabalhamos } from "@/components/como-trabalhamos";
import { Contato } from "@/components/contato";
import { FaixaParalaxe } from "@/components/faixa-paralaxe";
import { Hero } from "@/components/hero";
import { ObrasEntregues } from "@/components/obras-entregues";
import { ObrasHorizontal } from "@/components/obras-horizontal";
import { OQueFazemos } from "@/components/o-que-fazemos";
import { ParticipacaoTecnica } from "@/components/participacao-tecnica";
import { SiteFooter } from "@/components/site-footer";

/** Home — ordem dos blocos. */
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
      <Contato />
      <SiteFooter />
    </>
  );
}
