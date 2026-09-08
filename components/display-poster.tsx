import { display } from "@/lib/dados";

/**
 * BLOCO 2 — Display Poster Headline
 * 84px peso 300, tracking -0.04em, line-height 1.0. Ocupa ~40% da altura da
 * viewport. Duas linhas, nunca mais.
 */
export function DisplayPoster() {
  return (
    <section id="inicio" className="flex h-[40vh] items-center px-gutter-sm md:px-gutter">
      <h1 className="text-heading-sm sm:text-heading md:text-display">
        {display.linhas.map((linha) => (
          <span key={linha} className="block">
            {linha}
          </span>
        ))}
      </h1>
    </section>
  );
}
