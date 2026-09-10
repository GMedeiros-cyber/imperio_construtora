import { MenuHero } from "@/components/menu-hero";
import { SociaisHero } from "@/components/sociais-hero";

/**
 * BLOCO 1a — Coluna fixa de navegação
 *
 * Botão de menu e ícones sociais vivem AQUI, e não mais dentro da hero.
 *
 * ⚠ POR QUE FORA DA HERO: a <section> da hero é `overflow-hidden`. Um filho
 * `fixed` escapa do clip enquanto nenhum ancestral tiver transform, filter ou
 * contain — o dia em que a hero ganhar um desses, o botão sumiria da página
 * inteira sem quebrar build nem lint. Pendurado direto na rota, não existe
 * ancestral para quebrar.
 *
 * ⚠ A COLUNA É UM SÓ ELEMENTO FIXO, com o botão e os ícones dentro. Fossem
 * dois fixos irmãos, cada um com o próprio `top`, o conjunto se desalinharia
 * ao mudar a altura do botão. Assim o gap-[25px] resolve o alinhamento.
 *
 * ⚠ z-50 é o topo do site. O mapa em uso vai até z-40 (separadores da faixa de
 * paralaxe); o overlay do menu, em z-[9], fica DENTRO desta coluna e portanto
 * dentro do contexto de empilhamento dela — sobe junto sem disputar com o
 * resto da página.
 */
export function NavegacaoFixa() {
  return (
    <div className="fixed right-0 top-0 z-50 flex flex-col items-end gap-[25px] p-8">
      <MenuHero />
      <SociaisHero />
    </div>
  );
}
