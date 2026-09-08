import { Clientes } from "@/components/clientes";
import { ComoTrabalhamos } from "@/components/como-trabalhamos";
import { Contato } from "@/components/contato";
import { FaixaParalaxe } from "@/components/faixa-paralaxe";
import { HeroComposicao } from "@/components/hero-composicao";
import { HeaderLockup } from "@/components/header-lockup";
import { Numeros } from "@/components/numeros";
import { ObrasEntregues } from "@/components/obras-entregues";
import { ParticipacaoTecnica } from "@/components/participacao-tecnica";
import { QuemSomos } from "@/components/quem-somos";
import { SiteFooter } from "@/components/site-footer";

/** Home — ordem dos blocos conforme o DESIGN.md. */
export default function Home() {
  return (
    <>
      <HeaderLockup />
      <HeroComposicao />
      <Numeros />
      <QuemSomos />
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
