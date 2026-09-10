/**
 * Logos dos clientes, para a faixa de marcas logo abaixo da hero.
 *
 * ══ POR QUE A FAIXA É CLARA, E NÃO PRETA ══
 *
 * O pedido era faixa preta. Não fecha com as logos coloridas, e isto foi
 * medido, não estimado — contraste da tinta média de cada marca:
 *
 *              sobre ink   sobre bone
 *   Artwalk       5,7:1       3,3:1
 *   PETZ          4,8:1       3,9:1
 *   Líquido       3,9:1       4,8:1
 *   Leovit        3,8:1       4,9:1
 *   Boali         2,6:1       7,1:1     49% da tinta reprova no ink
 *   OFOS          1,5:1      12,1:1     85% reprova
 *   Magicfeet     1,2:1      15,5:1     100% reprova
 *   Authentic     1,1:1      19,7:1     100% reprova
 *   Adidas        1,0:1      19,3:1     100% reprova
 *   Videira       2,3:1       8,1:1     100% reprova
 *
 * Seis das dez somem sobre o preto; as dez passam dos 3:1 sobre o creme.
 * Marca preta por natureza — Adidas, Authentic Feet, Magicfeet — não tem
 * versão clara para dar, e clarear logo alheia é adulterar identidade.
 *
 * ⚠ SE A FAIXA VOLTAR A SER ESCURA, ESTAS LOGOS NÃO VÃO JUNTO. Existem as
 * silhuetas bone em /logos/bone, que funcionam no escuro mas jogam a cor fora.
 * É uma escolha ou a outra; não há terceira.
 *
 * ══ OS ARQUIVOS ══
 *
 * /logos/cor  — as originais coloridas, transparentes, APARADAS na caixa real
 *               da tinta. A aparagem importa: vinham com margem transparente
 *               muito diferente entre si (a Artwalk ocupava 445x63 de um canvas
 *               500x500), e sem aparar o dimensionamento mede o vazio.
 * /logos      — silhuetas ink da entrega anterior, mantidas como fonte.
 * /logos/bone — as mesmas em bone, para superfície escura.
 *
 * ⚠ A Riformato Construtora está em `clientes` mas não tem arquivo. É a única
 * das onze que falta.
 *
 * ══ ESCALA ÓPTICA ══
 *
 * As proporções vão de 7,06:1 (Artwalk) a 0,84:1 (Leovit), e a densidade de
 * tinta de 0,227 (Boali) a 0,546 (PETZ). Só limitar altura e largura deixaria
 * a PETZ pesando o triplo da Leovit, porque o olho compara ÁREA DE TINTA, não
 * altura. `escala` iguala essa área: saiu de medir largura x altura x
 * densidade de cada uma no tamanho renderizado, com o alvo na mediana e teto
 * em 0,80–1,35 para nenhuma marca ficar caricata.
 */

export type LogoCliente = {
  /* Vira o alt da imagem. É o nome da marca, não "logo da marca": o leitor de
     tela já anuncia que é imagem. */
  nome: string;
  arquivo: string;
  /* Medidas da caixa APARADA — o next/image usa para reservar espaço. */
  largura: number;
  altura: number;
  /* Correção óptica. Ver o comentário acima. */
  escala: number;
};

export const logosClientes: LogoCliente[] = [
  { nome: "PETZ", arquivo: "/logos/cor/petz.png", largura: 290, altura: 157, escala: 0.8 },
  { nome: "Artwalk", arquivo: "/logos/cor/artwalk.png", largura: 445, altura: 63, escala: 0.95 },
  { nome: "Boali", arquivo: "/logos/cor/boali.png", largura: 639, altura: 145, escala: 1.1 },
  { nome: "Magicfeet", arquivo: "/logos/cor/magicfeet.png", largura: 566, altura: 129, escala: 1.05 },
  { nome: "Authentic Feet", arquivo: "/logos/cor/authentic-feet.png", largura: 556, altura: 161, escala: 0.8 },
  { nome: "Adidas", arquivo: "/logos/cor/adidas.png", largura: 205, altura: 136, escala: 1.06 },
  { nome: "Líquido", arquivo: "/logos/cor/liquido.png", largura: 258, altura: 229, escala: 1.35 },
  { nome: "OFOS", arquivo: "/logos/cor/ofos.png", largura: 169, altura: 44, escala: 0.88 },
  { nome: "Leovit", arquivo: "/logos/cor/leovit.png", largura: 110, altura: 131, escala: 1.35 },
  { nome: "Transportadora Videira", arquivo: "/logos/cor/videira.png", largura: 266, altura: 55, escala: 0.83 },
];
