import { Clientes } from "@/components/clientes";
import { ComoTrabalhamos } from "@/components/como-trabalhamos";
import { Contato } from "@/components/contato";
import { DisplayPoster } from "@/components/display-poster";
import { HeaderLockup } from "@/components/header-lockup";
import { HeroImageBand } from "@/components/hero-image-band";
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
      <DisplayPoster />
      <HeroImageBand />
      <Numeros />
      <QuemSomos />
      <ObrasEntregues />
      <ParticipacaoTecnica />
      <ComoTrabalhamos />
      <Clientes />
      <Contato />
      <SiteFooter />
    </>
  );
}
