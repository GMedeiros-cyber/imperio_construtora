import { DisplayPoster } from "@/components/display-poster";
import { HeaderLockup } from "@/components/header-lockup";
import { HeroImageBand } from "@/components/hero-image-band";
import { ObrasGrid } from "@/components/obras-grid";
import { SectionTitleBlock } from "@/components/section-title-block";
import { SiteFooter } from "@/components/site-footer";

/**
 * Home — ordem dos blocos conforme o DESIGN.md:
 * header lockup, display poster, hero band, section title, grid, footer.
 */
export default function Home() {
  return (
    <>
      <HeaderLockup />
      <DisplayPoster />
      <HeroImageBand />

      <section id="obras" className="flex flex-col gap-section py-section">
        <SectionTitleBlock />
        <ObrasGrid />
      </section>

      <SiteFooter />
    </>
  );
}
