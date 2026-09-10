import { MenuHero } from "@/components/menu-hero";

/**
 * BLOCO 1a — Botão de menu fixo
 *
 * Só o botão mora aqui. Os ícones sociais SAÍRAM: eles não acompanham a
 * rolagem e voltaram para dentro da hero, na fila do CTA. Ver sociais-hero.tsx.
 *
 * ⚠ POR QUE FORA DA HERO: a <section> da hero é `overflow-hidden`. Um filho
 * `fixed` escapa do clip enquanto nenhum ancestral tiver transform, filter ou
 * contain — o dia em que a hero ganhar um desses, o botão sumiria da página
 * inteira sem quebrar build nem lint. Pendurado direto na rota, não existe
 * ancestral para quebrar.
 *
 * ⚠ z-50 é o topo do site. O mapa em uso vai até z-40 (separadores da faixa de
 * paralaxe); o overlay do menu, em z-[9], fica DENTRO deste elemento e portanto
 * dentro do contexto de empilhamento dele — sobe junto sem disputar com o resto
 * da página.
 *
 * Houve aqui um flex-col com gap entre o botão e a pastilha dos ícones. Com um
 * filho só, não sobra o que alinhar.
 */
export function NavegacaoFixa() {
  return (
    <div className="fixed right-0 top-0 z-50 p-8">
      <MenuHero />
    </div>
  );
}
